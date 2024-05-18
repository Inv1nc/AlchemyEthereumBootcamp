function countElements(elements) {
    let count = {};
    for (let i = 0; i < elements.length; i++) {
        if (count[elements[i]] > 0) {
            count[elements[i]] += 1;
        } else {
            count[elements[i]] = 1;
        }
    }
    return count;
}