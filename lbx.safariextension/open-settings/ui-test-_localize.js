const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().LBXSettingsRoute;

kDefaultRoute.OLSKRouteLanguageCodes.forEach(function (languageCode) {

const uLocalized = function (inputData) {
	return OLSKTestingLocalized(inputData, languageCode);
};

describe(`LBXSettingsUI_Localize-${ languageCode }`, function () {

	before(function() {
		return browser.OLSKVisit(kDefaultRoute, {
			OLSKRoutingLanguage: languageCode,
		});
	});

	it('localizes LBXSettingsGuideLink', function () {
		browser.assert.text(LBXSettingsGuideLink, uLocalized('LBXSettingsGuideLinkText'));
	});

});

});
