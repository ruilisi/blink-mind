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
    lineHeight: '1.5'
  },

  linkStyle: {
    lineRadius: 5,
    lineType: 'curve',
    lineWidth: '3px'
  },

  rootTopic: {
    contentStyle: {
      fontSize: '26px',
      borderRadius: '45px',
      background: 'rgb(8,170,255)',
      color: 'white',
      padding: '14px 16px 14px 16px'
    },
    subLinkStyle: {
      lineType: 'curve',
      lineWidth: '2px',
      lineColor: '#bbb'
    }
  },
  primaryTopic: {
    contentStyle: {
      borderRadius: '30px',
      border: '2px solid rgb(8,170,255)',
      background: 'white',
      fontSize: '17px',
      padding: '10px 15px 10px 15px'
    },

    subLinkStyle: {
      lineType: 'curve',
      lineWidth: '2px',
      lineColor: '#bbb'
    }
  },

  normalTopic: {
    contentStyle: {
      fontSize: '17px',
      padding: '4px 10px'
    },

    subLinkStyle: {
      lineType: 'curve',
      lineWidth: '2px',
      lineColor: '#bbb'
    }
  }
};
