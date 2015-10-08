module.exports = -> =>

	errorHandler = @$.notify.onError
		title: 'Jade error'
		message: '<%= error.message %>'

	stream = @g.src(@cfg.path.src)
		.pipe @$.plumber(errorHandler: errorHandler)
	
	if !global.ON_COMMON_JADE
		stream = stream
			.pipe @$.changed(@cfg.path.dest, extension: '.html')
			
	global.ON_COMMON_JADE = false

	stream = stream
		.pipe @$.jade(@cfg.options)
		.pipe @g.dest(@cfg.path.dest)
