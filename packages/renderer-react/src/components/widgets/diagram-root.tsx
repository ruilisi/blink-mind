import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { RefKey } from '../../utils';
import { initDragDropTouch } from './drag-drop-touch';
import { MindDragScrollWidget } from './mind-drag-scroll-widget';
const Root = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;
const DiagramContainer = styled.div`
  width: 100%;
  //height: 100%;
  overflow: auto;
  flex-grow: 1;
  background: ${props => props.theme.background};
  position: relative;
`;
export function DiagramRoot(props) {
  const { controller, getRef, saveRef, model } = props;
  const [diagramState, setDiagramState] = useState(
    controller.run('getInitialDiagramState', props)
  );
  const initZoom = useRef<number>(1);

  useEffect(() => {
    const container = getRef(RefKey.DIAGRAM_ROOT_KEY);
    initDragDropTouch(container);

    container.addEventListener('pinch', (e: CustomEvent) => {
      let zoomFactor = initZoom.current * e.detail.zoom;
      if (zoomFactor < 0.2) zoomFactor = 0.2;
      if (zoomFactor > 4) zoomFactor = 4;
      controller.run('setZoomFactor', { ...props, zoomFactor });
    });
    container.addEventListener('multiTouchStart', () => {
      initZoom.current = controller.run('getZoomFactor', props);
    });
  }, []);

  const nProps = {
    ...props,
    diagramState,
    setDiagramState
  };

  return (
    <Root>
      {/* {controller.run('renderToolbar', props)} */}
      <DiagramContainer ref={saveRef(RefKey.DIAGRAM_ROOT_KEY)}>
        {/*{React.createElement(MindDragScrollWidget, nProps)}*/}
        <MindDragScrollWidget {...nProps} />
        {controller.run('renderDiagramCustomize', nProps)}
      </DiagramContainer>
    </Root>
  );
}
