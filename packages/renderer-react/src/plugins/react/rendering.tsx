import { BlockType, FocusMode, OpType } from '@blink-mind/core';
import debug from 'debug';
import * as React from 'react';
import styled from 'styled-components';
import { SaveRef } from '../../components/common';
import { DIAGRAM_ROOT_KEY, linksRefKey } from '../../utils';
import { EditorRootBreadcrumbs } from './components/editor-root-breadcrumbs';
import { MindDragScrollWidget } from './components/mind-drag-scroll-widget';
import { ModalBody, ModalDescEditor } from './components/modal-body';
import { Modals } from './components/modals';
import { RootSubLinks } from './components/root-sublinks';
import { RootWidget } from './components/root-widget';
import { StyleEditor } from './components/style-editor/style-editor';
import { TopicCollapseIcon } from './components/topic-collapse-icon';
import { TopicContent } from './components/topic-content';
import { TopicContentEditorPopup } from './components/topic-content-editor-popup';
import { TopicContentWidget } from './components/topic-content-widget';
import { TopicContextMenu } from './components/topic-context-menu';
import { TopicDesc } from './components/topic-desc';
import { TopicHighlight } from './components/topic-highlight';
import { TopicSubLinks } from './components/topic-sub-links';
import { TopicWidget } from './components/topic-widget';
import { customizeTopicContextMenu } from './context-menus';
import Theme from './theme';
const log = debug('plugin:rendering');

export function RenderingPlugin() {
  const DiagramRoot = styled.div`
    width: 100%;
    height: 100%;
    background: ${props => props.theme.background};
    position: relative;
  `;
  return {
    renderDiagram(props) {
      const { model, controller } = props;
      return (
        <SaveRef>
          {(saveRef, getRef) => {
            const widgetProps = {
              ...props,
              saveRef,
              getRef
            };
            log('renderDiagram', model);
            return (
              <Theme theme={model.config.theme}>
                <DiagramRoot ref={saveRef(DIAGRAM_ROOT_KEY)}>
                  <MindDragScrollWidget {...widgetProps} />
                  {controller.run('renderDiagramCustomize', widgetProps)}
                </DiagramRoot>
              </Theme>
            );
          }}
        </SaveRef>
      );
    },

    renderDiagramCustomize(props) {
      const { controller, model } = props;
      const breadcrumbs = controller.run('renderEditorRootBreadcrumbs', {
        ...props,
        topicKey: model.focusKey
      });

      const styleEditor = controller.run('renderStyleEditor', {
        ...props,
        topicKey: model.focusKey
      });
      const modals = controller.run('renderModals', {
        ...props,
        topicKey: model.focusKey
      });
      return [breadcrumbs, styleEditor, modals];
    },

    renderEditorRootBreadcrumbs(props) {
      return <EditorRootBreadcrumbs key="EditorRootBreadcrumbs" {...props} />;
    },

    renderModals(props) {
      return <Modals key="modals" {...props} />;
    },

    renderModal(props) {
      // const { controller, model } = props;
      // const activeModalProps = controller.run('getActiveModalProps', props);
      // if (activeModalProps) {
      //   if (activeModalProps.name === 'edit-desc') {
      //     const modalProps = { ...props, topicKey: model.focusKey };
      //     return (
      //       <ModalBody>
      //         <ModalDescEditor>
      //           {controller.run('renderTopicDescEditor', modalProps)}
      //         </ModalDescEditor>
      //       </ModalBody>
      //     );
      //   }
      // }
      return null;
    },

    getActiveModalProps(props) {
      // const { model } = props;
      // if (model.focusKey && model.focusMode === FocusMode.EDITING_DESC)
      //   return {
      //     name: 'edit-desc',
      //     title: 'Edit Notes',
      //     style: {
      //       width: '50%',
      //       height: '600px'
      //     }
      //   };
      return null;
    },

    renderDoc({ children }) {
      return children;
    },

    renderRootWidget(props) {
      return <RootWidget {...props} />;
    },

    renderTopicWidget(props) {
      return <TopicWidget {...props} />;
    },

    renderTopicContent(props) {
      return <TopicContentWidget {...props} />;
    },

    renderTopicContextMenu(props) {
      return <TopicContextMenu {...props} />;
    },

    customizeTopicContextMenu,

    renderTopicCollapseIcon(props) {
      return <TopicCollapseIcon {...props} />;
    },

    renderTopicBlocks(props) {
      const { model, topicKey, controller } = props;
      const topic = model.getTopic(topicKey);
      const blocks = topic.blocks;
      const res = [];
      let i = 0;
      blocks.forEach(block => {
        const b = controller.run('renderTopicBlock', {
          ...props,
          block,
          blockKey: `block-${i}`
        });
        if (b) {
          res.push(<React.Fragment key={`block-${i}`}>{b}</React.Fragment>);
          i++;
        }
      });
      return res;
    },

    renderTopicBlock(props) {
      const { controller, block, topicKey, model } = props;
      const handleVisibleChange = visible => {
        if (!visible) {
          controller.run('operation', {
            ...props,
            opType: OpType.FOCUS_TOPIC,
            focusMode: FocusMode.NORMAL
          });
        }
      };
      switch (block.type) {
        case BlockType.CONTENT:
          return controller.run('renderTopicBlockContent', props);
        case BlockType.DESC:
          return controller.run('renderTopicBlockDesc', props);
        default:
          break;
      }
      return null;
    },

    renderTopicBlockContent(props) {
      return <TopicContent {...props} />;
    },

    renderTopicBlockDesc(props) {
      return <TopicDesc {...props} />;
    },

    renderSubLinks(props) {
      const { saveRef, topicKey, model } = props;
      const topic = model.getTopic(topicKey);
      if (topic.subKeys.size === 0 || topic.collapse) return null;
      return <TopicSubLinks ref={saveRef(linksRefKey(topicKey))} {...props} />;
    },

    renderRootSubLinks(props) {
      const { saveRef, topicKey, model } = props;
      const topic = model.getTopic(topicKey);
      if (topic.subKeys.size === 0) return null;
      return <RootSubLinks ref={saveRef(linksRefKey(topicKey))} {...props} />;
    },

    renderFocusItemHighlight(props) {
      const { saveRef } = props;
      return <TopicHighlight ref={saveRef('focus-highlight')} {...props} />;
    },

    renderRootWidgetOtherChildren(props) {
      const { controller } = props;
      return (
        <>
          {controller.run('renderRootSubLinks', props)}
          {controller.run('renderFocusItemHighlight', props)}
          {controller.run('renderDragAndDropEffect', props)}
        </>
      );
    },

    renderStyleEditor(props) {
      return <StyleEditor key="style-editor" {...props} />;
    }
  };
}
