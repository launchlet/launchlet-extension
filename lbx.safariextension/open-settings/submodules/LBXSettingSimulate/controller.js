exports.OLSKControllerRoutes = function() {
	return {
		LBXSettingSimulateRoute: {
			OLSKRoutePath: '/stubs/LBXSettingSimulate',
			OLSKRouteMethod: 'get',
			OLSKRouteFunction: function (req, res, next) {
				return res.render(require('path').join(__dirname, 'stub-view.ejs'));
			},
			OLSKRouteLanguages: ['en', 'fr', 'es'],
		},
	};
};