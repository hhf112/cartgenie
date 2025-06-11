import puppeteer from 'puppeteer'
import { supabase } from "../db.js"
import { spawn } from 'child_process';
import "dotenv/config"


async function getEmbeddingFromUrl(imageUrl) {
  // return new Promise((resolve, reject) => {
  //   const pythonProcess = spawn('python3', ['main.py', imageUrl]);
  //
  //   let output = '';
  //
  //   pythonProcess.stdout.on('data', (data) => {
  //     output += data.toString();
  //   });
  //
  //   pythonProcess.on('close', (code) => {
  //     if (code !== 0) {
  //       reject(new Error(`Python exited with code ${code}`));
  //     } else {
  //       try {
  //         const embedding = JSON.parse(output);
  //         resolve(embedding);
  //       } catch (err) {
  //         reject(new Error(`Failed to parse JSON: ${err.message}`));
  //       }
  //     }
  //   });
  // });
  //
  try {
    const resp = await fetch(`${process.env.NGROK_URL}/upload`, {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify({
        "url": imageUrl
      })
    })

    const embedding = await resp.json();
    return embedding

  } catch (error) {
    console.log(error);
  }
}

await (async () => {
  try {
    const browser = await puppeteer.launch({
      headless: true,
    });
    const page = await browser.newPage();


    await page.goto("https://www.amazon.in/s?k=womens+graphic+tshirts&crid=3UOPGCWZ3QV3H&sprefix=womens+graphic+tshirts%2Caps%2C298&ref=nb_sb_noss_2");

    const title = await page.title();
    console.log(title)

    const products = await page.evaluate(() => {
      var results = []
      const productElements = document.querySelectorAll(".a-link-normal.s-no-outline");

      for (item of  productElements) {
        const image = item.querySelector("img.s-image")

        if (image) {
          results = [...results, {
            alt: image.alt,
            product: item.href,
            imageUrl: image.src
          }]
        }
      }
      
      return results;
    });

    if (products.length) {
      var count = 1;
      for (let item of products) {
        console.log(`item ${count}`)
        console.log(item.imageUrl)
        count += 1;
        var embedding;
        await getEmbeddingFromUrl(item.imageUrl)
          .then((embeds) => {
            embedding = embeds
          })
          .catch(console.error);

        const { data, error } = await supabase
          .from("products")
          .insert([
            {
              caption: item.alt,
              product_url: item.product,
              url: item.imageUrl,
              embedding: embedding,
              label: "Womens graphic tshirts"
            },
          ])
          .select()

        if (error) {
          console.log("supabase error:", error);
        }
      }
    }

    console.log("closing ... ")
    await browser.close();
  } catch (err) {
    console.log("puppeteer failed: ", err);
  }

})();


