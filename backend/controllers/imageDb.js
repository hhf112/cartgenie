import { response } from 'express';
import cloudinary from '../cloudinary.js';
import { supabase } from "../db.js"

export const imageUpload = async (req, res) => {
  try {
    const fileBuffer = req.file.buffer;

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'imagePrompts' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      uploadStream.end(fileBuffer);
    });



    if (result) {
      const { data, error } = await supabase
        .from('image_uploads')
        .insert([
          {
            id: result.public_id,
            url: result.url,
          },
        ])
        .select()

      if (error) console.log("cloudinary error:", error);
      else console.log(data);

      res.status(200).json({ key: result.public_id });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || err });
  }
};

export const deleteImage = async (req, res) => {
  try {
    const resp = await cloudinary.uploader.destroy(req.body.key, {});
    if (resp.result !== 'ok') {
      res.status(500).send('failed to delete image');
    } else {
      res.status(200).send('successfully deleted image');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('failed to delete image');
  }
};

// Sample response from website 
// {
//   "asset_id": "3515c6000a548515f1134043f9785c2f",
//   "public_id": "gotjephlnz2jgiu20zni",
//   "version": 1719307544,
//   "version_id": "7d2cc533bee9ff39f7da7414b61fce7e",
//   "signature": "d0b1009e3271a942836c25756ce3e04d205bf754",
//   "width": 1920,
//   "height": 1441,
//   "format": "jpg",
//   "resource_type": "image",
//   "created_at": "2024-06-25T09:25:44Z",
//   "tags": [],
//   "pages": 1,
//   "bytes": 896838,
//   "type": "upload",
//   "etag": "2a2df1d2d2c3b675521e866599273083",
//   "placeholder": false,
//   "url": "http://res.cloudinary.com/cld-docs/image/upload/v1719307544/gotjephlnz2jgiu20zni.jpg",
//   "secure_url": "https://res.cloudinary.com/cld-docs/image/upload/v1719307544/gotjephlnz2jgiu20zni.jpg",
//   "asset_folder": "",
//   "display_name": "gotjephlnz2jgiu20zni",
//   "image_metadata": {
//     "JFIFVersion": "1.01",
//     "ResolutionUnit": "None",
//     "XResolution": "1",
//     "YResolution": "1",
//     "Colorspace": "RGB",
//     "DPI": "0"
//   },
//   "illustration_score": 0.0,
//   "semi_transparent": false,
//   "grayscale": false,
//   "original_filename": "sample",
//   "eager": [
//     {
//       "transformation": "c_pad,h_300,w_400",
//       "width": 400,
//       "height": 300,
//       "bytes": 26775,
//       "format": "jpg",
//       "url": "http://res.cloudinary.com/cld-docs/image/upload/c_pad,h_300,w_400/v1719307544/gotjephlnz2jgiu20zni.jpg",
//       "secure_url": "https://res.cloudinary.com/cld-docs/image/upload/c_pad,h_300,w_400/v1719307544/gotjephlnz2jgiu20zni.jpg"
//     },
//     {
//       "transformation": "c_crop,g_north,h_200,w_260",
//       "width": 260,
//       "height": 200,
//       "bytes": 8890,
//       "format": "jpg",
//       "url": "http://res.cloudinary.com/cld-docs/image/upload/c_crop,g_north,h_200,w_260/v1719307544/gotjephlnz2jgiu20zni.jpg",
//       "secure_url": "https://res.cloudinary.com/cld-docs/image/upload/c_crop,g_north,h_200,w_260/v1719307544/gotjephlnz2jgiu20zni.jpg"
//     }
//   ],
//   "api_key": "614335564976464"
// }
