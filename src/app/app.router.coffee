angular
	.module 'app'
	.config ($stateProvider, $urlRouterProvider, $locationProvider) ->

		$locationProvider.html5Mode
			requireBase: false
			enabled: true

		$urlRouterProvider.otherwise '/'

		$stateProvider.state 'home',
			url: '/'
			views:
				'content@':
					templateUrl: "#{__VIEWS}/modules/home.html"