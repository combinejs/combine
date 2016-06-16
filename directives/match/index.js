/**
 * вспомогательная директива в примесях, определяющая правила для наложения разных деревьев
 * Этот модуль экпортирует функцию, которая находит самый подходящий узел в примеси для заданной позиции
 * узла в дереве на которое накладывается примесь
 */

let MatchSelector = require('./match-selector.js');

class MatchDirective {
    constructor(value) {
        this.selector = new MatchSelector(value);
    }
}

MatchDirective.matchNodeByPath = function(rootNode, path) {
    return matchNodeByPath([rootNode], path);
};

module.exports = MatchDirective;

/**
 * Рекурсивная функция, которая среди всех потомков переданных узлов (использую match директивы)
 * ищет те элементы, которые подходят под переданный путь (это массив индексов в каждом уровне) и
 * возвращает их в порядке возврастания приоритета
 *
 * @param nodeList {BSNode[]}       узлы в порядке возврастания приоритетам
 * @param path {Number[]} path      адрес узла (последовательность индексов на каждом уровне дерева)
 *
 * @returns {BSNode[]}              найденные узлы по возврастанию приоритета
 */
function matchNodeByPath(nodeList, path) {
    if (nodeList.length === 0 || path.length === 0) return nodeList;

    return matchNodeByPath(
        Array.prototype.concat.apply([], nodeList.map(
            node => matchChildNodes(node, path[0])
        )),
        path.slice(1)
    );
}

/**
 * Среди всех прямых потомков узла (изпользуя их директивы match) найти те элементы,
 * которые подходят под переданную позицию и вернуть их в порядке возврастания приоритета.
 *
 * @param node {BSNode}     узел, среди прямых потомков которого будем искать
 * @param index {Number}    позиция предпологаемого элемента
 *
 * @returns {BSNode[]}      найденные узлы по возврастанию приоритета
 */
function matchChildNodes(node, index) {
    let priorityBuckets = new Array(MatchSelector.MAX_PRIORITY + 1).fill(1).map(()=>[]);

    for (let childNode of node.getChilds()) {
        if (childNode.hasDirective('match')) {
            let selector = childNode.getDirective('match').selector;

            if (selector.test(index, node)) {
                priorityBuckets[selector.priority].push(childNode)
            }
        }
    }

    return Array.prototype.concat.apply([], priorityBuckets);
}

