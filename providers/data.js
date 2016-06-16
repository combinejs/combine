const fs    = require('fs'),
      Case = require('case');

module.exports = function(name) {
    try {
        return JSON.parse(
            fs.readFileSync(
                `./data/${Case.kebab(name)}.json`
            ).toString()
        );
    } catch (e) {
        return null;
    }
};