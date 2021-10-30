import { Controller, FocusMode, Model } from '@blink-mind/core';
import { HotKeysConfig } from '../../types';
import { HotkeysTarget2 } from '@blueprintjs/core';
import * as React from 'react';
import styled from 'styled-components';
import {
  contentRefKey,
  EventKey,
  RefKey,
  topicRefKey
} from '../../utils';
import { DragScrollWidget } from '../common';
const NodeLayer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  padding: 5px;
`;

const DIV = styled.div`
  width: 100%;
  height: 100%;
  background: ${props => props.theme.background};
`;

export interface MindDragScrollWidgetProps {
  controller: Controller;
  model: Model;
  saveRef?: Function;
  getRef?: Function;
  diagramState: any;
  setDiagramState: (any) => void;
}

class MindDragScrollWidget<
  P extends MindDragScrollWidgetProps
> extends React.PureComponent<MindDragScrollWidgetProps> {
  constructor(props: MindDragScrollWidgetProps) {
    super(props);
  }

  droppingTopic;

  hotKeys = () => {
    const props = this.props;
    const { controller, model } = props;
    const hotKeys: HotKeysConfig = controller.run('customizeHotKeys', props);
    if (hotKeys === null) return null;
    if (
      !(
        hotKeys.topicHotKeys instanceof Map &&
        hotKeys.globalHotKeys instanceof Map
      )
    ) {
      throw new TypeError('topicHotKeys and globalHotKeys must be a Map');
    }
    const keys = [];
    if (
      model.focusMode === FocusMode.NORMAL ||
      model.focusMode === FocusMode.SHOW_POPUP
    ) {
      hotKeys.topicHotKeys.forEach(v => {
        v.global = true;
        keys.push(v);
      });
    }
    hotKeys.globalHotKeys.forEach(v => {
      v.global = true;
      keys.push(v);
    });
    return keys;
  };

  componentDidMount(): void {
    const { getRef, model, controller } = this.props;
    controller.run('addZoomFactorChangeEventListener', {
      ...this.props,
      listener: this.setZoomFactor
    });
    const rootTopic: HTMLElement = getRef(
      topicRefKey(model.editorRootTopicKey)
    );
    //TODO
    const nodeLayer: HTMLElement = getRef('node-layer');
    const rootTopicRect = rootTopic.getBoundingClientRect();
    const nodeLayerRect = nodeLayer.getBoundingClientRect();
    this.dragScrollWidget.setViewBoxScrollDelta(
      0,
      rootTopicRect.top -
        nodeLayerRect.top -
        this.dragScrollWidget.viewBox.getBoundingClientRect().height / 2 +
        rootTopicRect.height
    );
    this.layout();
  }

  componentWillUnmount(): void {
    const { controller } = this.props;
    controller.run('removeZoomFactorChangeEventListener', {
      ...this.props,
      listener: this.setZoomFactor
    });
  }

  get dragScrollWidget(): DragScrollWidget {
    return this.props.getRef(RefKey.DRAG_SCROLL_WIDGET_KEY);
  }

  componentDidUpdate(): void {
    const { controller } = this.props;
    controller.run('fireEvent', {
      ...this.props,
      key: EventKey.CENTER_ROOT_TOPIC
    });
    this.layout();
  }

  layout() {
    const { controller } = this.props;
    controller.run('layout', this.props);
  }

  setZoomFactor = zoomFactor => {
    this.dragScrollWidget.setZoomFactor(zoomFactor);
  };

  onWheel = e => {
    if (e.altKey || e.ctrlKey) {
      const { controller } = this.props;
      let zoomFactor = controller.run('getZoomFactor', this.props);
      zoomFactor = zoomFactor - (e.nativeEvent.deltaY > 0 ? 0.1 : -0.1);
      if (zoomFactor < 0.5) zoomFactor = 0.5;
      if (zoomFactor > 4) zoomFactor = 4;
      // console.log('zoomFactor=>', zoomFactor);
      controller.run('setZoomFactor', { ...this.props, zoomFactor });
    }
  };

  onDragOver = e => {
    const { getRef, model, controller } = this.props;
    e.preventDefault();
    e.stopPropagation();
    const boxes = [];
    const svgDropEffect = getRef('svg-drop-effect') as HTMLElement;
    const zoomFactor = controller.run('getZoomFactor', this.props);
    if (!svgDropEffect) return;

    const svgRect = svgDropEffect.getBoundingClientRect();
    for (const topicKey of model.topics.keys()) {
      if (model.focusKey === topicKey) {
        // skip self
        continue;
      }
      const content = getRef(contentRefKey(topicKey)) as HTMLElement;
      if (content) {
        const contentRect = content.getBoundingClientRect();
        const x =
          (contentRect.left - svgRect.left + contentRect.width) / zoomFactor;
        const y =
          (contentRect.top - svgRect.top + contentRect.height / 2) / zoomFactor;
        boxes.push({
          key: topicKey,
          rect: { x, y }
        });
      }
    }
    let minDist = Infinity;
    let droppingTarget;
    const pointerX = (e.clientX - svgRect.x) / zoomFactor;
    const pointerY = (e.clientY - svgRect.y) / zoomFactor;
    for (const box of boxes) {
      const dist =
        Math.pow(box.rect.x - pointerX, 2) + Math.pow(box.rect.y - pointerY, 2);
      if (dist < minDist) {
        minDist = dist;
        droppingTarget = box;
      }
    }
    if (droppingTarget) {
      svgDropEffect.innerHTML = `<g><path stroke="#FCB49A" stroke-width="3" fill="none" d="M ${droppingTarget.rect.x} ${droppingTarget.rect.y} L ${pointerX} ${pointerY}" /></g>`;
    }
    this.droppingTopic = droppingTarget;
  };

  onDrop = e => {
    if (this.droppingTopic) {
      this.props.controller.run('handleTopicDrop', {
        ...this.props,
        ev: e,
        dropDir: 'in',
        topicKey: this.droppingTopic.key
      });
    }
    this.droppingTopic = null;
  };

  onDragEnd = e => {
    const { getRef } = this.props;
    this.droppingTopic = null;
    const svgDropEffect = getRef('svg-drop-effect') as HTMLElement;
    if (svgDropEffect) {
      svgDropEffect.innerHTML = null;
    }
  };

  render() {
    const { saveRef, model, controller } = this.props;
    const nodeKey = model.editorRootTopicKey;
    return (
      <HotkeysTarget2 hotkeys={this.hotKeys()}>
        {({ handleKeyDown, handleKeyUp }) => (
          <DIV
            onWheel={this.onWheel}
            onDragOver={this.onDragOver}
            onDragEnd={this.onDragEnd}
            onDrop={this.onDrop}
            onKeyDown={handleKeyDown}
            onKeyUp={handleKeyUp}
          >
            <DragScrollWidget
              {...this.state}
              enableMouseWheel={false}
              zoomFactor={model.zoomFactor}
              ref={saveRef(RefKey.DRAG_SCROLL_WIDGET_KEY)}
            >
              {(
                setViewBoxScroll: (left: number, top: number) => void,
                setViewBoxScrollDelta: (left: number, top: number) => void
              ) => {
                const rootWidgetProps = {
                  ...this.props,
                  topicKey: nodeKey,
                  setViewBoxScroll,
                  setViewBoxScrollDelta
                };
                return (
                  <NodeLayer ref={saveRef('node-layer')}>
                    {controller.run('renderRootWidget', rootWidgetProps)}
                  </NodeLayer>
                );
              }}
            </DragScrollWidget>
          </DIV>
        )}
      </HotkeysTarget2>
    );
  }
}

export { MindDragScrollWidget };
