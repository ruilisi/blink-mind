import { Model } from '@blink-mind/core';
import { JsonSerializerPlugin } from '@blink-mind/plugin-json-serializer';
import { ThemeSelectorPlugin } from '@blink-mind/plugin-theme-selector';
import {
  ExportFilePlugin,
  OpenFilePlugin,
  SearchPlugin,
  TagsPlugin,
  TopicReferencePlugin,
  UndoRedoPlugin
} from '@blink-mind/plugins';
import {
  Diagram,
  iconClassName,
  IconName,
  ToolbarItem,
  ToolbarItemConfigs
} from '@blink-mind/renderer-react';
import { storiesOf } from '@storybook/react';
import * as React from 'react';
import styled from 'styled-components';
import { BaseDemo } from '../common';
// import debug from 'debug';
// const log = debug('story:app');

const Container = styled.div`
  width: 100%;
  height: 100%;
`;

function CorePlugin() {
  return {
    getExtraMenu: (props, next) => {
      return [
        ['test1', 'Test1'],
        ['test2', 'Test2']
      ];
    },
    extraMenuClick: ({ buttonKey }) => {
      console.info(buttonKey);
    },
    renderTopicBlockExtra: (ctx: any) => {
      const block = ctx.block;
      switch (block.type) {
        case 'IMAGE':
          return (
            <span tabIndex={-1} className={'tupian'}>
              IMAG
            </span>
          );
        default:
          break;
      }
      return null;
    }
  };
}

const plugins = [
  CorePlugin()
  // RichTextEditorPlugin(),
  // ThemeSelectorPlugin(),
  // TopicReferencePlugin(),
  // SearchPlugin(),
  // OpenFilePlugin(),
  // ExportFilePlugin(),
  // UndoRedoPlugin(),
  // TagsPlugin(),
  // ChangeThemePlugin(),
  // TopologyDiagramPlugin(),
  // JsonSerializerPlugin()
];

class AppDemo extends BaseDemo {
  constructor(props) {
    super(props);
  }

  initModel() {
    this.state = {
      model: Model.create({
        rootTopicKey: 'root',
        topics: [
          {
            key: 'root',
            blocks: [{ type: 'CONTENT', data: 'MainTopic' }],
            subKeys: ['sub1', 'sub2']
          },
          {
            key: 'sub1',
            parentKey: 'root',
            blocks: [{ type: 'CONTENT', data: 'SubTopic1' }],
            subKeys: ['sub1_1', 'sub1_2'],
            collapse: false
          },
          {
            key: 'sub1_1',
            parentKey: 'sub1',
            blocks: [{ type: 'CONTENT', data: 'SubTopic' }],
            collapse: false
          },
          {
            key: 'sub1_2',
            parentKey: 'sub1',
            blocks: [{ type: 'CONTENT', data: 'SubTopic' }],
            collapse: false
          },
          {
            key: 'sub2',
            subKeys: ['sub2_1', 'sub2_2'],
            parentKey: 'root',
            blocks: [{ type: 'CONTENT', data: 'SubTopic2' }]
          },
          {
            key: 'sub2_1',
            parentKey: 'sub2',
            blocks: [
              { type: 'CONTENT', data: 'SubTopic' },
              {
                type: 'IMAGE',
                data: {
                  src: 'https://assets.ruilisi.com/UMl=wIs5l=dPg4jOa76uYA==',
                  id: 'hello-world'
                }
              }
            ],
            collapse: false
          },
          {
            key: 'sub2_2',
            parentKey: 'sub2',
            blocks: [
              { type: 'CONTENT', data: 'SubTopic' },
              { type: 'TASK', data: { id: '123' } }
            ],
            collapse: false
          }
        ]
      })
    };
  }

  diagram;
  diagramRef = e => {
    this.diagram = e;
  };
  renderDiagram() {
    return (
      <Container>
        <Diagram
          model={this.state.model}
          onChange={this.onChange}
          plugins={plugins}
          ref={this.diagramRef}
        />
      </Container>
    );
  }
}

storiesOf('app', module).add('app', () => <AppDemo />);
