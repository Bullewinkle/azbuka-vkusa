console.info 'start'

$ ->
	$manWrapper = $('.man-vegetables ')
	$manVagatablsLayers = $manWrapper.find('.layer')
	layerCounter = 0
	defer = =>
		if layerCounter >= $manVagatablsLayers.length
			layerCounter = 0

		$manVagatablsLayers
		.removeClass('is-visible')
		.eq(layerCounter)
		.addClass('is-visible')

		layerCounter++

		setTimeout defer, 3000

	defer()
#	setInterval	defer, 1000
