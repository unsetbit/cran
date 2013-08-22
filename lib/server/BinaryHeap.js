/**
 * Binary Heap implementation in Javascript
 * https://github.com/yckart/BinaryHeap.js
 *
 * @see https://gist.github.com/justinbowes/3297745
 * @see http://eloquentjavascript.net/appendix2.html
 *
 * Copyright (c) 2013 Yannick Albert (http://yckart.com)
 * Licensed under the MIT license (http://www.opensource.org/licenses/mit-license.php).
 * 2013/04/01
 */


module.exports = function createBinaryHeap(scoreFunction, populate){
    return new BinaryHeap(scoreFunction, populate);
};

/**
 * Can optionally provide a comparison function
 * and an array to populate the heap
 *
 * @constructor
 * @param {Function} scoreFunction - The comparator function
 * @param {Array} populate - An array to prefill
 */
function BinaryHeap(scoreFunction, populate) {

    this.scoreFunction = scoreFunction ||
    function(a, b) {
        if(a < b) return -1;
        if(a > b) return 1;
        return 0;
    };

    this.content = populate ? populate.slice(0) : [];
    if(this.content.length) this.build();
}

/**
 * Create a heap from a random arrangement of data.
 * Building a heap this way is O(n).
 *
 * @return this
 * @this {BinaryHeap}
 */

BinaryHeap.prototype.build = function() {
    var i = Math.floor(this.content.length / 2);
    while(i--) this.sinkDown(i);

    return this;
};



/**
 * Adds an element to the heap.
 * Building a heap this way is O(n log n).
 *
 * @param {Mixed} element
 *
 * @return this
 * @this {BinaryHeap}
 */

BinaryHeap.prototype.push = function(element) {
    // Add the new element to the end of the array.
    this.content.push(element);

    // Allow it to bubble up.
    return this.bubbleUp(this.content.length - 1);
};


/**
 * Pops the root off the heap. The root is the element for which
 * the score function returns the minimum score. This is delete-min
 * with O(log n).
 *
 * @return {Number} result
 */

BinaryHeap.prototype.pop = function() {
    // Store the first element so we can return it later.
    var result = this.content[0];

    // Get the element at the end of the array.
    var end = this.content.pop();

    // If there are any elements left, put the end element at the
    // start, and let it sink down.
    if(this.content.length > 0) {
        this.content[0] = end;
        this.sinkDown(0);
    }

    return result;
};



/**
 * Removes the given element from this heap.
 *
 * @param {Mixed} element
 * @this {BinaryHeap}
 * @return this
 */

BinaryHeap.prototype.remove = function(node) {
    var len = this.content.length;

    // To remove a value, we must search
    // through the array to find it.
    for(var i = 0; i < len; i++) {
        if(this.content[i] === node) {

            // When it is found, the process seen in 'pop' is repeated
            // to fill up the hole.
            var end = this.content.pop();

            if(i !== len - 1) {
                this.content[i] = end;
                if(this.scoreFunction(end) < this.scoreFunction(node)) {
                    this.bubbleUp(i);
                } else {
                    this.sinkDown(i);
                }
            }
            return this;
        }
    }

    throw new Error("Node not found.");

};



/**
 * Bubbles up an element at a given index. This operation is O(log n).
 *
 * @param {Number} n - The number to bubble up
 * @this {BinaryHeap}
 * @return this
 */

BinaryHeap.prototype.bubbleUp = function(n) {
    // Fetch the element that has to be moved.
    var element = this.content[n];

    // When at 0, an element can not go up any further.
    while(n > 0) {

        // Compute the parent element's index, and fetch it.
        var parentN = Math.floor((n + 1) / 2) - 1,
            parent = this.content[parentN];

        if(this.scoreFunction(element) < this.scoreFunction(parent)) {

            // Swap the elements if the parent is greater.
            this.content[parentN] = element;
            this.content[n] = parent;

            // Update `n` to continue at the new position.
            n = parentN;

        } else {
            // Found a parent that is less, no need to move it further.
            break;
        }
    }

    return this;
};



/**
 * Sinks down an element at a given index. This operation is O(log n).
 *
 * @param {Number} n - The number to sink down
 * @this {BinaryHeap}
 * @return this
 */

BinaryHeap.prototype.sinkDown = function(n) {

    // Look up the target element and its score.
    var length = this.content.length,
        element = this.content[n],
        elemScore = this.scoreFunction(element);

    do {
        // Compute the indices of the child elements.
        var child2N = (n + 1) * 2,
            child1N = child2N - 1;

        // This is used to store the new position
        // of the element, if any.
        var swap = null;

        // If the first child exists (is inside the array)...
        if(child1N < length) {
            // Look it up and compute its score.
            var child1 = this.content[child1N],
                child1Score = this.scoreFunction(child1);

            // If the score is less than our element's, we need to swap.
            if(child1Score < elemScore) swap = child1N;
        }

        // Do the same checks for the other child.
        if(child2N < length) {
            var child2 = this.content[child2N],
                child2Score = this.scoreFunction(child2);

            if(child2Score < (swap === null ? elemScore : child1Score)) swap = child2N;
        }

        // If the element needs to be moved, swap it, and continue.
        if(swap !== null) {
            this.content[n] = this.content[swap];
            this.content[swap] = element;
            n = swap;
        }
    } while (swap !== null);

    return this;
};



/**
 * Gets the heap size. I assume JavaScript allows O(n) for this.
 *
 * @return {Number} - The heap size
 */

BinaryHeap.prototype.size = function() {
    return this.content.length;
};



/**
 * Inspects the root of the heap. This is find-min, O(1).
 *
 * @return {Number} - The first item in heap
 */

BinaryHeap.prototype.peek = function() {
    return this.content && this.content.length ? this.content[0] : null;
};


/**
 * Determines if a node exists in heap.
 *
 * @param {Mixed} x - The node to search for
 * @return {Boolean}
 */

BinaryHeap.prototype.contains = function(x) {
    return this.content.indexOf(x) !== -1;
};



/**
 * Clears the heap
 */

BinaryHeap.prototype.clear = function() {
    return this.content = [];
};



/**
 * Rescores a Node
 */

BinaryHeap.prototype.rescoreElement = function(node) {
    return this.sinkDown(this.content.indexOf(node));
};
