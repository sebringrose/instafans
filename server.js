const express = require('express')
const app = express()

const instafans = require("./instafans.js")

// allow CORS for everything
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// one endpont for instafans file
app.get('/instafans', async function (req, res) {
  let handle = req.query.handle
  let responses = await instafans.function(handle)
  res.send(responses)
})

app.listen(process.env.PORT || 8000 , () => console.log(`instafans app listening on port 8000!`))
