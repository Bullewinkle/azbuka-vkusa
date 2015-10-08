module.exports = -> =>

	stream = @g.src(@cfg.path.src)
		.pipe @$.docco()
		.pipe @g.dest(@cfg.path.dest)