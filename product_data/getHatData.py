import requests
from bs4 import BeautifulSoup
import csv
import time

# Function to map brand keywords to desired values
def map_brand(brand_text):
    brand_mapping = {
        "nike": ["nike"],
        "adidas": ["adidas", "Adidas"],
        "asics": ["asics", "Asics"],
        "brooks": ["brooks", "Brooks"],
        "hoka": ["hoka", "Hoka"],
        "new_balance": ["new balance"],
        "reebok": ["reebok", "Reebok"],
        "under_armour": ["under armour", "Under Armour"],
    }

    for mapped_brand, keywords in brand_mapping.items():
        if any(keyword in brand_text.lower() for keyword in keywords):
            return mapped_brand
    return "unknown"  # Default value if no match is found

# Function to fetch hat data from a URL
def fetch_hat_data(url):
    try:
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }
        response = requests.get(url, headers=headers)
        response.raise_for_status()  # Raise an error for bad status codes
        soup = BeautifulSoup(response.text, 'html.parser')

        # Extract the brand from the product title using #productTitle
        product_title_element = soup.select_one("#productTitle")  # Use CSS selector
        raw_brand = product_title_element.text.strip() if product_title_element else "N/A"
        print(f"Extracted brand text: {raw_brand}")  # Debugging: Print the extracted brand text
        mapped_brand = map_brand(raw_brand)

        # Extract other data
        hat_data = {
            "hatid": None,
            "brand": mapped_brand,
            "color": soup.find("span", {"id": "color"}).text.strip() if soup.find("span", {"id": "color"}) else "N/A",
            "gender": soup.find("span", {"id": "gender"}).text.strip() if soup.find("span", {"id": "gender"}) else "N/A",
            "weather": soup.find("span", {"id": "weather"}).text.strip() if soup.find("span", {"id": "weather"}) else "N/A",
            "distance": soup.find("span", {"id": "distance"}).text.strip() if soup.find("span", {"id": "distance"}) else "N/A",
            "price": soup.find("span", {"id": "price"}).text.strip() if soup.find("span", {"id": "price"}) else "N/A",
            "allergies": soup.find("span", {"id": "allergies"}).text.strip() if soup.find("span", {"id": "allergies"}) else "N/A",
            "ecofriendly": soup.find("span", {"id": "ecofriendly"}).text.strip() if soup.find("span", {"id": "ecofriendly"}) else "N/A",
            "designpreference": soup.find("span", {"id": "designpreference"}).text.strip() if soup.find("span", {"id": "designpreference"}) else "N/A",
            "hatfeatures": soup.find("span", {"id": "hatfeatures"}).text.strip() if soup.find("span", {"id": "hatfeatures"}) else "N/A",
            "preferencescore": soup.find("span", {"id": "preferencescore"}).text.strip() if soup.find("span", {"id": "preferencescore"}) else "N/A",
            "image": soup.find("img", {"id": "image"})["src"] if soup.find("img", {"id": "image"}) else "N/A",
            "link": url,
        }
        return hat_data
    except Exception as e:
        print(f"Error fetching data from {url}: {e}")
        return None

# Function to save hat data to a CSV file
def save_to_csv(hat_data_list, filename="newhats.csv"):
    # Define the CSV headers
    headers = [
        "hatid", "brand", "color", "gender", "weather", "distance", "price",
        "allergies", "ecofriendly", "designpreference", "hatfeatures",
        "preferencescore", "image", "link"
    ]

    # Write data to the CSV file
    with open(filename, mode="w", newline="", encoding="utf-8") as file:
        writer = csv.DictWriter(file, fieldnames=headers)
        writer.writeheader()
        writer.writerows(hat_data_list)

    print(f"Data saved to {filename}")

# Main function
def main():
    # Array of URLs to scrape
    urls = [
        "https://www.amazon.com/OutdoorEssentials-Running-Cap-Black/dp/B096WGSFV8",
        "https://www.amazon.com/New-Balance-Lightweight-5-Panel-Adjustable/dp/B0DKJPY55P",
        "https://www.amazon.com/Nike-Aerobill-Lightweight-Breathable-Comfort/dp/B07YR3J5HH",
        # Add more URLs as needed
    ]

    hat_data_list = []
    for i, url in enumerate(urls, start=1):
        print(f"Fetching data for URL {i}/{len(urls)}: {url}")
        hat_data = fetch_hat_data(url)
        if hat_data:
            hat_data["hatid"] = i  # Assign a unique ID to each hat
            hat_data_list.append(hat_data)
        time.sleep(2)  # Wait for 2 seconds between requests

    # Save the collected data to a CSV file
    save_to_csv(hat_data_list)

if __name__ == "__main__":
    main()