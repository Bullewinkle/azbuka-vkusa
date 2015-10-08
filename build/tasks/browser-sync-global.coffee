# Global version
module.exports = ->

	cmd = "browser-sync start "
	cmd += "--port #{@config.port + 1} "
	cmd += "--files '#{@config.dist}/**/*' "
	cmd += "--proxy localhost:#{@config.port} "
	cmd += "--no-notify --no-open"

	@$.shell.task [cmd]