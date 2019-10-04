exports.OLSKControllerRoutes = function() {
	return {
		LBXPreferenceSimulateRoute: {
			OLSKRoutePath: '/stubs/LBXPreferenceSimulate',
			OLSKRouteMethod: 'get',
			OLSKRouteFunction: function (req, res, next) {
				return res.render(require('path').join(__dirname, 'stub-view.ejs'));
			},
			OLSKRouteLanguages: ['en'],
		},
	};
};
