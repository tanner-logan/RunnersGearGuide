import pandas as pd
import random
import numpy as np

# Load the existing dataset
file_path = "hats.csv"  # Update this path if needed
hats_df = pd.read_csv(file_path)

# Ensure item_id exists; if not, create it
if "item_id" in hats_df.columns:
    start_id = hats_df["item_id"].max() + 1  # Start from the next highest ID
else:
    start_id = 1  # Default to 1 if column is missing

# Define possible values
colors = ["black", "white", "grey", "brown", "beige", "red", "pink", "blue", "green", "yellow", "ivory", "orange"]
brands = ["Nike", "Adidas", "Brooks", "Asics", "New Balance", "Saucony", "Under Armour", "Hoka", "Patagonia", "Salomon"]

# Generate a price within the required range (20-60) with an average around 32
def generate_price():
    return min(max(round(np.random.normal(loc=32, scale=10), 2), 20), 60)

# Generate 100 new rows
new_rows = []
for i in range(100):
    new_row = {
        "item_id": start_id + i,  # Increment item_id for each new row
        "color": random.choice(colors),
        "brand": random.choice(brands),  # ✅ Added brand column
        "price": generate_price(),
    }
    # Assign random True/False values for other columns (excluding known fields)
    for col in hats_df.columns:
        if col not in new_row:  # Ensures we only update additional fields
            new_row[col] = random.choice([True, False])
    
    new_rows.append(new_row)

# Create DataFrame and ensure columns align
new_hats_df = pd.DataFrame(new_rows)

# Append new rows to the original dataset
updated_hats_df = pd.concat([hats_df, new_hats_df], ignore_index=True)

# Save the updated file
updated_hats_df.to_csv("hats_updated.csv", index=False)

print("100 new rows added with brand column and correct item_id sequencing, saved to hats_updated.csv!")
