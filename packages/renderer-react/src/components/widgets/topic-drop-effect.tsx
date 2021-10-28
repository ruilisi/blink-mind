import debug from 'debug';
import * as React from 'react';
import styled from 'styled-components';
import { BaseProps, BaseWidget } from '../common';
const log = debug('node:topic-drop-effect');

const DropEffectSvg = styled.svg`
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 2;
  pointer-events: none;
  overflow: visible;
`;

export class TopicDropEffect extends BaseWidget<BaseProps> {
  layout() {
  }
  render() {
    const { saveRef } = this.props;
    return (
      <DropEffectSvg ref={saveRef('svg-drop-effect')} />
    );
  }
}
