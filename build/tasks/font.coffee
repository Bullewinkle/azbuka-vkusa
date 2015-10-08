module.exports = -> =>

	stream = @g.src(@cfg.path.src)
		.pipe @$.changed(@cfg.path.dest)
		.pipe @g.dest(@cfg.path.dest)
