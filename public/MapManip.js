function centerMap() {
	console.log(latLongArray);
	var googleLatLng = midPoint(latLongArray, willingnessArray);
	map.setCenter(googleLatLng);
	new google.maps.Marker({
		map : map,
		position : googleLatLng
	});
	radius = 500;
	var restaurantFinder = {
		location : googleLatLng,
		types : [ 'restaurant' ],
		findRestaurant : function() {
			placesService.search({
				location : restaurantFinder.location,
				radius : radius,
				types : restaurantFinder.types
			}, this.placesCallback);
		},
		placesCallback : function(results, status) {
			console.log('this:', restaurantFinder);
			console.log('results', results);
			if (status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
				if (radius < 5000) {
					radius += 500;
					restaurantFinder.findRestaurant();
				} else {
					return;
				}
			} else if (status === google.maps.places.PlacesServiceStatus.OK) {
				for ( var i = 0; i < results.length; i++) {
					var place = results[i];
					createMarker(results[i]);
				}
			}
		}
	};
	restaurantFinder.findRestaurant();
}

function createMarker(place) {
	var placeLoc = place.geometry.location;
	var marker = new google.maps.Marker({
		map : map,
		position : place.geometry.location
	});

	google.maps.event.addListener(marker, 'click', function() {
		infowindow.setContent(place.name);
		infowindow.open(map, this);
	});
}