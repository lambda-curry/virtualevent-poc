import { SSRWrapper } from "./src/state/ReduxWrapper"

export const wrapRootElement = SSRWrapper

import { JSDOM } from 'jsdom'
import { Blob } from 'blob-polyfill';
import { XMLHttpRequest } from 'xmlhttprequest';

global.dom = new JSDOM(`...`)
global.window = dom.window
global.document = dom.window.document
global.navigator = global.window.navigator

global.window.matchMedia = function() {
	return {
    matches: false,
    addListener: function() {},
    removeListener: function() {}
  }
}

global.Blob = Blob
global.XMLHttpRequest = XMLHttpRequest