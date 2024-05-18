function countVowels(str) {
	let count = 0;
    str = str.toLowerCase();
	for (let i=0; i<str.length; i++) {
		ch = str[i]
		if(ch === 'a' || ch === 'e' || ch === 'i' || ch === 'o' || ch === 'u') {
    		count += 1;
    	}
    }
    return count;
}