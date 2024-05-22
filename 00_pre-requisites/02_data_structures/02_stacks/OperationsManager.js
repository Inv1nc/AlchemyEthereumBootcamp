const Stack = require('./Stack');

class OperationManager {
    constructor() {
        this.operations = new Stack();
        this.undos = new Stack();
    }

    addOperation(operation) {
        this.operations.push(operation);
    }

    undo() {
        let operation = this.operations.pop();
        this.undos.push(operation);
    }

    redo() {
        let operation = this.undos.pop();
        this.operations.push(operation);
    }

    redoAll() {
        while(!this.undos.isEmpty()) {
            this.redo();
        }
    }
}

module.exports = OperationManager;
