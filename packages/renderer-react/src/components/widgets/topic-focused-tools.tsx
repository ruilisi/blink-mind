import { createKey, FocusMode, OpType } from '@blink-mind/core';
import * as React from 'react';
import cx from 'classnames';
import styled from 'styled-components';
import { contentRefKey, getRelativeRect, I18nKey, RefKey } from '../../utils';
import { BaseProps, BaseWidget } from '../common';
import { ChromePicker } from 'react-color';
import { debounce } from 'lodash';

const FocusHighlightContainer = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 2;
  pointer-events: none;
`;

const FocusSvg = styled.svg`
  width: 100%;
  height: 100%;
  overflow: visible;
`;

const Toolbar = styled.div`
  font-weight: 500;
  border: 1.5px solid rgb(233, 235, 241);
  border-radius: 7px;
  background: white;
  padding: 2px 3px;
  color: black;
  position: absolute;
  white-space: nowrap;
  pointer-events: auto;
`;

const Button = styled.div`
  display: inline-block;
  vertical-align: middle;
  border-radius: 4px;
  cursor: pointer;
  padding: 4px 8px;
  &:hover {
    background: rgb(242, 242, 242);
  }
`;

const Icon = styled.div`
  position: absolute;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  text-align: center;
  background: rgb(8, 170, 255);
  cursor: pointer;
  padding: 0;
  font-size: 12px !important;
  line-height: 24px;
  border: 0;
  z-index: 2;
  color: white;
  pointer-events: auto;
`;

const ColorIndicator = styled.div`
  display: inline-block;
  border-radius: 50%;
  background: ${props => props.color};
  width: 16px;
  height: 16px;
  padding: 0;
  border: 0;
  vertical-align: middle;
`;

const Divider = styled.div`
  display: inline-block;
  width: 1px;
  height: 18px;
  margin-left: 4px;
  margin-right: 4px;
  background: rgb(233, 235, 241);
  vertical-align: middle;
`;

const ColorLabel = styled.div`
  width: 18px;
  height: 18px;
  position: relative;
  > div {
    display: flex;
    width: 15px;
    height: 15px;
    border-radius: 4px;
    margin-top: 2px;
    cursor: pointer;
    justify-content: center;
    &:hover {
      width: 16px;
      height: 16px;
      zoom: 1;
      transform: scale(1.2);
    }
  }
`;

const ColorsWrapper = styled.div`
  justify-content: center;
  padding: 8px;
  display: flex;
  > div {
    max-width: 100%;
    display: flex;
    flex-wrap: wrap;
    gap: 12px 6px;
  }
  > span {
    display: flex;
    cursor: pointer;
    font-weight: 300;
    color: gray;
    font-size: 18px;
  }
`;

const Checked = styled.span`
  cursor: pointer;
  font-weight: 300;
  color: gray;
  font-size: 12px;
  color: white;
`;

const ColorPicker = styled.div`
  background: #f9f9f9;
  padding-bottom: 10px;
  .chrome-picker {
    width: 100% !important;
    background: #f9f9f9 !important;
    box-shadow: none !important;
  }
`;
const SaveButton = styled.div`
  display: flex;
  justify-content: center;
  background: rgb(8, 170, 255);
  color: white;
  margin-left: 10px;
  margin-right: 10px;
  height: 26px;
  border-radius: 4px;
  align-items: center;
  font-weight: 300;
  font-size: 15px;
  cursor: pointer;
