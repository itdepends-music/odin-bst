class Node {
    constructor(data, left, right) {
        this.data = data;
        this.left = left;
        this.right = right;
    }

    prettyPrint(prefix = '', isLeft = true) {
        if (this === null) {
            return;
        }
        if (this.right !== null) {
            this.right.prettyPrint(
                `${prefix}${isLeft ? '│   ' : '    '}`,
                false
            );
        }
        console.log(`${prefix}${isLeft ? '└── ' : '┌── '}${this.data}`);
        if (this.left !== null) {
            this.left.prettyPrint(`${prefix}${isLeft ? '    ' : '│   '}`, true);
        }
    }

    height() {
        const leftHeight = this.left !== null ? this.left.height() : 0;
        const rightHeight = this.right !== null ? this.right.height() : 0;
        return Math.max(leftHeight, rightHeight) + 1;
    }
}

class Tree {
    constructor(arr) {
        this.root = this.buildTree(arr);
    }

    buildTree(arr, sortedAndRemovedDuplicates = false) {
        if (arr.length === 0) {
            return null;
        }

        if (!sortedAndRemovedDuplicates) {
            arr = [...new Set(arr.sort((a, b) => a - b))];
        }

        const rootNodeIndex = Math.floor(arr.length / 2);
        const rootNodeData = arr[rootNodeIndex];
        const leftTree = this.buildTree(arr.slice(0, rootNodeIndex), true);
        const rightTree = this.buildTree(arr.slice(rootNodeIndex + 1), true);

        return new Node(rootNodeData, leftTree, rightTree);
    }

    insert(val, root = this.root) {
        if (root === null) {
            return new Node(val, null, null);
        }

        if (val === root.data) {
            return root;
        } else if (val < root.data) {
            root.left = this.insert(val, root.left);
            return root;
        } else if (val > root.data) {
            root.right = this.insert(val, root.right);
            return root;
        }
    }

    delete(val, root = this.root) {
        // no value to delete, so we just return
        if (root === null) {
            return root;
        }

        // use recursion to find node to delete, if it is not root node
        if (val < root.data) {
            root.left = this.delete(val, root.left);
            return root;
        } else if (val > root.data) {
            root.right = this.delete(val, root.right);
            return root;
        }

        // delete node with a single child
        if (root.left === null) {
            root = root.right;
            return root;
        } else if (root.right === null) {
            root = root.left;
            return root;
        }

        // delete node with 2 children.
        // start by finding sucessor node
        // (next in order, so leftmost node right of root),
        // and it's parent.
        let succ = root.right;
        let succParent = root;
        while (succ.left !== null) {
            succParent = succ;
            succ = succ.left;
        }

        // remove successor node from the tree.
        // the successor node should not have any children on it's left
        // so we can replace it with right child
        if (succParent === root) {
            // if parent is root node it will be the right child
            succParent.right = succ.right;
        } else {
            // otherwise it will be the left child
            succParent.left = succ.right;
        }

        // move successors value to root node
        root.data = succ.data;
        return root;
    }

    find(val, root = this.root) {
        if (root === null) {
            return null;
        }

        if (val === root.data) {
            return root;
        } else if (val < root.data) {
            return this.find(val, root.left);
        } else if (val > root.data) {
            return this.find(val, root.right);
        }
    }

    levelOrder(callback) {
        let items;
        if (callback === undefined) {
            items = [];
        }

        if (this.root === null) {
            return;
        }

        const queue = [this.root];

        while (queue.length > 0) {
            let curNode = queue.shift();

            if (callback === undefined) {
                items.push(curNode.data);
            } else {
                callback(curNode.data);
            }

            if (curNode.left !== null) queue.push(curNode.left);
            if (curNode.right !== null) queue.push(curNode.right);
        }

        if (callback === undefined) {
            return items;
        }
    }

    inOrder(callback, root = this.root) {
        let items;
        if (callback === undefined) {
            items = [];
        }

        if (root === null) {
            return items;
        }

        const lValue = this.inOrder(callback, root.left);
        if (callback === undefined) {
            items = lValue;
        }

        if (callback === undefined) {
            items.push(root.data);
        } else {
            callback(root.data);
        }

        const rValue = this.inOrder(callback, root.right);
        if (callback === undefined) {
            items = items.concat(rValue);
        }

        return items;
    }

    preOrder(callback, root = this.root) {
        let items;
        if (callback === undefined) {
            items = [];
        }

        if (root === null) {
            return items;
        }

        if (callback === undefined) {
            items.push(root.data);
        } else {
            callback(root.data);
        }

        const lValue = this.preOrder(callback, root.left);
        if (callback === undefined) {
            items = items.concat(lValue);
        }

        const rValue = this.preOrder(callback, root.right);
        if (callback === undefined) {
            items = items.concat(rValue);
        }

        return items;
    }

    postOrder(callback, root = this.root) {
        let items;
        if (callback === undefined) {
            items = [];
        }

        if (root === null) {
            return items;
        }

        const lValue = this.postOrder(callback, root.left);
        if (callback === undefined) {
            items = lValue;
        }

        const rValue = this.postOrder(callback, root.right);
        if (callback === undefined) {
            items = items.concat(rValue);
        }

        if (callback === undefined) {
            items.push(root.data);
        } else {
            callback(root.data);
        }

        return items;
    }

    depth(node, root = this.root) {
        if (node === root) {
            return 0;
        } else if (node.data < root.data) {
            return 1 + this.depth(node, root.left);
        } else if (node.data > root.data) {
            return 1 + this.depth(node, root.right);
        }
    }

    isBalanced() {
        return (
            Math.abs(this.root.left.height() - this.root.right.height()) <= 1
        );
    }

    rebalance() {
        const values = this.inOrder();
        this.root = this.buildTree(values, true);
    }
}

console.log('Creating random numbers < 100 ...');
let randomNumbers = [];
for (let i = 0; i < 10; i++) {
    randomNumbers.push(Math.floor(Math.random() * 100));
}
console.log(randomNumbers);

console.log('Creating Binary Search Tree ...');
const tree = new Tree(randomNumbers);
tree.root.prettyPrint();

console.log(`Is the tree balanced? ${tree.isBalanced()}`);

console.log('Printing elements in level order:');
console.log(tree.levelOrder());

console.log('Printing elements in pre order:');
console.log(tree.preOrder());

console.log('Printing elements in post order:');
console.log(tree.postOrder());

console.log('Printing elements in order:');
console.log(tree.inOrder());

console.log('Unbalancing the tree by adding numbers > 100 ...');
for (let i = 0; i < 5; i++) {
    tree.insert(Math.floor(Math.random() * 100) + 100);
}
tree.root.prettyPrint();

console.log(`Is the tree balanced? ${tree.isBalanced()}`);

console.log('Rebalancing the tree ...');
tree.rebalance();
tree.root.prettyPrint();

console.log(`Is the tree balanced? ${tree.isBalanced()}`);

console.log('Printing elements in level order:');
console.log(tree.levelOrder());

console.log('Printing elements in pre order:');
console.log(tree.preOrder());

console.log('Printing elements in post order:');
console.log(tree.postOrder());

console.log('Printing elements in order:');
console.log(tree.inOrder());
