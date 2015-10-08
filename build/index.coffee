class Build

	# Namespace for all tasks
	tasks: {}

	# Namespace for all configuration
	config: {}

	constructor: ->

		# Main modules
		@_ = require('lodash')
		@p = require('path')
		@g = require('gulp')
		@$ = require('gulp-load-plugins')(lazy: true, camelize: true)

		# Helpers
		@seq = require('run-sequence')
		@que = require('streamqueue')
		@del = require('del')
		@argv = require('optimist').argv
		@utils = require('./utils')

		# Build type flags
		@DEV = !@argv.prod
		@PROD = @argv.prod

	configure: (config) ->

		@config = @_.extend @config, config

	task: (taskName, taskConfig = {}) ->

		# Task factory and her context
		factory = require(@p.join(__dirname, 'tasks', taskName))
		context = @_.extend({}, @)

		# Link to current tasks/config
		context.tasks = @tasks
		context.config = @config

		# Add config to main config namespace
		@config[taskName] = @_.extend({}, taskConfig)

		# Save and remove dev/prod for extending later
		configProd = @_.extend({}, taskConfig.prod)
		configDev = @_.extend({}, taskConfig.dev)
		delete taskConfig.dev
		delete taskConfig.prod

		# Create task cfg
		context.cfg = @_.extend({}, taskConfig)
		@_.extend(context.cfg, configDev) if @DEV
		@_.extend(context.cfg, configProd) if @PROD
		
		# Add task to main task namespace
		@tasks[taskName] = factory.call(context)

		# Register native gulp plugin
		@g.task(taskName, @tasks[taskName])

module.exports = new Build

# TODO: Remove this shit
# Flag for compile all/changed jade
# Toggled in pages/views/watch tasks
global.ON_COMMON_JADE = false