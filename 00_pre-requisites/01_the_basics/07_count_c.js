function countC(str) {
	let count = 0;
	str = str.toLowerCase();
	for(let i = 0; i < str.length; i++) {
		if (str[i] === 'c') {
			count += 1;
		}
	}
	return count;
}