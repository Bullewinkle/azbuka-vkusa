path = require('path')
fs = require('fs')


module.exports =
	
	listFolder: (folder, relative = false) ->
		fs.readdirSync(folder).map (subfolder) ->
			normalPath = path.join(folder, subfolder)
			if fs.statSync(normalPath).isDirectory()
				if relative
					return normalPath
				else
					return subfolder
