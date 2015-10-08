build = require('./build')
bower = require('./bower.json')
pack = require('./package.json')


SRC = 'src'
DIST = 'dist'
SUFFIX = Date.now()


APP = "#{SRC}/app"
TOOLS = "#{SRC}/tools"
ASSETS = "#{SRC}/assets"


build.configure CONFIG =

	# Meta data
	pack: pack
	bower: bower
	suffix: SUFFIX
	
	# Server configuration
	spa: false
	port: 9000

	# Main paths
	src: SRC
	app: APP
	dist: DIST
	tools: TOOLS
	assets: ASSETS
	
	# Enable/disable specific tasks
	# Used for make simple manipulation
	# from yeoman generator
	DOCS: false
	IMAGEMIN: false
	SPRITE_PNG: false
	NG_ANNOTATE: true
	NG_TEMPLATE: true
	BROWSER_SYNC: true


build.task 'default'
build.task 'deploy'
build.task 'server'
build.task 'clean'
build.task 'watch'


build.task 'scripts-vendor',
	name: "vendor-#{SUFFIX}.js"
	path:
		dest: "#{DIST}/assets/js/vendor"
		src: bower.vendor.scripts


build.task 'styles-vendor',
	name: "vendor-#{SUFFIX}.css"
	path:
		dest: "#{DIST}/assets/css/vendor"
		src: bower.vendor.styles


build.task 'scripts-app',
	options:
		bare: false
	dev:
		name: "app.js"
	prod:
		name: "app-#{SUFFIX}.js"
	path:
		watch: "#{ASSETS}/scripts/**/*"
		dest: "#{DIST}/assets/js/app"
		src: [
			"#{ASSETS}/main.js"
			"#{ASSETS}/**/*.js"
			"#{ASSETS}/main.coffee"
			"#{ASSETS}/**/*.coffee"
			"#{APP}/**/*.module.coffee"
			"#{APP}/**/*.coffee"
			"!**/*.spec.coffee"
		]


build.task 'styles-app',
	dev:
		name: "app.css"
		options: {}
	prod:
		name: "app-#{SUFFIX}.css"
		options:
			compress: true
	path:
		watch: "#{ASSETS}/styles/**/*"
		dest: "#{DIST}/assets/css/app"
		src: [
			"#{ASSETS}/styles/main.styl"
			"#{APP}/**/*.module.styl"
		]


build.task 'inject',
	name: 'root.jade'
	options:
		addRootSlash: true # TODO: move to main config
		ignorePath: "/#{DIST}/"
	path:
		dest: "#{ASSETS}/jade"
		src: "#{ASSETS}/jade/main.jade"


build.task 'pages',
	rebuildOnCommon: true
	options:
		pretty: true
	path:
		watch: "#{SRC}/*.jade"
		dest: "#{DIST}"
		src: "#{SRC}/*.jade"


build.task 'views',
	rebuildOnCommon: false
	options:
		pretty: true
	path:
		watch: "#{ASSETS}/views/**/*"
		dest: "#{DIST}/assets/views"
		src: [
			"#{ASSETS}/views/**/*.jade"
			"#{APP}/**/*.jade"
		]
	

build.task 'font',
	path:
		watch: "#{ASSETS}/font/**/*"
		dest: "#{DIST}/assets/font"
		src: "#{ASSETS}/font/**/*.{woff,eot,ttf,svg}"


build.task 'img',
	options:
		optimizationLevel: 0
	path:
		watch: "#{ASSETS}/img/**/*"
		dest: "#{DIST}/assets/img"
		src: "#{ASSETS}/img/**/*.{jpeg,jpg,png,gif,svg}"


build.task 'copy',
	globs: [
		dest: "#{DIST}"
		src: "#{SRC}/meta/package.json"
	]


build.task 'zip',
	name: pack.name
	path:
		dest: '~/Desktop'

	
if CONFIG.BROWSER_SYNC 
	build.task 'browser-sync-global'


if CONFIG.DOCS 
	build.task 'docs',
		path:
			dest: 'docs'
			src: "#{APP}/**/*.coffee"


if CONFIG.NG_TEMPLATE
	# After this task views directory
	# will be removed
	build.task 'views-cache',
		name: 'app-templates.js'
		options:
			module: 'app'
			root: '/assets/views/'
			standalone: false
		path:
			dest: "#{DIST}/assets/js/app"
			cwd: "#{DIST}/assets/views"
			src: [
				"#{DIST}/assets/views/**/*.html"
			]


if CONFIG.SPRITE_PNG
	# Every key in options is folder name
	# and value is css-sprite options for
	# this folder
	build.task 'sprite-png',
		options:
			common:
				retina: true
		path:
			css: "/assets/img/sprite-png/"
			cwd: "#{TOOLS}/sprite-png"
			destStyles: "#{ASSETS}/styles/sprite-png"
			destSprite: "#{ASSETS}/img/sprite-png"


module.exports = build