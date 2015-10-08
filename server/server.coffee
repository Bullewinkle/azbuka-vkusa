compression = require('compression')
express = require('express')
http = require('http')
path = require('path')
build = require('../gulpfile')


app = express()
server = http.createServer(app)


port = process.env.PORT or build.config.port
dist = build.config.dist
assets = path.join(__dirname, "../#{dist}/assets")


app.use compression()

if build.config.spa
	app.use '/assets', express.static(assets)
	app.all '/*', (req, res) ->
		res.sendFile(path.join(__dirname, "../#{dist}", "index.html"))
else
	app.use '/', express.static(dist)


server.listen port, ->
	console.log "Static server on http://localhost:#{port}"