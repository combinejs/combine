const pretty = require('pretty');

module.exports = function(node, isPretty) {
    let html = node2Html(node);

    return isPretty ? pretty(html) : html;
};

/**
 *
 * @param {BSNode} node
 *
 * @returns {String}
 */
function node2Html(node) {
    var html = '';

    html += node.getHtmlTagStart();

    for (let child of node.getChilds()) {
        html += node2Html(child);
    }

    html += node.getHtmlTagEnd();

    return html;
}