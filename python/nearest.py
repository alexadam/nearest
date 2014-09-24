from __future__ import division
from PIL import Image
import math, time
import numpy

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
 
# def primesfrom2ton(n):
#     """ Input n>=6, Returns a array of primes, 2 <= p < n """
#     sieve = numpy.ones(n/3 + (n%6==2), dtype=numpy.bool)
#     print sieve
#     for i in xrange(1,int(n**0.5)/3+1):
#         if sieve[i]:
#             print sieve
#             k=3*i+1|1
#             sieve[       k*k/3     ::2*k] = False
#             sieve[k*(k-2*(i&1)+4)/3::2*k] = False
# 
#     return numpy.r_[2,3,((3*numpy.nonzero(sieve)[0][1:]+1)|1)]

if __name__ == '__main__':
    nimg('monalisa.png', True)
