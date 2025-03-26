import pandas as pd
import random
import numpy as np

# Load the existing dataset
file_path = "shoes.csv"  # Update if needed
shoes_df = pd.read_csv(file_path)

# Ensure item_id exists; if not, create it
if "item_id" in shoes_df.columns:
    start_id = shoes_df["item_id"].max() + 1  # Start from the next highest ID
else:
    start_id = 1  # Default to 1 if missing

# Define possible values
colors = ["black", "white", "grey", "brown", "beige", "red", "pink", "blue", "green", "yellow", "ivory", "orange"]
cushioning_options = ["minimal", "moderate", "max"]
stability_options = ["stability", "neutral"]
midsole_drop_options = ["neutral", "max", "minimal"]
brands = ["Nike", "Adidas", "Brooks", "Asics", "Hoka", "New Balance", "Saucony", "Altra", "Mizuno"]
sex_options = ["male", "female"]  # ✅ Renamed gender to sex

# Price generation function (ensures prices stay within $100-$160 range)
def generate_price():
    return min(max(round(np.random.normal(loc=120, scale=15), 2), 100), 160)

# Generate 100 new rows
new_rows = []
for i in range(100):
    new_row = {
        "item_id": start_id + i,  # Increment item_id
        "color": random.choice(colors),
        "price": generate_price(),
        "cushioning": random.choice(cushioning_options),
        "stability": random.choice(stability_options),
        "midsole_drop": random.choice(midsole_drop_options),
        "brand": random.choice(brands),
        "sex": random.choice(sex_options),  # ✅ Renamed from gender to sex
    }
    
    # Assign random True/False values for other columns (excluding predefined ones)
    for col in shoes_df.columns:
        if col not in new_row and col != "item_id":  # Ensure required columns stay correct
            new_row[col] = random.choice([True, False])
    
    new_rows.append(new_row)

# Create DataFrame and ensure columns align
new_shoes_df = pd.DataFrame(new_rows)

# Append new rows to the original dataset
updated_shoes_df = pd.concat([shoes_df, new_shoes_df], ignore_index=True)

# Save the updated file
updated_shoes_df.to_csv("shoes_updated.csv", index=False)

print("100 new rows added with sex column and correct item_id sequencing, saved to shoes_updated.csv!")
