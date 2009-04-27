$require(MPR.path + 'More/Utilities.Assets/Utilities.Assets.js');

//normal Asset.images function doesn't support error handling
Asset.images = function(sources, options) {
	options = $merge({
		onComplete: $empty,
		onProgress: $empty,
		onError: $empty
	}, options);
	if (!sources.push) sources = [sources];
	var images = [];
	var counter = 0;
	sources.each(function(source){
		var img = new Asset.image(source, {
			'onload': function(){
				options.onProgress.call(this, counter, sources.indexOf(source));
				counter++;
				if (counter == sources.length) options.onComplete();
			},
			'onerror': function(){
				options.onError.call(this, counter, sources.indexOf(source));
				counter++;
				if (counter == sources.length) options.onComplete();
			}
		});
		images.push(img);
	});
	return new Elements(images);
}