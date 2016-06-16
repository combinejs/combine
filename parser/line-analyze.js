"use strict";

module.exports = function(state) {
    var spaces     = 0,
        beforeIndex = state.index;

    while (state.string[state.index] === ' ') {
        spaces++;
        state.index++;
    }

    var isNode;

    if (spaces % 4 === 0) {
        isNode = true;
    } else if(spaces % 4 === 2) {
        isNode = false;
    } else {
        throw 'invalid indent'
    }

    return {
        beforeIndex: beforeIndex,
        indent:     Math.floor(spaces / 4),
        isNode:     isNode,
        isProperty: !isNode,
        isEmpty:    state.string[state.index] === '\n'
    }
};
