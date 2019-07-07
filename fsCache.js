const fs = require("fs");

const fileCache = {};

module.exports = function(path, encoding, forceReload) {
	if (!forceReload && fileCache[path]) {
		return fileCache[path];
	}
	fileCache[path] = fs.readFileSync(path, encoding);
	return fileCache[path];
};
