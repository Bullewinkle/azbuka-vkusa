module.exports = -> (done) =>

	for glob in @cfg.globs
		@g.src(glob.src)
			.pipe @$.changed(glob.dest)
			.pipe @g.dest(glob.dest)

	done()
