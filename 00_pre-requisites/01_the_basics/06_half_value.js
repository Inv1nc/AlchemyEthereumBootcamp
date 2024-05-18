function halfValue(numbers) {
    halfvalue = []
    for (let i = 0; i < numbers.length; i++) {
        if (numbers[i] % 2 == 0) {
            halfvalue.push(numbers[i]/2);
        } else {
            halfvalue.push((numbers[i]+1)/2);
        }
    }
    return halfvalue;
}