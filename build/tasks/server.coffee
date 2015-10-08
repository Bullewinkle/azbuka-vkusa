# console.time 'Build time'
module.exports = -> (done) =>
	# console.timeEnd 'Build time'
	require('../../server/server')
	done()
