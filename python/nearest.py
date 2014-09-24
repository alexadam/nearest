from __future__ import division
from PIL import Image
import math, time
import numpy as np
import struct
from scipy.io import wavfile
from fileinput import filename

def isPrime(number):
    for i in range(2, int(math.sqrt(number))+1):
        if number % i == 0:
            return False

    return True

def isFibonacci(number):
#     t1 = int(round(time.time() * 1000))
    n1 = 5 * math.pow(number, 2) + 4
    n2 = 5 * math.pow(number, 2) - 4
    
    n1_sqrt = int(math.sqrt(n1))
    if n2 < 0:
        n2 *= -1
    n2_sqrt = int(math.sqrt(n2))   
    return n1_sqrt * n1_sqrt == n1 or (n2_sqrt * n2_sqrt == n2)
    
def getNearest(nr, typeFunc = isPrime, dirUp = True):
    isneg = 1
    if nr < 0:
        isneg = -1
        nr *= isneg
        
    fractionalPart = nr - int(nr)
    nr = int(nr)
    
    accept = typeFunc(nr)
    
    while accept == False:
        if dirUp:
            nr += 1 * isneg
        else:
            nr -= 1 * isneg

        accept = typeFunc(nr)
        
    return nr * isneg + fractionalPart

def nimg(fileName, dirUp = True):
    im = Image.open(fileName)
    width, height = im.size
    
    newImage = Image.new('RGB', (width, height))
    newImagePixels = newImage.load()
    
    rgb_im = im.convert('RGB')
    
    rgbMode = True
    func = isPrime #isFibonacci
    
    for y in range(height):
        print y / height * 100, '%'
        for x in range(width):
            r, g, b = rgb_im.getpixel((x, y))
            
            if rgbMode:
                r = getNearest(r, func, dirUp)
                g = getNearest(g, func, dirUp)
                b = getNearest(b, func, dirUp)
                
                newImagePixels[x, y] = (r, g, b)
            else:
                p = r 
                p = (p << 8) + g
                p = (p << 16) + b
                
                p = getNearest(p, func, dirUp)
                
                b = p & 255
                g = (p >> 8) & 255
                r = (p >> 16) & 255
            
                newImagePixels[x, y] = (r, g, b)
                
    newImage.save(fileName + '_prime.png')
    
def genFromWavs(fileName, dirUp = True):
    
    rate1,dat1 = wavfile.read(fileName)
    
    output = dat1
    for i in range(len(dat1)):
        if i % 44000 == 0: print (i/44000)
        
        for k in range(2): 
            output[i][k] = getNearest(dat1[i][k], isPrime, dirUp)
    
    wavfile.write(fileName + "_out.wav", rate1, output)
    
    
def genFromBin(fileName, dirUp = True):
    f1 = open(fileName, 'rb')
    a = np.fromfile(f1, dtype=np.uint16)
    
    for i in range(1000, len(a)):
        print i
        a[i] = getNearest(a[i], isPrime, dirUp)
    
    a.tofile(fileName + "_out.wav")
    
if __name__ == '__main__':
    nimg('monalisa.png', True)
