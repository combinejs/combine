/**
 * @module
 *
 * Вспомогательный класс для директивы match
 */

let TYPE_INDEX         = Symbol(),
    TYPE_RIGHT_INDEX   = Symbol(),
    TYPE_PERIODIC_AN_B = Symbol(),
    TYPE_EVERY         = Symbol();

class MatchSelector {
    constructor(expr) {
        this._params = {a: null, b: null};

        switch (true) {
            case /^\d+$/.test(expr):
                this._type     = TYPE_INDEX;
                this._params.a = parseInt(expr);
                this._priority = 3;
                break;

            case /^-\d+$/.test(expr):
                this._type     = TYPE_RIGHT_INDEX;
                this._params.a = parseInt(expr);
                this._priority = 2;
                break;

            case /^(-?\d+)n([+|-]\d+)$/.test(expr):
                this._type     = TYPE_PERIODIC_AN_B;
                let [, a, b] = expr.match(/^(-?\d+)n([+|-]\d+)$/);
                this._params.a = parseInt(a);
                this._params.b = parseInt(b);
                this._priority = 1;
                break;

            case /^[n|\*]$/.test(expr):
                this._type     = TYPE_EVERY;
                this._priority = 0;
                break;
            default:
                throw 'invalid match expression';
        }
    }

    test(index, ctxNode) {
        switch (this._type) {
            case TYPE_INDEX:
                return index === this._params.a;

            case TYPE_RIGHT_INDEX:
                return ctxNode._content.length + this._params.a === index;

            case TYPE_PERIODIC_AN_B:
                let n = (index - this._params.b) / this._params.a;
                return Number.isInteger(n) && n >= 0;

            case TYPE_EVERY:
                return true;
        }
    }

    get priority() {
        return this._priority;
    }
}

MatchSelector.MAX_PRIORITY = 3;

module.exports = MatchSelector;