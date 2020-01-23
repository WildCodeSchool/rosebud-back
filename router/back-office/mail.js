const nodemailer = require("nodemailer");
const express = require('express');
const fs = require('fs')
const router = express.Router();

  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }
  });

  const readStream = fs.createReadStream(index.html);

  router.post('/', async (req,res) => {
    const { to } = req.body;
     await transporter.sendMail({
        from: "me",
        to: to,
        subject: "merci pour votre participation",
        html: readStream 
      },
      (error, info) => {
          if(error) {console.log(error);
            res.send('send')}
         }
      ); 
  })

  module.exports = router;