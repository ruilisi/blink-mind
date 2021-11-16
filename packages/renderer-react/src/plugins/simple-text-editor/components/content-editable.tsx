import * as React from 'react';
import styled from 'styled-components';

interface Props {
  html: string;
  autoFocus?: boolean;
  placeholder?: string;
  readOnly?: boolean;
  onChange: (value) => void;
}

const Editor = styled.div`
  outline: none;
  border: none;
`;

function normalizeHtml(str: string): string {
  return str && str.replace(/&nbsp;|\u202F|\u00A0/g, ' ');
}

export function replaceCaret(el: HTMLElement) {
  // Place the caret at the end of the element
  const target = document.createTextNode('');
  el.appendChild(target);
  // do not move caret if element was not focused
  const isTargetFocused = document.activeElement === el;
  if (target !== null && target.nodeValue !== null && isTargetFocused) {
    var sel = window.getSelection();
    if (sel !== null) {
      var range = document.createRange();
      range.setStart(target, target.nodeValue.length);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
    }
    if (el instanceof HTMLElement) el.focus();
  }
}

export class ContentEditable extends React.Component<Props> {
  lastHtml: string = this.props.html;
  el = React.createRef<HTMLElement>();

  getEl = () => this.el.current;

  render() {
    const { html, ...props } = this.props;

    return (
      <Editor
        {...props}
        ref={this.el}
        onInput={this.emitChange}
        onBlur={this.emitChange}
        contentEditable={!this.props.readOnly}
        dangerouslySetInnerHTML={{ __html: html }}
      >
        {this.props.children}
      </Editor>
    );
  }

  shouldComponentUpdate(nextProps: Props): boolean {
    const { props } = this;
    const el = this.getEl();

    // We need not rerender if the change of props simply reflects the user's edits.
    // Rerendering in this case would make the cursor/caret jump

    // Rerender if there is no element yet... (somehow?)
    if (!el) return true;

    // ...or if html really changed... (programmatically, not by user edit)
    if (normalizeHtml(nextProps.html) !== normalizeHtml(el.innerHTML)) {
      return true;
    }

    return false;
  }

  componentDidMount() {
    if (this.props.autoFocus) {
      const el = this.getEl();
      el.focus();
      replaceCaret(el);
    }
  }

  componentDidUpdate() {
    const el = this.getEl();
    if (!el) return;

    // Perhaps React (whose VDOM gets outdated because we often prevent
    // rerendering) did not update the DOM. So we update it manually now.
    if (this.props.html !== el.innerHTML) {
      el.innerHTML = this.props.html;
    }
    this.lastHtml = this.props.html;
    replaceCaret(el);
  }

  emitChange = (originalEvt: React.SyntheticEvent<any>) => {
    const el = this.getEl();
    if (!el) return;

    const html = el.innerHTML;
    if (this.props.onChange && html !== this.lastHtml) {
      // Clone event with Object.assign to avoid
      // "Cannot assign to read only property 'target' of object"
      const evt = Object.assign({}, originalEvt, {
        target: {
          value: html
        }
      });
      this.props.onChange(evt);
    }
    this.lastHtml = html;
  };
}
