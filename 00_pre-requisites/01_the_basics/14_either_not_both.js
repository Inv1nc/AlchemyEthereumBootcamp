function eitherNotBoth(num) {
    if ((num % 3 == 0 ) && (num % 5 == 0)) {
        return false;
    } else if ((num % 3== 0 ) || (num % 5 == 0)) {
        return true;
    }
    return false;
}