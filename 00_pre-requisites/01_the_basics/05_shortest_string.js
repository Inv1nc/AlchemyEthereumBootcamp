function shortestString(str1, str2) {
	const len_str1 = str1.length;
	const len_str2 = str2.length;
	if (len_str1 > len_str2) {
		return str2;
	} else {
		return str1;
	}
}