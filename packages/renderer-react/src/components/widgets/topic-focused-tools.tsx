import { FocusMode } from '@blink-mind/core';
import * as React from 'react';
import styled from 'styled-components';
import { contentRefKey, getRelativeRect, RefKey } from '../../utils';
import { BaseProps, BaseWidget } from '../common';

const FocusHighlightContainer = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 2;
  pointer-events: none;
`;

const FocusSvg = styled.svg`
  width: 100%;
  height: 100%;
`;

interface State {
  rect: any;
}

export class TopicFocusedTools extends BaseWidget<BaseProps, State> {
  state = {
    rect: null
  };

  layout() {
    const { getRef, model, zoomFactor } = this.props;
    const focusKey = model.focusKey;
    const focusMode = model.focusMode;
    if (!focusKey || focusMode === FocusMode.EDITING_CONTENT) {
      this.setState({
        rect: null
      });
      return;
    }
    const content = getRef(contentRefKey(focusKey));
    if (!content) {
      this.setState({
        rect: null
      });
      return;
    }
    const bigView = getRef(RefKey.DRAG_SCROLL_WIDGET_KEY).bigView;
    const svg = getRef(RefKey.SVG_HIGHLIGHT_KEY);
    const contentRect = getRelativeRect(content, bigView, zoomFactor);
    const svgRect = getRelativeRect(svg, bigView, zoomFactor);
    const padding = 3;
    const x = contentRect.left - svgRect.left - padding;
    const y = contentRect.top - svgRect.top - padding;
    const width = contentRect.width + 2 * padding;
    const height = contentRect.height + 2 * padding;
    this.setState({
      rect: {
        x,
        y,
        width,
        height
      }
    });
  }

  render() {
    const { saveRef, model } = this.props;
    return (
      <>
        <FocusHighlightContainer ref={saveRef(RefKey.SVG_HIGHLIGHT_KEY)}>
          {this.state.rect && (
            <>
              <FocusSvg>
                <rect
                  {...this.state.rect}
                  fill="none"
                  stroke={model.config.theme.highlightColor}
                  strokeWidth={2}
                />
              </FocusSvg>
              <div
                style={{
                  width: 8,
                  height: 8,
                  background: 'red',
                  position: 'absolute',
                  left: this.state.rect.x + this.state.rect.width / 2,
                  top: this.state.rect.y - 16
                }}
              ></div>
              <div
                style={{
                  width: 8,
                  height: 8,
                  background: 'red',
                  position: 'absolute',
                  left: this.state.rect.x + this.state.rect.width + 16,
                  top: this.state.rect.y + this.state.rect.height / 2
                }}
              ></div>
              <div
                style={{
                  width: 8,
                  height: 8,
                  background: 'red',
                  position: 'absolute',
                  left: this.state.rect.x + this.state.rect.width / 2,
                  top: this.state.rect.y + this.state.rect.height + 16
                }}
              ></div>
            </>
          )}
        </FocusHighlightContainer>
      </>
    );
  }
}
