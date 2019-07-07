module.exports = function(literals) {
	function replaceTarget(string, search, replacement) {
		return string.split(search).join(replacement);
	}

	return function(...keys) {
		let string = literals;

		for (const [i, val] of keys.entries()) {
			for (let p in val) {
				string = replaceTarget(string, "${" + p + "}", val[p]);
			}
		}

		return string;
	};
};
