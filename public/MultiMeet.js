/**
 * Created with JetBrains WebStorm.
 * User: jiangyaokai
 * Date: 12-6-7
 * Time: 上午1:07
 * To change this template use File | Settings | File Templates.
 */
var EARTH = {
  RADIUS : 6371
};

function Cartesian(x, y, z) {
  this.x = x;
  this.y = y;
  this.z = z;
}

function latLngToCartesian(lat, long) {
  lat = toRadian(lat);
  long = toRadian(long);

  var R = EARTH.RADIUS;
  var x = R * Math.cos(lat) * Math.cos(long);
  var y = R * Math.cos(lat) * Math.sin(long);
  var z = R * Math.sin(lat);
  return new Cartesian(x, y, z);
}

function toRadian(degree) {
  var pi = Math.PI;
  return degree * pi / 180;
}

function toDegree(rad) {
  var pi = Math.PI;
  return rad * 180 / pi;
}

function cartesianToLatLong(x, y, z) {
  var R = Math.sqrt(x*x + y*y + z*z);
  var lat = toDegree(Math.asin(z/R));
  var lon = toDegree(Math.atan2(y, x));
  return new google.maps.LatLng(lat,lon);
}

function midPoint(latLongArray, willingnessArray) {
  var aggreX = 0;
  var aggreY = 0;
  var aggreZ = 0;
  var factor = 1;
  for (var i = 0; i < latLongArray.length; i++) {
    var cartesian = latLngToCartesian(latLongArray[i].lat(), latLongArray[i].lng());
    var willingness = willingnessArray[i];
    if (willingness === 0) {
      alert("DIVIDE BY ZERO! SETTING TO 1");
      willingness = 1;
    }
    if (isNaN(willingness)) {
      alert("fixing nan");
      willingness = 1;
    }
    aggreX += cartesian.x / willingness;
    aggreY += cartesian.y / willingness;
    aggreZ += cartesian.z / willingness;
    factor *= willingness;
  }
  aggreX *= factor;
  aggreY *= factor;
  aggreZ *= factor;
  return cartesianToLatLong(aggreX / latLongArray.length, aggreY / latLongArray.length, aggreZ / latLongArray.length);
}

function getRoadDistanceArray(mid, latLongArray, willingnessArray, count) {
	var param = {
		    origins: [mid],
		    destinations: latLongArray,
		    travelMode: google.maps.TravelMode.DRIVING,
		    avoidHighways: false,
		    avoidTolls: false
	};
	distanceMatrixService.getDistanceMatrix(param, function(response, status) {
		  if (status == google.maps.DistanceMatrixStatus.OK) {
			    var origins = response.originAddresses;
			    var destinations = response.destinationAddresses;

			    for (var i = 0; i < origins.length; i++) {
			      var results = response.rows[i].elements;
			      for (var j = 0; j < results.length; j++) {
			        var element = results[j];
			        var distance = element.distance.text;
			      }
			    }
			  }
	});
}

function bearing(mid, latLong) {
	var y = Math.sin(Math.abs(mid.getLng() - latLong.getLng())) * Math.cos(latLong.getLat());
	var x = Math.cos(mid.getLat())*Math.sin(latLong.getLat()) -
	        Math.sin(mid.getLat())*Math.cos(latLong.getLat())*Math.cos(Math.abs(mid.getLng() - latLong.getLng()));
	return Math.atan2(y, x);
}

function moveMidInDirection(mid, bearing, epsilon) {
	lat1 = toRadian(mid.getLat());
	lng1 = toRadian(mid.getLng());
	lat2 = Math.asin( math.sin(lat1)*Math.cos(epsilon/EARTH.RADIUS) +
			Math.cos(lat1)*Math.sin(epsilon/EARTH.RADIUS)*Math.cos(bearing));

	lng2 = lng1 + Math.atan2(Math.sin(bearing)*Math.sin(epsilon/EARTH.RADIUS)*Math.cos(lat1),
				Math.cos(epsilon/EARTH.RADIUS)-Math.sin(lat1)*Math.sin(lat2));
	return new google.maps.LatLng(lat2, lng2, false);
}

function findBestMid(mid, latLongArray, willingnessArray, epsilon, count) {
	
}