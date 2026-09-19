require('babel-register');

const { JSDOM } = require('jsdom');
const Enzyme = require('enzyme');
const Adapter = require('enzyme-adapter-react-15');

const dom = new JSDOM('<!doctype html><html><body></body></html>', { url: 'http://localhost/' });

global.window = dom.window;
global.document = dom.window.document;
global.navigator = { userAgent: 'node.js' };

Object.getOwnPropertyNames(dom.window).forEach((property) => {
  if (typeof global[property] === 'undefined') {
    global[property] = dom.window[property];
  }
});

Enzyme.configure({ adapter: new Adapter() });
