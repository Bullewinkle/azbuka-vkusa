# TODO:
# Try to move all watchers directly to task
module.exports = -> (done) =>

	errorHandler = @$.notify.onError
		title: 'Watch error'
		message: '<%= error.message %>'

	# Images
	@g.watch @config['img'].path.watch
		.on 'error', errorHandler
		.on 'change', => @seq ['img']

	# Fonts
	@g.watch @config['font'].path.watch
		.on 'error', errorHandler
		.on 'change', => @seq ['font']

	# Pages
	@g.watch @config['pages'].path.src
		.on 'error', errorHandler
		.on 'change', => @seq ['pages']

	# Assets views
	@g.watch @config['views'].path.watch
		.on 'error', errorHandler
		.on 'change', => @seq ['views']

	# Assets styles
	@g.watch @config['styles-app'].path.watch
		.on 'error', errorHandler
		.on 'change', => @seq ['styles-app']

	# Assets scripts
	@g.watch @config['scripts-app'].path.watch
		.on 'error', errorHandler
		.on 'change', => @seq ['scripts-app']

	# App views / styles / scripts
	@g.watch "#{@config.app}/**/*"
		.on 'error', errorHandler
		.on 'change', (e) =>
			ext = @p.extname(e.path)
			return unless ext
			map =
				'.js': ['scripts-app']
				'.css': ['styles-app']
				'.styl': ['styles-app']
				'.coffee': ['scripts-app']
				'.jade': ['views']
			@seq.apply(@, map[ext]) if map[ext]

	# Inject
	@g.watch @config['inject'].path.src
		.on 'error', errorHandler
		.on 'change', => @seq ['inject']

	# Assets jade
	@g.watch ["#{@config.assets}/jade/**/*", "!#{@config.inject.path.src}"]
		.on 'error', errorHandler
		.on 'change', =>
			if @config['pages'].rebuildOnCommon
				global.ON_COMMON_JADE = true
				@seq ['pages']
			if @config['views'].rebuildOnCommon
				global.ON_COMMON_JADE = true
				@seq ['views']

	# Sprite PNG
	if @config.SPRITE_PNG
		spriteCwd = @config['sprite-png'].path.cwd
		for folderName in @utils.listFolder(spriteCwd)
			@g.watch "#{spriteCwd}/#{folderName}/*.png"
				.on 'error', errorHandler
				.on 'change', => @seq ["sprite-png-#{folderName}"]

	# Copy
	for glob in @config['copy'].globs
		@g.watch glob.src
			.on 'error', errorHandler
			.on 'change', => @seq ['copy']