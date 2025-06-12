import { supabase } from "../db.js"
import { pg } from '../db.js';
import "dotenv/config.js"

export const search = async (req, res) => {
  const data = new FormData();
  if (req.file) data.append("images", req.file);
  if (req.files) {
    for (const img of req.files) {
      data.append("images", img);
    }
  }
  if (req.body.text) data.append("text", req.body.text);

  let embedding;
  try {
    const resp = await fetch(`${process.env.HUGGINGFACE_URL}/upload`, {
      method: "POST",
      body: data
    })

    embedding = await resp.json()
  } catch (err) {
    res.status(500).json({
      "huggingFace": err,
      "error": "failed to generate embeddings"
    })
  }

  try {
    let product = await pg.query(`SELECT category FROM labels ORDER BY embedding <-> '[${embedding}]' LIMIT 1;`);
    product = product.rows[0].category;

    let category = await pg.query(`SELECT category FROM ${product} ORDER BY embedding <-> '[${embedding}]' LIMIT 1;`)
    category = category.rows[0].category;

    const result = await pg.query(`SELECT url, caption, product_url FROM products WHERE label = ${category} ORDER BY embedding <-> '[${embedding}]' LIMIT 5;`);
    res.status(200).json(result)
    console.log("request served")
  } catch (error) {
    console.log(error);
    res.status(500).send("request failed")
  }
};


