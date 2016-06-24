const pretty = require('pretty');

module.exports = function(node, isPretty) {
    let html = node2Html(node);

    return isPretty ? pretty(php) : php;
};

/**
 *
 * @param {BSNode} node
 *
 * @returns {String}
 */
function node2Html(node) {
    var html = '';

    if (node.name === 'String') {

        if (node.string) {
            php += node.string;
        } else if (node.expression) {
            php += `<!-- unresolved variable: ${node.expression.join('.')} -->`;
        }

    } else {

        php += node.getHtmlTagStart();

        for (let child of node.getChilds()) {
            php += node2Html(child);
        }

        php += node.getHtmlTagEnd();
    }

    return php;
}