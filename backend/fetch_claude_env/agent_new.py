import requests
import os

api_key = os.environ.get("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")
url = "https://api.groq.com/openai/v1/models"

headers = {
    "Authorization": f"Bearer {api_key}",
    "Content-Type": "application/json"
}

response = requests.get(url, headers=headers)

print(response.json())