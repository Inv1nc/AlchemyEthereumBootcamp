function isPalindrome(string) {
    let reverse = "";
    for (let i = string.length-1; i >= 0; i--) {
        reverse += string[i];
    }
    if (string === reverse) {
        return true;
    }
    return false;
}