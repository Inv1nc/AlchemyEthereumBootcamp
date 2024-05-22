class LinkedList {
    constructor() {
        this.head = null;
    }

    addFirst(node) {
        const tmp = this.head;
        this.head = node;
        node.next = tmp;
    }

    addLast(node) {
        if (this.head == null) {
            this.addFirst(node);
        } else {
            let current = this.head;
            while(current.next) {
                current = current.next;
            }
            current.next = node;
        }
    }

    indexOf(node) {
        let ind = 0;
        let current = this.head;
        while(current != null) {
            if (current === node ) {
                return ind;
            }
            ind+=1;
            current = current.next;
        }
    }

    removeAt(index) {
        if (index == 0){
            if(this.head.next) {
                this.head = this.head.next;
            } else {
                this.head = null;
            }
        } else {
            let ind = 0
            let current = this.head;

            while(ind < index - 1) {
                current = current.next;
                ind += 1;
            }
            current.next = current.next.next;
        }
    }
    
}

module.exports = LinkedList;