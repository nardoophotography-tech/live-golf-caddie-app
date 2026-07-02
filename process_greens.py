import cv2
import numpy as np
import os

src_dir = r"C:\Users\nardo\OneDrive\Desktop\golf\golfgreen"
out_dir = r"C:\Users\nardo\OneDrive\Desktop\golf\live-golf-caddie-app-mount-isa\live-golf-caddie-app\public\course-maps\mount-isa"

os.makedirs(out_dir, exist_ok=True)

files = [
    "1000030505", "1000030506", "1000030507", "1000030508", "1000030509",
    "1000030510", "1000030511", "1000030512", "1000030513", "1000030514",
    "1000030515", "1000030516", "1000030517", "1000030518", "1000030519",
    "1000030520", "1000030521"
]

for idx, f in enumerate(files):
    hole_num = idx + 1
    in_path = os.path.join(src_dir, f)
    if not os.path.exists(in_path) and os.path.exists(in_path + ".jpg"):
        in_path += ".jpg"
    elif not os.path.exists(in_path) and os.path.exists(in_path + ".png"):
        in_path += ".png"
    
    img = cv2.imread(in_path)
    if img is None:
        continue
        
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    
    # 1. Detect the colored green/heatmap object
    # Ignore black background and grey/white UI
    mask = cv2.inRange(hsv, np.array([0, 30, 30]), np.array([180, 255, 255]))
    
    # 2. Fill small holes (contour lines, text inside the green)
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (19,19))
    filled_mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel)
    
    # 3. Extract ONLY the largest connected component (the green itself)
    # This guarantees NO top buttons, NO magnification slider, NO legends are included!
    num_labels, labels, stats, centroids = cv2.connectedComponentsWithStats(filled_mask, connectivity=8)
    if num_labels <= 1:
        continue
        
    largest_label = 1 + np.argmax(stats[1:, cv2.CC_STAT_AREA])
    clean_mask = np.where(labels == largest_label, 255, 0).astype(np.uint8)
    
    # Smooth the edges of the mask slightly
    clean_mask = cv2.GaussianBlur(clean_mask, (3,3), 0)
    
    # 4. Crop tightly around the colored green only
    x, y, w, h = cv2.boundingRect(clean_mask)
    
    pad = 5
    x = max(0, x - pad)
    y = max(0, y - pad)
    x_end = min(img.shape[1], x + w + 2 * pad)
    y_end = min(img.shape[0], y + h + 2 * pad)
    
    # 5. Make background transparent
    bgra = cv2.cvtColor(img, cv2.COLOR_BGR2BGRA)
    bgra[:, :, 3] = clean_mask
    
    cropped = bgra[y:y_end, x:x_end]
    
    out_path = os.path.join(out_dir, f"hole-{hole_num}.png")
    cv2.imwrite(out_path, cropped)
    print(f"Saved hole {hole_num}")

print("Done")
