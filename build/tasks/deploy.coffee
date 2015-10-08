module.exports = ->

	@$.shell.task [
		"git add -A"
		"git commit -m 'New build'"
		"npm version patch"
		"git push origin master"
	]
