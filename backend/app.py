# !pip install flask  sentence-transformers pillow supabase
from flask import Flask, request, jsonify
from sentence_transformers import SentenceTransformer
from PIL import Image
import numpy as np
import os
from supabase import create_client

from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_KEY")
supabase = create_client(url, key)

model = SentenceTransformer('clip-ViT-B-32')

app = Flask(__name__)
def real_ip():
    return request.headers.get("X-Forwarded-For", request.remote_addr)

limiter = Limiter(
    key_func=real_ip,
    app=app,
    default_limits=["2 per hour"],
    storage_uri="memory://"
)


@app.route("/", methods = ["GET"])
@limiter.exempt
def test():
    return jsonify({"status": "working"}), 200


@app.route("/upload", methods = ["POST"])
def upload():
  request_embeddings = []

  if "images" in request.files and "text" in request.form:
      img_embeds = []
      for img in request.files.getlist("images"):
          img_embeds.append(model.encode(Image.open(img)))

      img_embeds = np.mean(np.array(img_embeds), axis = 0)
      text_embeds = model.encode(request.form["text"])
      request_embeddings = (0.7 * img_embeds + 0.3 * text_embeds).tolist()

  elif "images" in request.files:
      for img in request.files.getlist("images"):
          request_embeddings.append(model.encode(Image.open(img)))
      request_embeddings = np.mean(np.array(request_embeddings), axis = 0).tolist()

  elif "text" in request.form:
      request_embeddings = model.encode(request.form["text"]).tolist()

  else: return jsonify({"error": "no article attached to embed"}), 400

  response = supabase.rpc("get_products", {"embeds": request_embeddings}) .execute()
  return jsonify({"rows": response.data}), 200

if __name__ == "__main__":
  app.run(host='0.0.0.0' , port=7860, debug = True)
