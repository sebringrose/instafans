// Instagram post info scraper tool
const puppeteer = require('puppeteer')
const fetch = require('node-fetch')

module.exports = {
    function: async function (handle) {
      var responses = []

      // start puppeteer headless browser
      const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']})
      const page = await browser.newPage()
      await page.setViewport({ width: 800, height: 600, deviceScaleFactor: 2 })

      // tell browser to store requests
      page.on('request', async (request) => {
        if (await request._resourceType.match('xhr')) {
          // remake requests and store response data
          try {
            let response = await fetch(request._url, { headers: request._headers })
            let json = await response.json()
            responses.push(json)
          } catch(error) {
            //console.log(error)
          }
        }
      })

      // tell browser to GET instagram user page
      const response = await page.goto('https://instagram.com/' + handle)
      // get raw html
      const html = await response.text()

      // autoscroll system
      await page.evaluate( async() => {
        await new Promise((resolve, reject) => {
          // to get to posts
          window.scrollBy(0, 375);

          let totalHeight = 375;
          let distance = 500;

          var timer = setInterval(() => {
            let scrollHeight = document.body.scrollHeight;
            window.scrollBy(0, distance);
            totalHeight += distance;

            // changed to get two requests for now
            // if (totalHeight >= scrollHeight) {
            //     clearInterval(timer);
            //     resolve();
            // }

            if (totalHeight > 1500) {
                clearInterval(timer);
                resolve();
            }

          }, 200);
        })
      })
      await page.screenshot({path: 'ig-bottom-screenshot.png'});
      await browser.close()

      return responses
    }
}
