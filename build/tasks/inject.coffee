module.exports = -> =>

	errorHandler = @$.notify.onError
		title: 'Inject error'
		message: '<%= error.message %>'

	vendorToDistPath = (vendorPath) =>
		smallPath = vendorPath.replace('bower_components/', '')
		smallPath = smallPath.replace('other_components/', '')
		scriptsPath = @config['scripts-vendor'].path.dest
		stylesPath = @config['styles-vendor'].path.dest
		
		if smallPath.indexOf('.js') > -1
			return "#{scriptsPath}/#{smallPath}"
		if smallPath.indexOf('.css') > -1
			return "#{stylesPath}/#{smallPath}"
			
	assets =
		stylesApp: @config['styles-app'].path.dest + '/app*.css'
		scriptsApp: @config['scripts-app'].path.dest + '/app*.js'

	if @PROD
		assets.stylesVendor = @config['styles-vendor'].path.dest + '/vendor*.css'
		assets.scriptsVendor = @config['scripts-vendor'].path.dest + '/vendor*.js'
	else
		assets.stylesVendor = @config['styles-vendor'].path.src.map(vendorToDistPath)
		assets.scriptsVendor = @config['scripts-vendor'].path.src.map(vendorToDistPath)


	injectStream = =>
		@que(objectMode: true)
			.queue(=> @g.src(assets.stylesVendor, read: false))
			.queue(=> @g.src(assets.scriptsVendor, read: false))
			.queue(=> @g.src(assets.stylesApp, read: false))
			.queue(=> @g.src(assets.scriptsApp, read: false))
			.done()

	stream = @g.src(@cfg.path.src)
		.pipe @$.plumber(errorHandler: errorHandler)
		.pipe @$.inject(injectStream(), @cfg.options)
		.pipe @$.rename(@cfg.name)
		.pipe @g.dest(@cfg.path.dest)
