const pathPackage = require('path');

module.exports = {
	LBXBackgroundRollupConfigCustom (inputData, options) {
		if (typeof inputData !== 'object' || inputData === null) {
			throw new Error('LBXErrorInputInvalid');
		}

		inputData.plugins.splice(inputData.plugins.indexOf(inputData.plugins.filter(function (e) {
			return e.name === 'livereload';
		}).pop()), 1);

		return inputData;
	},
	OLSKRollupConfigCustom (inputData, options) {
		return module.exports.LBXBackgroundRollupConfigCustom(inputData, options);
	},
};
