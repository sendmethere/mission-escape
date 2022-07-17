from PIL import Image
import os

img = Image.open("./src/tiles.png")
img_no = 0

for i in range (0, 30):
    for j in range (0, 16):
        box = (j*32, i*32, j*32+32, i*32+32)
        crop = img.crop(box)
        crop.save(f"{os.getcwd()}/src/tiles/{img_no}.png")
        img_no += 1


        