module.exports = -> =>

	# Filtering .coffee files
	filterCoffee = @$.filter('**/*.coffee')

	# Error handler for notification
	errorHandler = @$.notify.onError
		title: 'Coffee error'
		message: '<%= error %>'

	# Task stream
	stream = @g.src @cfg.path.src
		# Error handling
		.pipe @$.plumber(errorHandler: errorHandler)
		# Sourcemaps start
		.pipe @$.if(@DEV, @$.sourcemaps.init())
		# CoffeeScript
		.pipe filterCoffee
		.pipe @$.coffee(@cfg.options)
#		.pipe filterCoffee.restore()
		# Babel
		.pipe @$.babel()
		# Concatination
		.pipe @$.if(@DEV, @$.concat(@cfg.name))
		# Sourcemaps end
		.pipe @$.if(@DEV, @$.sourcemaps.write())

	# Angular annotations
	if @PROD and @config.NG_ANNOTATE
		stream = stream.pipe @$.ngAnnotate()
		
	# Angular templates
	if @PROD and @config.NG_TEMPLATE
		vcfg = @config['views-cache']
		views = "#{vcfg.path.dest}/#{vcfg.name}"
		stream = stream
			.pipe @$.addSrc.append(views)
			.on 'end', =>
				@del(views)
				@del(vcfg.path.cwd)

	# Production and and stream
	stream = stream
		.pipe @$.if(@PROD, @$.concat(@cfg.name))
		.pipe @$.if(@PROD, @$.uglify())
		.pipe @g.dest(@cfg.path.dest)