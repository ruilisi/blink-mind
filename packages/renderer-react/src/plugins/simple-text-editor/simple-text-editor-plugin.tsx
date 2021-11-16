import { BlockType } from '@blink-mind/core';
import { contentEditorRefKey } from '@blink-mind/renderer-react';
import * as React from 'react';
import { replaceCaret } from './components/content-editable';
import { TopicContentEditor } from './components/topic-content-editor';

export function SimpleTextEditorPlugin() {
  return {
    getTopicTitle(props) {
      const { model, controller, topicKey, maxLength, getRef } = props;
      const topic = model.getTopic(topicKey);
      const block = topic.getBlock(BlockType.CONTENT).block;
      let text = controller.run('serializeBlockData', { ...props, block });
      if (maxLength != null) {
        text =
          text.length > maxLength ? text.substr(0, maxLength) + '...' : text;
      }
      return text;
    },

    renderTopicContentEditor(props) {
      return <TopicContentEditor {...props} />;
    },

    markdownNewLine(props) {
      const { getRef, topicKey } = props;
      const el = getRef(contentEditorRefKey(topicKey));
      const editorEle = el.children[0];
      const newBr = document.createTextNode('\n');
      const newEle = document.createElement('br');
      editorEle.appendChild(newBr);
      editorEle.appendChild(newEle);
      replaceCaret(editorEle);
    },

    isBlockEmpty(props, next) {
      const { block, controller } = props;
      if (block.type === BlockType.CONTENT || block.type === BlockType.TASK) {
        return (
          block.data == null ||
          controller.run('serializeBlockData', props) === ''
        );
      }
      return next();
    },

    serializeBlockData(props, next) {
      const { block } = props;
      if (block.type === BlockType.CONTENT || block.type === BlockType.TASK) {
        return block.data;
      }
      return next();
    }
  };
}
