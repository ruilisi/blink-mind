import { Controller, KeyType, Model } from '@blink-mind/core';
import debug from 'debug';
import * as React from 'react';
import styled from 'styled-components';
import { ContentEditable } from './content-editable';
const log = debug('node:text-editor');
import ResizeObserver from 'resize-observer-polyfill';

interface ContentProps {
  readOnly?: boolean;
}

const Content = styled.div<ContentProps>`
  padding: 6px;
  background-color: ${props => (props.readOnly ? null : 'white')};
  cursor: ${props => (props.readOnly ? 'pointer' : 'text')};
  min-width: 50px;
`;

interface Props {
  controller: Controller;
  model: Model;
  readOnly: boolean;
  topicKey: KeyType;
  saveRef?: Function;
  getRef?: Function;
}

interface State {
  content: any;
}

export class SimpleTextEditor extends React.PureComponent<Props, State> {
  state = {
    content: null
  };

  onMouseDown = e => {
    e.stopPropagation();
  };

  onMouseMove = e => {
    // log('onMouseMove');
    // e.stopPropagation();
  };
  onChange(e) {
    log('onChange', e.target.value);
    this.setState({ content: e.target.value });
  }

  onKeyDown = e => {};

  componentDidMount() {
    // const { readOnly } = this.props;
    // if (readOnly) return;
    document.addEventListener('click', this._handleClick);
    const contentResizeObserver = new ResizeObserver(
      (entries: ResizeObserverEntry[], observer) => {
        this.props.controller.run('layout', this.props);
      }
    );
    contentResizeObserver.observe(
      this.props.getRef(
        this.getCustomizeProps().getRefKeyFunc(this.props.topicKey)
      )
    );
  }

  componentWillUnmount() {
    // const { readOnly } = this.props;
    // if (readOnly) return;
    document.removeEventListener('click', this._handleClick);
  }

  _handleClick = event => {
    const wasOutside = !this.root.contains(event.target);
    wasOutside && this.onClickOutSide(event);
  };

  onClickOutSide(e) {}

  getCustomizeProps() {
    return null;
  }

  constructor(props) {
    super(props);
    this.initState();
  }

  getContent() {
    const { block } = this.getCustomizeProps();
    return block.data;
  }

  initState() {
    const content = this.getContent();
    this.state = {
      content
    };
  }

  root;

  rootRef = saveRef => ref => {
    saveRef(ref);
    this.root = ref;
  };

  render() {
    const { topicKey, saveRef, getRef } = this.props;
    const {
      readOnly,
      getRefKeyFunc,
      placeholder,
      style
    } = this.getCustomizeProps();
    log(readOnly);
    const key = getRefKeyFunc(topicKey);
    const content = readOnly ? this.getContent() : this.state.content;
    const { onMouseDown, onMouseMove, onKeyDown } = this;
    const editorProps = {
      html: content,
      readOnly,
      onChange: this.onChange.bind(this),
      placeholder,
      style
    };
    const shouldRenderAsMarkdown = this.props.controller.run(
      'shouldRenderAsMarkdown'
    );

    const contentProps = {
      key,
      readOnly,
      ref: this.rootRef(saveRef(key)),
      onMouseDown,
      onMouseMove,
      onKeyDown
    };
    return (
      <Content {...contentProps}>
        {shouldRenderAsMarkdown && this.props.readOnly ? (
          this.props.controller.run('renderTopicMarkdown', this.getContent())
        ) : (
          <ContentEditable {...editorProps} autoFocus />
        )}
      </Content>
    );
  }
}
