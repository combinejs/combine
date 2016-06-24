const pretty = require('pretty');

module.exports = function(node, isPretty) {
    let php = node2Php(node);

    return isPretty ? pretty(php) : php;
};

function node2Php(node) {
    var php = '';

    if (node.isItterable) {
        let each = node.getDirective('each');

        php += `<? foreach ($${each.collection} as $${each.item}) { ?>`;
    }

    if (node.name === 'String') {
        if (node.string) {
            php += node.string;
        } else if (node.expression) {
            php += `<?=$${node.expression.join('->')};?>`;
        }
    } else {

        php += node.getHtmlTagStart();

        for (let child of node.getChilds()) {
            php += node2Php(child);
        }

        php += node.getHtmlTagEnd();
    }

    if (node.isItterable) {
        php += `<?}?>`;
    }

    return php;
}