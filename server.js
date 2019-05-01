const express = require('express')
const app = express()

const instafans = require("./services/instafans.js")
const responseConverter = require("./services/responseConverter.js")

// allow CORS for everything
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// root endpoint gives info
app.get('/', function (req, res) {
  res.send("<h2>instafans</h2><p>Whaddup ✌️ Head over to /instafans=?[put instagram handle here] to get a user's post data.</p>")
})

// endpont for instafans data function calls, takes handle as query param
app.get('/posts', async function (req, res) {
  let handle = req.query.handle

  // copies instagram client requests for data
  let responses = await instafans.function(handle)

  // converts post data into usable JSON
  let posts = await responseConverter.function(responses)
  res.send(posts)
})

app.listen(process.env.PORT || 8000 , () => console.log(`instafans app listening on port 8000!`))
