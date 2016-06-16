module.exports = function(name) {
    return require(
        require('path').resolve(`./directives/${name}/index`)
    );
};

