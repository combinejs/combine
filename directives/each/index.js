class EachDirective {
    constructor(value, node) {
        let [item, collection] = value.split('of');

        this.collection  = collection.trim();
        this.item        = item.trim();
        node.isItterable = true;
    }
}

module.exports = EachDirective;

