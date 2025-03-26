import pandas as pd
import random
import numpy as np

# Load the existing dataset
file_path = "tops.csv"  # Update this path if needed
tops_df = pd.read_csv(file_path)

# Ensure item_id exists; if not, create it
if "item_id" in tops_df.columns:
    start_id = tops_df["item_id"].max() + 1  # Start from the next highest ID
else:
    start_id = 1  # Default to 1 if column is missing

# Define possible values
types = ["tshirt", "jacket", "tank"]
colors = ["black", "white", "grey", "brown", "beige", "red", "pink", "blue", "green", "yellow", "ivory", "orange"]
fits = ["athletic", "regular", "loose", "classic", "slim", "modern"]
sex_options = ["male", "female", "unisex"]
brands = ["Nike", "Adidas", "Brooks", "Asics", "New Balance", "Saucony", "Under Armour", "Hoka", "Patagonia", "Salomon"]

# Generate a price based on type
def generate_price(top_type):
    if top_type in ["tshirt", "tank"]:
        return round(np.random.normal(loc=45, scale=10), 2)  # Avg price ~45, range 20-70
    elif top_type == "jacket":
        return round(np.random.normal(loc=75, scale=20), 2)  # Avg price ~75, range 30-120

# Generate 100 new rows
new_rows = []
for i in range(100):
    top_type = random.choice(types)
    new_row = {
        "item_id": start_id + i,  # Increment item_id properly for each new row
        "type": top_type,
        "color": random.choice(colors),
        "fit": random.choice(fits),
        "sex": random.choice(sex_options),
        "brand": random.choice(brands),  # ✅ Added brand column
        "price": min(max(generate_price(top_type), 20 if top_type != "jacket" else 30), 70 if top_type != "jacket" else 120),
    }
    # Assign random True/False values for other columns (excluding known fields)
    for col in tops_df.columns:
        if col not in new_row:  # Ensures we only update additional fields
            new_row[col] = random.choice([True, False])
    
    new_rows.append(new_row)

# Create DataFrame and ensure columns align
new_tops_df = pd.DataFrame(new_rows)

# Append new rows to the original dataset
updated_tops_df = pd.concat([tops_df, new_tops_df], ignore_index=True)

# Save the updated file
updated_tops_df.to_csv("tops_updated.csv", index=False)

print("100 new rows added with brand column and correct item_id sequencing, saved to tops_updated.csv!")
