module.exports = -> (cb) =>

	tasks = ['clean']

	tasks.push [
		'scripts-vendor'
		'styles-vendor'
		'views'
		'font'
		'copy'
	]

	if @PROD and @config.NG_TEMPLATE
		tasks.push 'views-cache'

	if @config.SPRITE_PNG
		tasks.push 'sprite-png'

	tasks.push [
		'img'
		'styles-app'
		'scripts-app'
	]

	tasks.push 'inject'
	tasks.push 'pages'
	tasks.push 'server'
	
	if @config.BROWSER_SYNC and @DEV
		tasks.push ['watch', 'browser-sync-global']
	else if @DEV
		tasks.push 'watch'

	@seq.apply(@, tasks)