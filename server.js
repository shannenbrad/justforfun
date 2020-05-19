const express = require('express')
const app = express()
const port = process.env.PORT || 8080;
const pgp = require('pg-promise')();
const formidable = require('formidable');
const fs = require('fs');

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
    password: 'postgres',
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

app.post('/monthlysubscription-submit', (req, res) => {
  req.body.bowSize = req.body.bowSize || "";
  req.body.bowType = req.body.bowType || "";

  console.log(req.body);
  //phonenumber, 
  const sql = "insert into monthlysubscription values (DEFAULT, ${fullName}, ${email}, ${phoneNumber}, ${street}, ${city}, ${state}, ${zipcode}, ${products}, ${bowType}, ${bowSize}, ${additionalComments}, 'NEW');"
  db.none(sql, req.body)
    .then(async () => {
      await notifyManagerOfInvoiceShipped(req.body.fullName, req.body.type1, req.body.type2);
      res.redirect('./subscriptionsubmitted.html')
    })
    .catch(err => console.log(err));
})

app.get('/get-orders', (req, res) => {
  const sql = "select * from orders";
  db.any(sql)
    .then((data) => res.send(data));
  // res.end();
})

app.get('/get-subscriptions', (req, res) => {
  const sql = "select * from monthlysubscription";
  db.any(sql)
    .then((data) => res.send(data));
  // res.end();
})

app.post('/complete-order', (req, res) => {
  console.log('completing')
  console.log(req.body);
  const sql = "update orders set status = 'COMPLETE' where order_id = ${orderId}";
  db.any(sql, req.body)
    .then(() => res.status(200).end())
    .catch((err) => console.log(err))
})

app.post('/image-submit', (req, res) => {
  console.log('hello moto');
  const form = formidable({ multiples: true });
  console.log(form);
  form.parse(req, (err, fields, files) => {
      console.log('in parse');
      if (err) {
          console.log(err);
          res.status(500).end();
          return;
      }

      console.log('hello', files.data.path);
      fs.readFile(files.data.path, (err, data) => {
          if (err) res.status(500).end();
          console.log('running query', fields);
          const sql = 'insert into images values (DEFAULT, ${description}, ${data})';
          db.none(sql, { description: fields.description, data: data })
              .then(async () => {
                  res.status(200).end();
              })
              .catch(err => console.log(err));
      })
  });
})

app.get('/get-images', (req, res) => {
  const sql = "select image_id, description from images where active";
  db.any(sql)
  .then((data) => {
      res.contentType('image/jpeg');
      res.end(data[0].data);
      
  })
})

app.get('/get-image/:image_id', (req, res) => {
  console.log(req.params);
  const sql = "select data from images where image_id = ${image_id}";
  db.oneOrNone(sql, req.params)
  .then((data) => {
      res.contentType('image/jpeg');
      res.end(data[0].data);
      
  })
})

app.get('/get-images')

app.post('/complete-subscription', (req, res) => {
  console.log('completing')
  console.log(req.body);
  const sql = "update monthlysubscription set status = 'COMPLETE' where monthly_id = ${monthly_id}";
  db.any(sql, req.body)
    .then(() => res.status(200).end())
    .catch((err) => console.log(err))
})

app.post('/newmonth-subscription', (req, res) => {
  console.log('')
  console.log(req.body);
  const sql = "update monthlysubscription set status = 'NEW' where monthly_id = ${monthly_id}";
  db.any(sql, req.body)
    .then(() => res.status(200).end())
    .catch((err) => console.log(err))
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


  // transporter.sendMail(mailOptions, function (error, info) {
  //   if (error) {
  //     console.log(error);
  //   } else {
  //     console.log('Email sent: ' + info.response);
  //   }
  // });
}