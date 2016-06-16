const fs    = require('fs'),
      Case  = require('case'),
      parse = require('../parser/index');

/**
 * Получить дерево по имени
 *
 * @param {String} name
 * @returns {BSNode}
 */
module.exports = function(name) {
    return parse(fs.readFileSync(
        `./blocks/${Case.kebab(name)}.bs`
    ).toString());
};