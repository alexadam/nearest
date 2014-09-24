
function loadCanvas(imagePath) {
	
    var c=document.getElementById("originalCanvas");
    var ctx=c.getContext("2d");
    var img=new Image();
    img.onload = function(){
    	  c.width = img.width;
    	  c.height = img.height;
          ctx.drawImage(img,0,0, img.width, img.height);
    };
    img.crossOrigin = 'anonymous';
    img.src=imagePath;
}

function nearest(type, apply, dir) {
	var  originalCanvas = document.getElementById("originalCanvas");
	var nearCanvas = document.getElementById("nearCanvas");
	var originalCtx = originalCanvas.getContext("2d");
	var nearCtx = nearCanvas.getContext("2d");

	nearCanvas.width = originalCanvas.width;
	nearCanvas.height = originalCanvas.height;
	
	var originalImgData = originalCtx.getImageData(0, 0, originalCanvas.width, originalCanvas.height);
	var originalPixels = originalImgData.data;
	
	var func;
	var direction;
	
	if (type == "prime")
		func = isPrime;
    else if (type == "fibo")
    	func = isFibo;
	
	if (dir == "up")
		direction = 1;
	else if (dir == "down")
		direction = -1;
	
	nearestImageData = nearCtx.createImageData(nearCanvas.width, nearCanvas.height);
	
	if (apply == "pixel") {
		for (var i = 0; i < originalPixels.length; i += 4) {
		    var r = originalPixels[i];
		    var g = originalPixels[i+1];
		    var b = originalPixels[i+2];
		    var a = originalPixels[i+3];
		    
		    var pVal = rgbToInt(r, g, b);
		    var newPVal = getNearest(pVal, direction, func);
		    var newRgba = intToRgb(newPVal);
		    
		    nearestImageData.data[i] = newRgba[0];
		    nearestImageData.data[i+1] = newRgba[1];
		    nearestImageData.data[i+2] = newRgba[2];
		    nearestImageData.data[i+3] = a;
		}
	} else if (apply == "rgb") {
		for (var i = 0; i < originalPixels.length; i += 4) {
		    var r = originalPixels[i];
		    var g = originalPixels[i+1];
		    var b = originalPixels[i+2];
		    var a = originalPixels[i+3];

		    var nr = getNearest(r, direction, func);
		    var ng = getNearest(g, direction, func);
		    var nb = getNearest(b, direction, func);
		    var na = getNearest(a, direction, func);
		    
		    //TODO
		    nr = nr % 255;
		    ng = ng % 255;
		    nb = nb % 255;
		    na = 255;
		    
		    nearestImageData.data[i] = nr;
		    nearestImageData.data[i+1] = ng;
		    nearestImageData.data[i+2] = nb;
		    nearestImageData.data[i+3] = na;
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
	
	return [r, g, b, a];
}

function rgbToInt(r, g, b, a) {
	return (r << 16) | (g << 8) | (b);
}

function intToRgb(color) {
	var r = color >> 16 & 0xFF;
	var g = color >> 8 & 0xFF; 
	var b = color & 0xFF;
	
	return [r, g, b];
}

function getNearest(number, dir, func) {
	while (!func(number))
		number += dir;
	
	return number;
}

function isPrime(number) {
	var range = Math.round(Math.sqrt(number)) + 1;
	
	for (var i = 2; i < range; i++) {
		if (number % i == 0)
			return false;
	}

	return true
}

function isFibo(number) {
	var phi = 0.5 + 0.5 * Math.sqrt(5.0)
    var a = phi * number;
    return number == 0 || Math.abs(Math.round(a) - a) < 1.0 / number;
}


/*var imageLoader = document.getElementById('imageLoader');
    imageLoader.addEventListener('change', handleImage, false);
var canvas = document.getElementById('imageCanvas');
var ctx = canvas.getContext('2d');


function handleImage(e){
    var reader = new FileReader();
    reader.onload = function(event){
        var img = new Image();
        img.onload = function(){
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img,0,0);
        }
        img.src = event.target.result;
    }
    reader.readAsDataURL(e.target.files[0]);     
}*/