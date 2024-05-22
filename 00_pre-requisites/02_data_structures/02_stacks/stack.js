const { MAX_STACK_SIZE } = require('./config');

class Stack {
    constructor() {
        this.items = [];
    }
    push(item) {
        if (this.items.length >= MAX_STACK_SIZE) throw Error("No space") 
        this.items.push(item);
    }
    pop() {
        if (this.items.length === 0) throw Error("Empty ");
        return this.items.pop();
    }
    isEmpty() {
        return (this.items.length === 0)?true:false;
    }
    peek() {
        return this.items[this.items.length - 1];
    }
}

module.exports = Stack;
