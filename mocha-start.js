(function OLSKMochaBrowser() {
	if (process.env.OLSK_TESTING_BEHAVIOUR !== 'true') {
		return;
	}

	const Browser = require('zombie');

	Browser.localhost('loc.tests', 3001);
	
	Browser.prototype.OLSKFireKeyboardEvent = function(target, keyCode, eventOptions = {}) {
		const event = this.window.document.createEvent('HTMLEvents');
		event.initEvent('keydown', true, true);
		event.which = event.keyCode = event.key = event.code = keyCode;

		target = typeof target === 'string' ? this.query(target) : target;

		if (!target) {
			throw new Error('no target');
		}

		target.dispatchEvent(Object.assign(event, eventOptions));

		return this._wait(null);
	};

	Browser.extend(function(browser) {
	  browser.on('confirm', function(dialog) {
	    return browser.OLSKConfirmCallback ? browser.OLSKConfirmCallback(dialog) : dialog;
	  });
	});
	
	Browser.prototype.OLSKConfirm = async function(param1, param2) {
		let browser = this;
		return await new Promise(async function (resolve, reject) {
			browser.OLSKConfirmCallback = function (dialog) {
				delete browser.OLSKConfirmCallback;
				return resolve(param2 ? param2(dialog) : dialog);
			};

			param1();
		});
	};

	global.OLSKBrowser = Browser;

	global.browser = new OLSKBrowser();
})();

let languageDictionary = {};
(function OLSKMochaLocalizedStrings() {
	if (process.env.OLSK_TESTING_BEHAVIOUR !== 'true') {
		return;
	}

	const pathPackage = require('path');
	const OLSKInternational = require('OLSKInternational');
	const OLSKString = require('OLSKString');

	let baseDirectory = pathPackage.join(__dirname, 'os-app');
	languageDictionary = require('glob').sync('*i18n*.y*(a)ml', {
	  matchBase: true,
	  cwd: baseDirectory,
	}).filter(function(e) {
	  return OLSKInternational.OLSKInternationalIsTranslationFileBasename(pathPackage.basename(e));
	}).map(function (e) {
		return pathPackage.join(baseDirectory, e);
	}).reduce(function(coll, item) {
		let languageID = OLSKInternational.OLSKInternationalLanguageID(pathPackage.basename(item));

		return (coll[languageID] = Object.assign(coll[languageID] || {}, require('js-yaml').safeLoad(require('fs').readFileSync(item, 'utf8')))) && coll;
	}, {});

	global.OLSKTestingLocalized = function(translationConstant, languageCode) {
		return OLSKInternational.OLSKInternationalLocalizedString(translationConstant, languageDictionary[languageCode]).replace('TRANSLATION_MISSING', '');
	};

	global.OLSKTestingStringWithFormat = OLSKString.OLSKStringWithFormat;
})();

(function OLSKMochaPreprocess() {
	const fs = require('fs');
	const oldRequire = require('olsk-rollup-plugin-localize')()._OLSKRollupI18NReplaceInternationalizationToken;
	const replaceFunctions = [
		require('OLSKTesting')._OLSKTestingMochaReplaceES6Import,
		function (inputData) {
			return (oldRequire({
				code: inputData,
			}, languageDictionary) || {
				code: inputData,
			}).code;
		},
	];

	require.extensions['.js'] = function(module, filename) {
		if (filename.match('OLSKRollup')) {
			return;
		};

		try {
			return module._compile(replaceFunctions.reduce(function (coll, item) {
				return item(coll);
			}, fs.readFileSync(filename, 'utf-8')), filename);
		} catch (err) {
			// console.log(code); // eslint-disable-line no-console
			throw err;
		}
	};
})();

(function OLSKMochaErrors() {
	process.on('unhandledRejection', () => {
		// console.log('Unhandledd Rejection at:', arguments)
		// Recommended: send the information to sentry.io
		// or whatever crash reporting service you use
	});
})();
