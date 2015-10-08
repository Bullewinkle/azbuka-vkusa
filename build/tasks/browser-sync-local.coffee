# Local version
module.exports = -> (done) =>

	browsersync = require('browser-sync')

	options =
		proxy: "localhost:#{@config.port}"
		port: @config.port + 1
		ghostMode:
			forms: true
			clicks: true
			scroll: true
			location: true
		browser: []
		notify: false

	browsersync("#{@config.dist}/**/*", options)
	done()