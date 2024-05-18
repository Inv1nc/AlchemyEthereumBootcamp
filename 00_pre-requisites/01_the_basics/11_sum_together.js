function sumTogether(arr1, arr2) {
    let sum = [];
    for(let i = 0; i < arr1.length; i++) {
        sum[i] = arr1[i] + arr2[i];
    }
    return sum;
}