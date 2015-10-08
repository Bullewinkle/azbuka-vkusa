module.exports = ->

	@$.sprite = require('css-sprite').stream

	errorHandler = @$.notify.onError
		title: 'Sprite error'
		message: '<%= error.message %>'

	generators = {}

	# Register cleaning task
	@g.task 'sprite-png-clean', (done) =>
		src = [
			@cfg.path.destStyles
			@cfg.path.destSprite
		]
		@del(src, done)


	# Register generators
	@utils.listFolder(@cfg.path.cwd).map (folder) =>

		taskName = "sprite-png-#{folder}"

		spriteCwd = @p.join(@cfg.path.cwd, folder)
		spriteSrc = "#{spriteCwd}/*.png"

		optionsUser = @cfg?.options?[folder]
		optionsDefault =
			name: "#{folder}"
			prefix: "png-#{folder}"
			style: "#{folder}.styl"
			cssPath: @cfg.path.css
			margin: 10
			template: 'build/utils/sprite-png.mustache'
			orientation: 'binary-tree'

		options = @_.extend {}, optionsDefault, optionsUser

		generators[taskName] = =>

			stream = @g.src(spriteSrc)

			if @PROD and @config.IMAGEMIN
				stream = stream.pipe @$.imagemin()

			stream = stream
				.pipe @$.plumber(errorHandler: errorHandler)
				.pipe @$.sprite(options)
				.pipe @$.if('*.png', @g.dest(@cfg.path.destSprite))
				.pipe @$.if('*.styl', @g.dest(@cfg.path.destStyles))

		@g.task taskName, generators[taskName]


	(done) =>
		spriteTasks = []
		spriteTasks.push(taskName) for taskName, task of generators
		@seq.apply @, ['sprite-png-clean', spriteTasks, done]