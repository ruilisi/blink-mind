import { ThemeType } from './types';

export const defaultTheme: ThemeType = {
  name: 'default',
  randomColor: false,
  background: 'rgb(250,251,252)',
  highlightColor: 'rgb(8,170,255)',
  dropLinkColor: 'rgb(8,170,255)',
  marginH: 60,
  marginV: 20,

  contentStyle: {
    fontWeight: '600',
    border: '1.5px solid rgb(233,235,241)',
    borderRadius: '7px',
    background: 'white',
    color: 'black',
    padding: '3px 10px',
    boxShadow: '-1px 4px 5px #f2f3f4',
  },

  linkStyle: {
    lineRadius: 5,
    lineType: 'curve',
    lineWidth: '3px',
    lineColor: 'black',
  },

  rootTopic: {},
  primaryTopic: {},
  normalTopic: {}
};
