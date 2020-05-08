const express = require('express')
const app = express()
const port = process.env.PORT || 8080;
const pgp = require('pg-promise')();

const nodemailer = require('nodemailer');

console.log(process.env.PORT);


app.use(express.static('littleMiss'))
app.use(express.urlencoded())


console.log('env', process.env.NODE_ENV);
let con = {};
if (process.env.NODE_ENV === 'production') {
  con = {
    user: 'acmaoxibesxusb',
    host: 'ec2-3-223-21-106.compute-1.amazonaws.com',
    database: 'd1tqvtnl8kpq0',
    password: 'e2a8df31329bfb12938c29029e5413ef7e75a4bb6833aa87c0a659262be8b528',
    port: 5432,
    ssl: { rejectUnauthorized: false }
  }
}
else {
  con = {
    user: 'postgres',
    host: 'localhost',
    database: 'lilmiss',
    port: 5432
  }
}


const db = pgp(con);

app.post('/order-submit', (req, res) => {
  req.body.type1qty = +req.body.type1qty;
  req.body.type2qty = +req.body.type2qty;

  req.body.bowSize = req.body.bowSize || "";
  req.body.bowType = req.body.bowType || "";

  req.body.topknotSize = req.body.topknotSize || "";
  req.body.topknotPrint = req.body.topknotPrint || "";

  

  console.log(req.body);
  const sql = "insert into orders values (DEFAULT, ${fullName}, ${email}, ${phoneNumber}, ${street}, ${city}, ${state}, ${zipcode}, ${type1qty}, ${type2qty},${bowPrint}, ${bowSize}, ${bowType}, ${topknotPrint},${topknotSize},${additionalComments}, 'NEW');"
  db.none(sql, req.body)
    .then(async () => {
      await notifyManagerOfInvoiceShipped(req.body.fullName, req.body.type1qty, req.body.type2qty);
      res.redirect('./thanks.html')
    })
    .catch(err => console.log(err));
})

app.get('/get-orders', (req, res) => {
  console.log(req);
  const sql = "select * from orders where status != 'COMPLETE'";
  db.any(sql)
    .then((data) => res.send(data));
  // res.end();
})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))

async function notifyManagerOfInvoiceShipped(fullName, type1qty, type2qty) {
  console.log('shipping this invoice', fullName, type1qty, type2qty);
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'littlemissnotifications',
      pass: 'littlemissnotifications20'
    },
    tls: {
      rejectUnauthorized: false
    }
  });




  var mailOptions = {
    from: 'littlemissnotifications@gmail.com',
    to: 'mdykstra06@gmail.com',
    subject: 'A customer has placed a new order!',
    text: `A new order has been placed by ${fullName} for ${type1qty} topknots and ${type2qty} bows.`
  };


  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}