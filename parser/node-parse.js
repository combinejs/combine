const BSNode              = require('./bs-node'),
      lineAnalyze         = require('./line-analyze'),
      directiveProvider   = require('../providers/directive');

module.exports = function(state) {
    let {indent} = lineAnalyze(state);

    let node = new BSNode(nameParse(state));

    if (node.isBlock) {
        state.lastBlockName = node.blockName;
    } else {
        node.blockName = state.lastBlockName;
    }

    do {
        let {isProperty, beforeIndex, indent: lineIndent} = lineAnalyze(state);

        if (! isProperty) {
            state.index = beforeIndex;
            break;
        }

        if (lineIndent === indent) {
            let {NS, name, value} = propertyParse(state);

            if (NS === 'rule') {
                let ConcreteDirective = directiveProvider(name);

                node.addDirective(name, new ConcreteDirective(value, node));
            } else {
                node.setProp(NS, name, value);
            }
        }

    } while (! state.isEOF);

    state.indent = indent;

    return node;
};

function nameParse(state) {
    let result = state.execRegexp(/([a-z][a-z0-9]+)/gi);
    LexemeEnding(state);

    return result[1];
}

function propertyParse(state) {
    let result = state.execRegexp(/([a-z][a-z0-9]+)\.([a-z][a-z0-9]+)\s*=\s*'([^']+)'/gi);
    LexemeEnding(state);

    return {
        NS:  result[1],
        name: result[2],
        value: result[3]
    }
}

function LexemeEnding(state) {
    let result = state.execRegexp(/\s*(\r?\n)+/mg);

    if (result === null || state.index >= state.string.length - 1) {
        state.isEOF = true;
    }
}
