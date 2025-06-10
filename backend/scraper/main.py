import sys
import json
import requests
from io import BytesIO
from sentence_transformers import SentenceTransformer
from PIL import Image
from transformers import logging

logging.set_verbosity_error()

model = SentenceTransformer('clip-ViT-B-32')

def get_image_embedding_from_url(url):
    response = requests.get(url)
    response.raise_for_status()
    image = Image.open(BytesIO(response.content)).convert("RGB")
    embedding = model.encode(image)
    return embedding.tolist()

if __name__ == "__main__":
    url = sys.argv[1]
    embedding = get_image_embedding_from_url(url)
    print(json.dumps(embedding))
