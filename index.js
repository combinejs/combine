const blockProvider = require('./providers/block'),
      htmlCompile   = require('./compilers/html'),
      phpCompile    = require('./compilers/php'),
      processor     = require('./processors/index'),
      util          = require('util');

let tree = blockProvider('Orders');

//console.log(util.inspect(tree, { showHidden: true, depth: null }));

processor(tree);

//console.log(util.inspect(tree, { showHidden: true, depth: null }));

let compile = process.argv[2] === '-php' ? phpCompile : htmlCompile;

console.log(compile(tree, true));
