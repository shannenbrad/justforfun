const express = require('express')
const app = express()
const port = 8080



app.use(express.static('.'))
app.use(express.urlencoded())

app.post('/order-submit', (req, res) => {
    console.log(req.body);

    // res.status(200).end()
    res.redirect('./index.html');
})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))