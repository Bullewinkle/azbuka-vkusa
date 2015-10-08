module.exports = -> =>

	errorHandler = @$.notify.onError
		title: 'Stylus error'
		message: '<%= error.message %>'

	stream = @g.src(@cfg.path.src)
		.pipe @$.plumber(errorHandler: errorHandler)
		.pipe @$.if(@DEV, @$.sourcemaps.init())
		.pipe @$.stylus(@cfg.options)
		.pipe @$.autoprefixer()
		.pipe @$.concat(@cfg.name)
		.pipe @$.if(@DEV, @$.sourcemaps.write())
		.pipe @$.if(@PROD, @$.minifyCss())
		.pipe @g.dest(@cfg.path.dest)
