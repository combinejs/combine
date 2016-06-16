module.exports = function(tree) {
    walk(tree);
};

function walk(node) {
    for (let child of node.getChilds()) {
        walk(child);
    }

    transform(node);
}

function transform(node) {
    for (let directiveName of Object.keys(node.getDirectives())) {
        let directive = node.getDirective(directiveName);

        if (typeof directive.run === 'function') {
            directive.run();
        }
    }
}

