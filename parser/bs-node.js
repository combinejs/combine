const Case = require('case');
/**
 * Класс для представления узла синтаксического дерева
 */
class BSNode {
    /**
     *
     * @param {String} name
     */
    constructor(name) {
        this.name     = name;
        this._props   = {};

        /**
         *
         * @type {BSNode[]}
         */
        this._content = [];

        this._mixins = [];

        this._directives = {};

        if (name[0].toLowerCase() !== name[0]) {
            this.blockName = name;
            this.isBlock   = true;
            this.isElement = false;
        } else {
            this.elementName = name;
            this.isBlock   = false;
            this.isElement = true;
        }
    }

    addChild(node) {
        this._content.push(node);
    }

    setChilds(nodes) {
        this._content = nodes;
    }

    getAllChilds() {
        return this._content;
    }

    getChilds() {
        return this.getAllChilds();
        /*return Array.prototype.concat.apply([], this._content.map(
            child => child.isVirtual ? child.getChilds() : [child]
        ));*/
    }

    hasChilds() {
        return this._content.length > 0;
    }

    addMixin(mixinNode) {
        this._mixins.push(mixinNode);
    }

    getMixins() {
        return this._mixins;
    }

    addDirective(name, directive) {
        this._directives[name] = directive;
    }

    getDirective(name) {
        return this._directives[name];
    }

    hasDirective(name) {
        return this._directives.hasOwnProperty(name);
    }

    getDirectives() {
        return this._directives;
    }

    getPropNS(name) {
        return this._props[name];
    }

    hasPropNS(name) {
        return this._props.hasOwnProperty(name);
    }

    /**
     * Получить значение свойства
     *
     * @param {String} NS
     * @param {String} name
     * @returns {String|null}
     */
    getProp(NS, name) {
        return this.getPropNS(NS)[name];
    }

    hasProp(NS, name) {
        return this.hasPropNS(NS) && name in this.getPropNS(NS);
    }

    setProp(NS, name, value) {
        if (! this.hasPropNS(NS)) {
            this._props[NS] = {};
        }

        this._props[NS][name] = value;
    }

    getAllMixedNodes() {
        return [this].concat(this.getMixins());
    }

    getHtmlTag() {
        let tag = 'div';

        for (let node of this.getAllMixedNodes()) {
            if (node.hasProp('html', 'tag')) {
                tag = node.getProp('html', 'tag');
            }
        }

        return tag;
    }

    getCssMixedRules() {
        let mixedRules = {},
            result     = [];

        for (let node of this.getAllMixedNodes()) {
            if (node.hasPropNS('css')) {
                Object.assign(mixedRules, node.getPropNS('css'));
            }
        }

        for (let cssRule of Object.keys(mixedRules)) {
            result.push(`${Case.kebab(cssRule)}:${mixedRules[cssRule]}`);
        }

        return result.join(';');
    }

    getHtmlClass() {
        return Case.kebab(this.blockName) + (this.isElement ? `__${Case.kebab(this.elementName)}` : '');
    }

    getHtmlMixedClass() {
        let classes = [];

        for (let node of this.getAllMixedNodes()) {
            classes.push(node.getHtmlClass());
        }

        return classes.join(' ');
    }

    _getAttributesString() {
        let attrs = {
                'class'  : this.getHtmlMixedClass(),
                'styles' : this.getCssMixedRules()
            },
            result = [];

        for (let name of Object.keys(attrs)) {
            if (attrs[name].length > 0) {
                result.push(`${name}="${attrs[name]}"`);
            }
        }

        return result.join(' ');
    }

    getHtmlTagStart() {
        return `<${this.getHtmlTag()} ${this._getAttributesString()}>`;
    }

    getHtmlTagEnd() {
        return `</${this.getHtmlTag()}>`;
    }
}

module.exports = BSNode;

/**
 * @typedef {{name: String, value: String}} BSProp
 * @typedef {BSNode[]} BSNodeList
 */