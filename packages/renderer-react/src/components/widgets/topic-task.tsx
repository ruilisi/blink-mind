import { BlockType } from '@blink-mind/core';
import debug from 'debug';
import * as React from 'react';
import { iconClassName, IconName } from '../../utils';
import { TopicBlockIcon } from '../common/styled';

const log = debug('node:topic-desc');

export function TopicTask(props) {
  const { controller, model, topicKey } = props;

  const desc = model.getTopic(topicKey).getBlock(BlockType.TASK);

  if (!desc.block) {
    return null;
  }

  const onClick = e => {
    e.stopPropagation();
    controller.run('openTask', { ...props, task: desc.block });
  };

  return (
    <TopicBlockIcon
      onClick={onClick}
      className={iconClassName(IconName.SHOW_MENU)}
      tabIndex={-1}
    />
  );
}