`;

interface State {
  rect: any;
  color: string;
  colorBarBottom: number;
  displayColor: boolean;
  displayColorPicker: boolean;
}

const defaultColor = [
  '#7b68ee',
  '#ffa12f',
  '#ff5722',
  '#f42c2c',
  '#f8306d',
  '#ff00fc',
  '#4169e1',
  '#5f81ff',
  '#0ab4ff',
  '#08c7e0',
  '#07a092',
  '#1db954',
  '#2ea52c',
  '#757380',
  '#202020'
];

export class TopicFocusedTools extends BaseWidget<BaseProps, State> {
  state = {
    rect: null,
    colorBarBottom: 0,
    color: 'black',
    displayColor: false,
    displayColorPicker: false
  };

  toolbarRef?: HTMLElement;

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
    const colorBarBottom =
      svgRect.bottom - contentRect.bottom + contentRect.height + 2 * padding;
    let width = contentRect.width + 2 * padding;
    const height = contentRect.height + 2 * padding;
    const topic = model.getTopic(focusKey);
    if (!topic.subKeys.isEmpty()) {
      width += 30;
    }
    this.setState({
      color: `${(topic && topic.color) || 'black'}`,
      colorBarBottom,
      rect: {
        x,
        y,
        width,
        height
      }
    });

    if (!this.state.rect) {
      this.setState({
        displayColor: false,
        displayColorPicker: false
      });
    }
  }

  changeLinkColor = color => {
    const { controller, model } = this.props;
    controller.run('operation', {
      ...this.props,
      opType: OpType.SET_COLOR,
      topicKey: model.focusKey,
      color: color
    });
  };

  handlePickButtonClick = () => {
    this.setState({ displayColorPicker: !this.state.displayColorPicker });
  };

  handleColorClick = () => {
    this.setState({ displayColor: !this.state.displayColor });
  };

  handleColorClose = () => {
    this.setState({ displayColor: false });
    this.setState({ displayColorPicker: false });
  };

  handleSaveColor = () => {
    this.changeLinkColor(this.state.color);
    this.handleColorClose();
  };

  onColorChange = (color: { hex: string }) => {
    this.setState({ color: color.hex });
    this.changeLinkColor(color.hex);
  };

  render() {
    const { saveRef, model, controller } = this.props;

    return (
      <>
        <FocusHighlightContainer
          ref={saveRef(RefKey.SVG_HIGHLIGHT_KEY)}
          onClick={e => e.preventDefault()} // 告知onClickOutSide不要处理
        >
          {this.state.rect && (
            <>
              <FocusSvg>
                <rect
                  {...this.state.rect}
                  fill="none"
                  rx="7"
                  ry="7"
                  stroke={model.config.theme.highlightColor}
                  strokeWidth={2}
                />
              </FocusSvg>
              {this.state.displayColor && (
                <Toolbar
                  ref={e => (this.toolbarRef = e)}
                  style={{
                    padding: 0,
                    zIndex: 10,
                    width: '100%',
                    maxWidth: '250px',
                    left: this.state.rect.x + this.state.rect.width - 20,
                    bottom: this.state.colorBarBottom + 40
                  }}
                >
                  {this.state.displayColorPicker && (
                    <ColorPicker>
                      <ChromePicker
                        disableAlpha
                        color={this.state.color}
                        onChangeComplete={this.onColorChange}
                      />
                      <SaveButton onClick={() => this.handleSaveColor()}>
                        Save
                      </SaveButton>
                    </ColorPicker>
                  )}
                  <ColorsWrapper>
                    <div>
                      {defaultColor.map(color => {
                        const isChecked = this.state.color === color;
                        return (
                          <ColorLabel key={color}>
                            <div
                              style={{
                                background: color,
                                width: `${isChecked ? '18px' : '15px'}`,
                                height: `${isChecked ? '18px' : '15px'}`
                              }}
                              onClick={() => this.onColorChange({ hex: color })}
                            >
                              {isChecked && <Checked>✔</Checked>}
                            </div>
                          </ColorLabel>
                        );
                      })}
                      <ColorLabel>
                        <div
                          onClick={this.handlePickButtonClick}
                          style={{
                            margin: 0,
                            fontSize: 18,
                            fontColor: 'gray'
                          }}
                          className={cx({
                            icon: true,
                            iconfont: true,
                            ['bm-color-picker']: true
                          })}
                        />
                      </ColorLabel>
                    </div>
                    <span onClick={this.handleColorClose}>✕</span>
                  </ColorsWrapper>
                </Toolbar>
              )}
              <Toolbar
                ref={e => (this.toolbarRef = e)}
                style={{
                  left: this.state.rect.x + this.state.rect.width / 2 - 100,
                  top: this.state.rect.y - 33 - 6
                }}
              >
                <Button
                  onClick={ev => {
                    controller.run('handleCreateTaskClick', {
                      ...this.props,
                      ev
                    });
                  }}
                >
                  +{' '}
                  {controller.run('getI18nText', {
                    ...this.props,
                    key: I18nKey.CREATE_TASK
                  })}
                </Button>
                <Divider />
                <Button onClick={this.handleColorClick}>
                  <ColorIndicator color={this.state.color} />
                  <svg
                    viewBox="0 0 100 100"
                    width={7}
                    height={7}
                    style={{ marginLeft: 8, display: 'inline-block' }}
                  >
                    <polygon points="0 10, 100 10, 50 70" />
                  </svg>
                </Button>
                <Divider />
                <Button
                  onClick={() => {
                    controller.run('operation', {
                      ...this.props,
                      topicKey: model.focusKey,
                      opType: OpType.DELETE_TOPIC
                    });
                  }}
                >
                  <div
                    style={{ color: 'rgb(253,113,175)' }}
                    className={cx({
                      icon: true,
                      iconfont: true,
                      ['bm-trash']: true
                    })}
                  />
                </Button>
              </Toolbar>
              <Icon
                style={{
                  left: this.state.rect.x + this.state.rect.width + 8,
                  top: this.state.rect.y + this.state.rect.height / 2 - 12
                }}
                className={cx({
                  icon: true,
                  iconfont: true,
                  ['bm-plus']: true
                })}
                onClick={e => {
                  controller.run('operation', {
                    ...this.props,
                    topicKey: model.focusKey,
                    opType: OpType.ADD_CHILD,
                    newTopicKey: createKey()
                  });
                  e.stopPropagation();
                }}
              />
              {model.rootTopicKey !== model.focusKey && (
                <Icon
                  style={{
                    left: this.state.rect.x + this.state.rect.width / 2 - 12,
                    top: this.state.rect.y + this.state.rect.height + 8
                  }}
                  className={cx({
                    icon: true,
                    iconfont: true,
                    ['bm-add-sibling']: true
                  })}
                  onClick={e => {
                    controller.run('operation', {
                      ...this.props,
                      topicKey: model.focusKey,
                      opType: OpType.ADD_SIBLING,
                      newTopicKey: createKey()
                    });
                    e.stopPropagation();
                  }}
                />
              )}
            </>
          )}
        </FocusHighlightContainer>
      </>
    );
  }
}
