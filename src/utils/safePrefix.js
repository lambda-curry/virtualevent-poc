const { withPrefix } = require("gatsby");
const _ = require('lodash');

export const safePrefix = function(url) {
    if (_.startsWith(url, '#') || _.startsWith(url, 'http')) {
        return url;
    }
    return withPrefix(url);
}