// Result {
//   command: 'SELECT',
//   rowCount: 5,
//   oid: null,
//   rows: [
//     {
//       url: 'https://m.media-amazon.com/images/I/71Kx6rgmlRS._AC_UL320_.jpg',
//       caption: "TIMEX Analog Men's Watch (Dial Colored Strap)",
//       product_url: 'https://www.amazon.in/TIMEX-Leather-Tw00Zr262E-Color-Brown-Color-Blue/dp/B07H3K85H5/ref=sr_1_4?crid=ZVRMA22KE64J&dib=eyJ2IjoiMSJ9.mwkrdjM0mINVfI
// k4cRriaZ0e3fEntB1VDBhu9FUZH3mraSKOtiCXR3w3qRJaNpzoQflNA435FJUoZQKxk8Aov_j9Tz3wXYj4S1tdXflPk2pwIVWkrKbSIM6Z6QNI9_EMJ5VvgSCIxoQ2Yune2DHPekMr_vzUYhtG71vsGE-tjTIg7OEq4t
// 4Etozvs9PiJvckK99dB9ZG_DACAAqiS1J9d9EpSFbw2G1dQQVXhW2HQWeKOJt98L_89dmtmJcqOpHAuV6v3Z6H7p4FAJDa1dw3HX-exNiq3TLHHUEVWI5roSY.ppY4wzzC8vtX_f6itg2obIR67Opd8AASWVFmHEc8KH
// o&dib_tag=se&keywords=analog+watches&qid=1749566823&sprefix=analog+watchews%2Caps%2C277&sr=8-4'
//     },
//     {
//       url: 'https://m.media-amazon.com/images/I/71wHE4lfLdL._AC_UL320_.jpg',
//       caption: "Titan Analog Men's Watch (Dial Colored Strap)",
//       product_url: 'https://www.amazon.in/Titan-Analog-Black-Dial-Watch-1766SL02/dp/B07DD4LBXF/ref=sr_1_1?crid=ZVRMA22KE64J&dib=eyJ2IjoiMSJ9.mwkrdjM0mINVfIk4cRriaZ0
// e3fEntB1VDBhu9FUZH3mraSKOtiCXR3w3qRJaNpzoQflNA435FJUoZQKxk8Aov_j9Tz3wXYj4S1tdXflPk2pwIVWkrKbSIM6Z6QNI9_EMJ5VvgSCIxoQ2Yune2DHPekMr_vzUYhtG71vsGE-tjTIg7OEq4t4Etozvs9P
// iJvckK99dB9ZG_DACAAqiS1J9d9EpSFbw2G1dQQVXhW2HQWeKOJt98L_89dmtmJcqOpHAuV6v3Z6H7p4FAJDa1dw3HX-exNiq3TLHHUEVWI5roSY.ppY4wzzC8vtX_f6itg2obIR67Opd8AASWVFmHEc8KHo&dib_tag
// =se&keywords=analog+watches&qid=1749566823&sprefix=analog+watchews%2Caps%2C277&sr=8-1'
//     },
//     {
//       url: 'https://m.media-amazon.com/images/I/81DEF+TfCTL._AC_UL320_.jpg',
//       caption: 'Fossil Decker Brown Watch',
//       product_url: 'https://www.amazon.in/Fossil-Chronograph-Silver-Dial-Watch-CH2882/dp/B00DUCIK7U/ref=sr_1_8?crid=ZVRMA22KE64J&dib=eyJ2IjoiMSJ9.mwkrdjM0mINVfIk4cR
// riaZ0e3fEntB1VDBhu9FUZH3mraSKOtiCXR3w3qRJaNpzoQflNA435FJUoZQKxk8Aov_j9Tz3wXYj4S1tdXflPk2pwIVWkrKbSIM6Z6QNI9_EMJ5VvgSCIxoQ2Yune2DHPekMr_vzUYhtG71vsGE-tjTIg7OEq4t4Eto
// zvs9PiJvckK99dB9ZG_DACAAqiS1J9d9EpSFbw2G1dQQVXhW2HQWeKOJt98L_89dmtmJcqOpHAuV6v3Z6H7p4FAJDa1dw3HX-exNiq3TLHHUEVWI5roSY.ppY4wzzC8vtX_f6itg2obIR67Opd8AASWVFmHEc8KHo&di
// b_tag=se&keywords=analog+watches&qid=1749566823&sprefix=analog+watchews%2Caps%2C277&sr=8-8'
//     },
//     {
//       url: 'https://m.media-amazon.com/images/I/61V9NlP5unL._AC_UL320_.jpg',
//       caption: 'Matrix Minimalist Dual Colour Dial with Softest Silicone Strap Analog Wrist Watch for Men & Boys',
//       product_url: 'https://www.amazon.in/Matrix-Minimalist-Colour-Softest-Silicone/dp/B0F2FD5VCD/ref=sr_1_6?crid=ZVRMA22KE64J&dib=eyJ2IjoiMSJ9.mwkrdjM0mINVfIk4cRri
// aZ0e3fEntB1VDBhu9FUZH3mraSKOtiCXR3w3qRJaNpzoQflNA435FJUoZQKxk8Aov_j9Tz3wXYj4S1tdXflPk2pwIVWkrKbSIM6Z6QNI9_EMJ5VvgSCIxoQ2Yune2DHPekMr_vzUYhtG71vsGE-tjTIg7OEq4t4Etozv
// s9PiJvckK99dB9ZG_DACAAqiS1J9d9EpSFbw2G1dQQVXhW2HQWeKOJt98L_89dmtmJcqOpHAuV6v3Z6H7p4FAJDa1dw3HX-exNiq3TLHHUEVWI5roSY.ppY4wzzC8vtX_f6itg2obIR67Opd8AASWVFmHEc8KHo&dib_
// tag=se&keywords=analog+watches&qid=1749566823&sprefix=analog+watchews%2Caps%2C277&sr=8-6'
//     },
//     {
//       url: 'https://m.media-amazon.com/images/I/711NXCmUfbL._AC_UL320_.jpg',
//       caption: 'Matrix Antique 2.0 Day & Date Softest Silicone Strap Analog Watch for Men & Boys',
//       product_url: 'https://www.amazon.in/Matrix-Antique-Softest-Silicone-Analog/dp/B0CK6N9VDC/ref=sr_1_7?crid=ZVRMA22KE64J&dib=eyJ2IjoiMSJ9.mwkrdjM0mINVfIk4cRriaZ0
// e3fEntB1VDBhu9FUZH3mraSKOtiCXR3w3qRJaNpzoQflNA435FJUoZQKxk8Aov_j9Tz3wXYj4S1tdXflPk2pwIVWkrKbSIM6Z6QNI9_EMJ5VvgSCIxoQ2Yune2DHPekMr_vzUYhtG71vsGE-tjTIg7OEq4t4Etozvs9P
// iJvckK99dB9ZG_DACAAqiS1J9d9EpSFbw2G1dQQVXhW2HQWeKOJt98L_89dmtmJcqOpHAuV6v3Z6H7p4FAJDa1dw3HX-exNiq3TLHHUEVWI5roSY.ppY4wzzC8vtX_f6itg2obIR67Opd8AASWVFmHEc8KHo&dib_tag
// =se&keywords=analog+watches&qid=1749566823&sprefix=analog+watchews%2Caps%2C277&sr=8-7'
//     }
//   ],
//   fields: [
//     Field {
//       name: 'url',
//       tableID: 22553,
//       columnID: 2,
//       dataTypeID: 25,
//       dataTypeSize: -1,
//       dataTypeModifier: -1,
//       format: 'text'
//     },
//     Field {
//       name: 'caption',
//       tableID: 22553,
//       columnID: 3,
//       dataTypeID: 25,
//       dataTypeSize: -1,
//       dataTypeModifier: -1,
//       format: 'text'
//     },
//     Field {
//       name: 'product_url',
//       tableID: 22553,
//       columnID: 6,
//       dataTypeID: 25,
//       dataTypeSize: -1,
//       dataTypeModifier: -1,
//       format: 'text'
//     }
//   ],
//   _parsers: [ [Function: noParse], [Function: noParse], [Function: noParse] ],
//   _types: TypeOverrides {
//     _types: {
//       getTypeParser: [Function: getTypeParser],
//       setTypeParser: [Function: setTypeParser],
//       arrayParser: [Object],
//       builtins: [Object]
//     },
//     text: {},
//     binary: {}
//   },
//   RowCtor: null,
//   rowAsArray: false,
//   _prebuiltEmptyResultObject: { url: null, caption: null, product_url: null }
// }
// ^C
// hrsh $(LAPTOP-HK58DTQE):/mnt/d/dev/cart-genie-0.1/backend$🌙 k
//
//
