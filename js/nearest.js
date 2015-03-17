function loadCanvas(imagePath) {

	var c = document.getElementById("originalCanvas");
	var ctx = c.getContext("2d");
	var img = new Image();
	img.onload = function() {
		c.width = img.width;
		c.height = img.height;
		ctx.drawImage(img, 0, 0, img.width, img.height);
	};
	img.crossOrigin = 'anonymous';
	img.src = imagePath;
}

function nearest(type, apply, dir) {
	var originalCanvas = document.getElementById("originalCanvas");
	var nearCanvas = document.getElementById("nearCanvas");
	var originalCtx = originalCanvas.getContext("2d");
	var nearCtx = nearCanvas.getContext("2d");

	nearCanvas.width = originalCanvas.width;
	nearCanvas.height = originalCanvas.height;

	var originalImgData = originalCtx.getImageData(0, 0, originalCanvas.width,
			originalCanvas.height);
	var originalPixels = originalImgData.data;

	var func;
	var direction;

	if (type === "prime")
		func = isPrime;
	else if (type === "fibo")
		func = isFibo;
	else if (type === "psquare")
		func = isPerfectSquare;
	else if (type === "pentagonal")
		func = isPentagonal;

	if (dir == "up")
		direction = 1;
	else if (dir == "down")
		direction = -1;

	nearestImageData = nearCtx.createImageData(nearCanvas.width,
			nearCanvas.height);

	if (apply == "pixel") {
		for (var i = 0; i < originalPixels.length; i += 4) {
			var r = originalPixels[i];
			var g = originalPixels[i + 1];
			var b = originalPixels[i + 2];
			var a = originalPixels[i + 3];

			var pVal = rgbToInt(r, g, b);
			var newPVal = getNearest(pVal, direction, func);

			var newRgb = intToRgb(newPVal);

			nearestImageData.data[i] = newRgb[0];
			nearestImageData.data[i + 1] = newRgb[1];
			nearestImageData.data[i + 2] = newRgb[2];
			nearestImageData.data[i + 3] = a;
		}
	} else if (apply == "rgb") {
		for (var i = 0; i < originalPixels.length; i += 4) {
			var r = originalPixels[i];
			var g = originalPixels[i + 1];
			var b = originalPixels[i + 2];
			var a = originalPixels[i + 3];

			var nr = getNearest(r, direction, func);
			var ng = getNearest(g, direction, func);
			var nb = getNearest(b, direction, func);
			
			// TODO
			nr = nr % 255;
			ng = ng % 255;
			nb = nb % 255;
			na = 255;

			nearestImageData.data[i] = nr;
			nearestImageData.data[i + 1] = ng;
			nearestImageData.data[i + 2] = nb;
			nearestImageData.data[i + 3] = na;
		}
	}

	nearCtx.putImageData(nearestImageData, 0, 0);
}

function rgbaToInt(r, g, b, a) {
	return (r << 24) | (g << 16) | (b << 8) | (a);
}

function intToRgba(color) {
	var r = color >> 24 & 0xFF;
	var g = color >> 16 & 0xFF;
	var b = color >> 8 & 0xFF;
	var a = color & 0xFF;

	return [ r, g, b, a ];
}

function rgbToInt(r, g, b) {
	return (r << 16) | (g << 8) | (b);
}

function intToRgb(color) {
	var r = color >> 16 & 0xFF;
	var g = color >> 8 & 0xFF;
	var b = color & 0xFF;

	return [ r, g, b ];
}

function getNearest(number, dir, func) {
	if (func === isFibo) {
		return isFibo(number, dir);
	} else {
		while (!func(number))
			number += dir;

		return number;
	} 
}

function isPrime(number) {
	var range = Math.round(Math.sqrt(number)) + 1;

	for (var i = 2; i < range; i++) {
		if (number % i == 0)
			return false;
	}

	return true
}

function isPerfectSquare(x) {
	var s = Math.round(Math.sqrt(x));
	return (s * s == x);
}

function isFibo(n, dir) {
	for (var i=1; i<fibos.length-1;i++) {
		if (n >= fibos[i-1] && n<fibos[i]) {
			if (dir > 0) {
				return fibos[i];
			} else {
				return fibos[i-1];
			}
		}
	}
	return -1;
//	return isPerfectSquare(5 * n * n + 4) || isPerfectSquare(5 * n * n - 4);
}

function isPentagonal(n) {
	return isPerfectSquare(24 * n + 1);
}

// function isFibo(number) {
// var a = 1.618 * number;
// return number == 0 || Math.abs(Math.round(a) - a) < (1.0 / number);
// }

var fibos = [ 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597,
		2584, 4181, 6765, 10946, 17711, 28657, 46368, 75025, 121393, 196418,
		317811, 514229, 832040, 1346269, 2178309, 3524578, 5702887, 9227465,
		14930352, 24157817 ];
