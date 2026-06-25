import os

from PIL import Image

image_dir = r"c:\Users\trq\Desktop\vaload_web\house2\images\maps"
for f in os.listdir(image_dir):
    if f.endswith(".webp"):
        img = Image.open(os.path.join(image_dir, f))
        print(f"{f}: {img.size}")
