import { DiagramLayoutType, Model, TopicDirection } from '@blink-mind/core';
import cx from 'classnames';
import * as React from 'react';
import styled, { css } from 'styled-components';
import { collapseRefKey } from '../../utils';

const Icon = styled.div`
  position: absolute;
  top: calc(50% - 10px);
  ${({ dir, layoutDir }) => {
    if (
      dir === TopicDirection.RIGHT ||
      layoutDir == DiagramLayoutType.LEFT_TO_RIGHT
    )
      return css`
        right: -25px;
      `;
    if (
      dir === TopicDirection.LEFT ||
      layoutDir == DiagramLayoutType.RIGHT_TO_LEFT
    )
      return css`
        left: -25px;
      `;
  }};
  border-radius: 50%;
  width: 20px;
  height: 20px;
  text-align: center;
  //@ts-ignore
  background: ${props => props.background};
  border: 3px solid ${props => props.color};
  color: ${props => props.color};
  cursor: pointer;
  padding: 0;
  font-size: 10px !important;
  font-weight: 600;
  line-height: 14px;
  z-index: 2;
`;

export function TopicCollapseIcon(props) {
  const { model, topicKey, topicStyle, dir, saveRef, onClickCollapse } = props;
  const topic = model.getTopic(topicKey);
  return topic.subKeys.size > 0 ? (
    <Icon
      ref={saveRef(collapseRefKey(topicKey))}
      onClick={onClickCollapse}
      background={topicStyle.background}
      color={topic.color || 'black'}
      dir={dir}
      layoutDir={(model as Model).config.layoutDir}
      className={cx({
        icon: true,
        iconfont: true,
        [`icon-${topic.collapse ? 'plus' : 'minus'}`]: true
      })}
    />
  ) : null;
}
