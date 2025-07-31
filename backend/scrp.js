import puppeteer from 'puppeteer'
import { supabase } from "./db.js"
import { spawn } from 'child_process';
import "dotenv/config"


async function getEmbeddingFromUrl(imageUrl) {
  try {
    const resp = await fetch(`${process.env.EMBEDADDR}/embed`, {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify({
        "url": imageUrl
      })
    })

    const embedding = await resp.json();
    console.log(embedding);
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


    await page.goto("https://www.amazon.in/s?k=men%27s+graphic&crid=20RPREX6VNY0R&sprefix=men%27s+grap%2Caps%2C390&ref=nb_sb_noss_2");

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


