import { Diagram, HotKeysConfig } from '@blink-mind/renderer-react';
import { MenuDivider, MenuItem } from '@blueprintjs/core';
import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { BaseDemo } from '../common/base-demo';
//@ts-ignore
import addTopicContextMenuMdEn from './add-topic-context-menu-en.md';
//@ts-ignore
import addTopicContextMenuMdZh from './add-topic-context-menu-zh.md';
//@ts-ignore
import changeDefaultTopicContextMenuMdEn from './change-default-topic-context-menu-en.md';
//@ts-ignore
import changeDefaultTopicContextMenuMdZh from './change-default-topic-context-menu-zh.md';

function onClickMyMenu(props) {
  return function() {
    const { topicKey, controller } = props;
    alert(`this topic key is ${topicKey}`);
    const topicStyle = controller.run('getTopicContentStyle', props);
    alert(`this topic content style is ${JSON.stringify(topicStyle)}`);
  };
}

function HotKeyPlugin() {
  return {
    customizeHotKeys(props, next): HotKeysConfig {
      const hotKeys: HotKeysConfig = next();
      hotKeys.topicHotKeys.push({
        label: 'MY_CUSTOM',
        combo: 'shift + a',
        onKeyDown: e => {
          onClickMyMenu(props)();
        }
      });
      return hotKeys;
    }
  };
}

function AddTopicContextMenuPlugin() {
  return {
    customizeTopicContextMenu(props, next) {
      return (
        <>
          {next()}
          <MenuDivider />
          <MenuItem
            icon="group-objects"
            label="Shift + A"
            text="my customize menu"
            onClick={onClickMyMenu(props)}
          />
        </>
      );
    }
  };
}
const plugins = [AddTopicContextMenuPlugin(), HotKeyPlugin()];
export class AddTopicContextMenuDemo extends BaseDemo {
  renderDiagram() {
    return (
      <Diagram
        model={this.state.model}
        onChange={this.onChange}
        plugins={plugins}
      />
    );
  }
}

function ChangeDefaultTopicContextMenuPlugin() {
  return {
    customizeTopicContextMenu(props, next) {
      const defaultMenus = next();
      defaultMenus.splice(0, 1);
      defaultMenus.splice(
        1,
        0,
        <MenuItem
          icon="group-objects"
          label="Shift + A"
          text="my customize menu"
          onClick={onClickMyMenu(props)}
        />
      );
      return <>{defaultMenus}</>;
    }
  };
}

const changeDefaultContextMenuPlugins = [
  ChangeDefaultTopicContextMenuPlugin(),
  HotKeyPlugin()
];
export class ChangeDefaultTopicContextMenuDemo extends BaseDemo {
  renderDiagram() {
    return (
      <Diagram
        model={this.state.model}
        onChange={this.onChange}
        plugins={changeDefaultContextMenuPlugins}
      />
    );
  }
}

storiesOf('customize-topic-context-menu-demo', module)
  .add('add-topic-context-menu', () => <AddTopicContextMenuDemo />, {
    notes: {
      markdown: {
        en: addTopicContextMenuMdEn,
        zh: addTopicContextMenuMdZh
      }
    }
  })
  .add(
    'change-default-context-menu',
    () => <ChangeDefaultTopicContextMenuDemo />,
    {
      notes: {
        markdown: {
          en: changeDefaultTopicContextMenuMdEn,
          zh: changeDefaultTopicContextMenuMdZh
        }
      }
    }
  );
