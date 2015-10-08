module.exports = -> =>

	dest = @cfg.path.dest
	name = @cfg.name

	@$.shell.task [
		"cd #{@config.dist} && zip -9 -r #{dest}/#{name}.zip *"
	]
