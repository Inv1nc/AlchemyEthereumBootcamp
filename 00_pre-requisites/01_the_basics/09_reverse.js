function reverse(string) {
    let reverse = "";
    for(let i = 0; i < string.length; i++) {
        reverse = string[i] + reverse;
    }
    return reverse;
}