import pandas as pd
import json
import os

# Paths
csv_path = "./myntradataset/styles.csv"
images_path = "./myntradataset/images"

# Load CSV
df = pd.read_csv(csv_path, quotechar='"', on_bad_lines='warn')

# Select only required columns
df = df[['id', 'productDisplayName', 'masterCategory']]

# Convert rows into JSON format
data = []
for _, row in df.iterrows():
    image_file = os.path.join(images_path, f"{row['id']}.jpg")
    data.append({
        "id": int(row['id']),
        "title": row['productDisplayName'],
        "category": row['masterCategory'],
        "image_url": image_file  # Later replace with Firebase URL if needed
    })

# Save as JSON
with open("myntra_dataset.json", "w", encoding="utf-8") as f:
    json.dump(data, f, indent=4)

print("✅ myntra_dataset.json created successfully!")
