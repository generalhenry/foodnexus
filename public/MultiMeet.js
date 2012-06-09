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
