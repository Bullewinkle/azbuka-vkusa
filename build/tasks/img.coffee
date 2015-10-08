module.exports = -> =>

	stream = @g.src(@cfg.path.src)
		.pipe @$.changed(@cfg.path.dest)

	if @config.IMAGEMIN and @PROD
		stream = stream
			.pipe @$.imagemin(@cfg.options)

	stream = stream
		.pipe @g.dest(@cfg.path.dest)
