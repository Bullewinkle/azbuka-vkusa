module.exports = -> =>
	
	stream = @g.src @cfg.path.src
		.pipe @$.angularTemplatecache(@cfg.options)
		.pipe @$.rename(@cfg.name)
		.pipe @g.dest @cfg.path.dest
