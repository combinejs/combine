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

    php += node.getHtmlTagStart();

    /*let variable = getVar(node);

    if (variable) {
        php += `<?=$${variable.replace('.', '->')};?>`;
    }*/

    for (let child of node.getChilds()) {
        php += node2Php(child);
    }

    php += node.getHtmlTagEnd();

    if (node.isItterable) {
        php += `<?}?>`;
    }

    return php;
}