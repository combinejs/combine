const blockProvider = require('@combinejs/blocks-provider'),
      htmlCompile   = require('./lib/html-compiler'),
      phpCompile    = require('./lib/php-compiler'),
      util          = require('util');


var argv = require('minimist')(process.argv.slice(2));

run(argv._[0], argv.c);

function run(blockName = 'Orders', compilerName = 'php') {
    try {
        let block = blockProvider(blockName),
            compiler = require(`./lib/${compilerName}-compiler`);

        //console.log(util.inspect(block, { showHidden: true, depth: null }));

        walk(block);

        //console.log(util.inspect(block, { showHidden: true, depth: null }));

        console.log(compiler(block, true));

    } catch (e) {
        console.log(e.message, e.stack);
    }
}

function walk(node) {
    for (let child of node.getChilds()) {
        walk(child);
    }

    for (let directiveName of Object.keys(node.getDirectives())) {
        let directive = node.getDirective(directiveName);

        if (typeof directive.run === 'function') {
            directive.run();
        }
    }
}


