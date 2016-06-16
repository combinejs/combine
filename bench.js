const blockProvider = require('./providers/block'),
      htmlCompile   = require('./compilers/html'),
      phpCompile    = require('./compilers/php'),
      processor     = require('./processors/index');

let string = blockProvider('Orders');

let c = 1e3;

let trees = [];

/*for (let i = 0; i < c; ++i) {
    trees[i] = parse(string);
}*/

let time = process.hrtime();

for (let i = 0; i < c; ++i) {
    processor(trees[i]);
}

let diff = process.hrtime(time);

console.log('%d us', (diff[0] * 1e9 + diff[1]) / (c * 1e3));