通过编写插件在系统默认的 📧context menu 基础上增加内容

下面的例子演示增加一个 menu 项, 点击这个 menu 弹出提示当前 topic 的 key 和 style

```jsx
function onClickMyMenu(props) {
  return function() {
    const { topicKey, controller, model } = props;
    alert(`this topic key is ${topicKey}`);
    const topicStyle = controller.run('getTopicStyle', props);
    alert(`this topic style is ${JSON.stringify(topicStyle)}`);
  };
}

function HotKeyPlugin() {
  return {
    customizeHotKeys(props, next) {
      const hotKeysMap = next();
      hotKeysMap.push({
        label: 'MY_CUSTOM',
        combo: 'shift + a',
        onKeyDown: e => {
          onClickMyMenu(props)();
        }
      });
      return hotKeysMap;
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
```
