exports.OLSKControllerRoutes = function() {
	return {
		LBXPreferencesRoute: {
			OLSKRoutePath: '/preferences',
			OLSKRouteMethod: 'get',
			OLSKRouteFunction: function (req, res, next) {
				return res.render(require('path').join(__dirname, 'ui-view.html'));
			},
			OLSKRouteLanguages: ['en', 'fr', 'es'],
		},
	};
};
