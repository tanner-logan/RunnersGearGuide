import pandas as pd
import random
import numpy as np

# Load the existing dataset
file_path = "bottoms.csv"  # Update this path if needed
bottoms_df = pd.read_csv(file_path)

# Ensure item_id exists; if not, create it
if "item_id" in bottoms_df.columns:
    start_id = bottoms_df["item_id"].max() + 1  # Start from the next highest ID
else:
    start_id = 1  # Default to 1 if missing

# Define possible values
colors = ["black", "white", "grey", "brown", "beige", "red", "pink", "blue", "green", "yellow", "ivory", "orange"]
types = ["shorts", "pants", "tights"]
length_options = [3, 5, 7]  # Only for shorts
sex_options = ["male", "female"]  # Added sex column options
brands = ["Nike", "Adidas", "Brooks", "Asics", "New Balance", "Saucony", "Under Armour", "Hoka", "Patagonia", "Salomon"]  # ✅ Added brand column options

# Price generation function
def generate_price(item_type):
    if item_type == "shorts":
        return min(max(round(np.random.normal(loc=50, scale=10), 2), 20), 70)
    elif item_type == "pants":
        return min(max(round(np.random.normal(loc=70, scale=15), 2), 30), 120)
    elif item_type == "tights":
        return min(max(round(np.random.normal(loc=70, scale=12), 2), 40), 105)

# Generate 100 new rows
new_rows = []
for i in range(100):
    item_type = random.choice(types)
    
    new_row = {
        "item_id": start_id + i,  # Increment item_id
        "color": random.choice(colors),
        "type": item_type,
        "price": generate_price(item_type),
        "length": random.choice(length_options) if item_type == "shorts" else "NONE",
        "liner": random.choice([True, False]) if item_type == "shorts" else False,  # Liner is random but only for shorts
        "thermal": random.choice([True, False]) if item_type in ["pants", "tights"] else False,  # Thermal is random but only for pants/tights
        "sex": random.choice(sex_options),  # ✅ Added sex column
        "brand": random.choice(brands),  # ✅ Added brand column
    }
    
    # Assign random True/False values for other columns (excluding known fields)
    for col in bottoms_df.columns:
        if col not in new_row:  # Ensures we only update additional fields
            new_row[col] = random.choice([True, False])
    
    new_rows.append(new_row)

# Create DataFrame and ensure columns align
new_bottoms_df = pd.DataFrame(new_rows)

# Append new rows to the original dataset
updated_bottoms_df = pd.concat([bottoms_df, new_bottoms_df], ignore_index=True)

# Save the updated file
updated_bottoms_df.to_csv("bottoms_updated.csv", index=False)

print("100 new rows added with brand and sex columns, saved to bottoms_updated.csv!")
