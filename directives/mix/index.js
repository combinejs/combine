const directiveProvider = require('../../providers/directive'),
      blockProvider     = require('../../providers/block'),
      MatchDirective = directiveProvider('match');

function run(node, mixName) {
    walk(node, blockProvider(mixName), []);
}

function walk(node, mixNode, path) {
    let matchedNodes = MatchDirective.matchNodeByPath(mixNode, path);

    for (let matchedNode of matchedNodes) {
        node.addMixin(matchedNode);
    }

    if (node.hasChilds()) {
        let i = 0;

        for (let child of node.getChilds()) {
            walk(child, mixNode, path.concat([i++]));
        }
    } else {
        if (matchedNodes.reduce((sum, item)=> item.hasChilds(), 0) < 2) {
            for (let matchedNode of matchedNodes) {
                if (matchedNode.hasChilds()) {
                    node.setChilds(matchedNodes[0].getChilds());
                }
            }
        } else if (matchedNodes.length > 1) {
            throw `неоднозначность наложения на пустой узел ${node.blockName}__${node.elementName}`;
        }
    }
}

class MixDirective {
    constructor(value, node) {
        this._node      = node;
        this._mixinName = value;
    }
    run() {
        run(this._node, this._mixinName);
    }
}

module.exports = MixDirective;


