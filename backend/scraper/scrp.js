import puppeteer from 'puppeteer'
import { supabase } from "../db.js"
import { spawn } from 'child_process';

const [_, filename, url, cssSelector, num] = process.argv;


function getEmbedding(imageUrl) {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('python', ['main.py', imageUrl]);

    let output = '';
    let errorOutput = '';

    pythonProcess.stdout.on('data', (data) => {
      output += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Python exited with code ${code}: ${errorOutput}`));
      } else {
        try {
          const embedding = JSON.parse(output);
          resolve(embedding);
        } catch (err) {
          reject(new Error(`Failed to parse JSON: ${err.message}`));
        }
      }
    });
  });
}

var images;
await (async () => {
  try {
    const browser = await puppeteer.launch({
      headless: true,
    });
    const page = await browser.newPage();


    await page.goto(`${url}`);

    const title = await page.title();
    console.log(title)


    images = await page.$$eval(cssSelector, found => found.map(img => {
      return {
        alt: img.alt,
        src: img.src
      }
    }))

    if (images) {
      for (let img of images) {
        console.log("image found.")
        var embedding;
        await getEmbedding(img.src)
          .then((embeds) => {
            embedding = embeds
          })
          .catch(console.error);

        const { data, error } = await supabase
          .from('image_uploads')
          .insert([
            {
              caption: img.alt,
              url: img.src,
              embedding: embedding
            },
          ])
          .select()

        if (error) {
          console.log("supabase error:", error);
        }
      }
    }

    await browser.close();
  } catch (err) {
    console.log("puppeteer failed: ", err);
  }

})();


