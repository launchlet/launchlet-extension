const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().LBXSettingsRoute;

describe('LBXSettingsUI_Misc', function () {

	before(function() {
		return browser.OLSKVisit(kDefaultRoute);
	});

	describe('body', function () {

		it('classes OLSKDecor', function () {
			browser.assert.hasClass('body', 'OLSKDecor');
		});

		it('classes OLSKDecorCapped', function () {
			browser.assert.hasClass('body', 'OLSKDecorCapped');
		});

	});

	describe('LBXSettingsGuideLink', function () {
		
		it('sets href', function () {
			browser.assert.attribute(LBXSettingsGuideLink, 'href', 'https://launchlet.dev/guide');
		});

		it('sets target', function () {
			browser.assert.attribute(LBXSettingsGuideLink, 'target', '_blank');
		});

	});

});
