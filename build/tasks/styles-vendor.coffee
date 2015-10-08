module.exports = -> =>

	srcBower = []
	srcOther = []

	for path in @cfg.path.src
		srcBower.push(path) if path.indexOf('bower_') > -1
		srcOther.push(path) if path.indexOf('other_') > -1

	getBower = =>
		@g.src(srcBower, base: './bower_components/')

	getOther = =>
		@g.src(srcOther, base: './other_components/')

	stream = @que(objectMode: true)
	stream.queue(getBower) if srcBower.length
	stream.queue(getOther) if srcOther.length

	stream = stream.done()
		.pipe @$.if(@argv.prod, @$.concat(@cfg.name))
		.pipe @$.if(@argv.prod, @$.minifyCss())
		.pipe @g.dest(@cfg.path.dest)
