import { ThemeType } from './types';

export const defaultTheme: ThemeType = {
  name: 'default',
  randomColor: false,
  background: 'rgb(242,242,242)',
  highlightColor: '#bbb',
  dropLinkColor: 'rgb(8,170,255)',
  marginH: 60,
  marginV: 20,

  contentStyle: {
    lineHeight: '1.5',
    fontWeight: '600',
    border: '2.5px solid #e8ebf0',
    borderRadius: '10px',
    background: 'white',
    color: 'black',
    padding: '0px 10px',
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
