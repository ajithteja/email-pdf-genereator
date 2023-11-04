const express = require("express");
const nodemailer = require('nodemailer');
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { PDFDocument } = require('pdf-lib');
const Jimp = require('jimp');
const { sendMail } = require("./sendMail");
const app = express();
app.use(express.json());

// Function to create a PDF with a given name

async function createPdfWithImage(name) {
  const imageFilePath = path.join(__dirname, 'resources', 'Rank 1.png');
  const pdfFilePath = path.join(__dirname, 'uploads', `${name}_certificate.pdf`);

  const userName = name;

  const image = await Jimp.read(imageFilePath);

  const font = await Jimp.loadFont(Jimp.FONT_SANS_64_BLACK);

  image.print(font, 1620, 1312, userName);

  const scaleWidth = 0.6;
  const scaleHeight = 0.6;

  const imageBuffer = await image.getBufferAsync(Jimp.MIME_JPEG);

  const pdfPageWidth = image.getWidth() * 0.6;

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([pdfPageWidth, image.getHeight() * scaleHeight]);

  const embeddedImage = await pdfDoc.embedJpg(imageBuffer);

  const pageWidth = page.getWidth();
  const pageHeight = page.getHeight();
  const centerX = pageWidth / 2;
  const centerY = pageHeight / 2;

  const { width, height } = embeddedImage.scale(scaleWidth, scaleHeight);
  const imageX = centerX - width / 2;
  const imageY = centerY - height / 2;

  page.drawImage(embeddedImage, {
    x: imageX,
    y: imageY,
    width,
    height,
  });

  const pdfBytes = await pdfDoc.save();

  fs.writeFileSync(pdfFilePath, pdfBytes);
  return pdfFilePath;
}


createPdfWithImage("user name")
// Define your contacts array
const contactds = [
  {"name": "ajith G", "email": "ajithtejag@gmail.com"},
  {"name": "Ajith teja gorla", "email": "ajithtejagorla@gmail.com"},
  // Add more contacts here...
];

const contacts = [
  {"name": "Ramanagovind G P", "email": "ramanagovind2680@gmail.com"},
]




app.post("/certificates", async (req, res, next) => {
  try {
    for (const contact of contacts) {
      const pdfFilePath = await createPdfWithImage(contact.name);
      console.log(pdfFilePath)

      // Configure the email message
      let mailBody = `<html>
                        <head></head>
                        <body>
                          <div style="text-align: center; padding: 10px 20px">
                              <p style="font-weight: bold; font-size: 18px; font-family: roboto;">🎊CONGRATULATIONS!🎊</p>
                              <p style="font-family: roboto;">You are one step closer to unleashing your Web 3 I Blockchain potential!
                              </p>
                              <div style="text-align: left; background-color: #fff; margin-top: 20px;">
                                  <p>Dear ${contact.name},</p>
                                  <p>A pat on the back 🎉 for earning the IBC -CEP Education Certificate as part of your 
                                      Web 3 I Blockchain 🌐 education  with us for the IBC-CEP Module 1 & 2. Well done!👏🏆
                                  </p>
                                  <p>
                                    We appreciate your commitment and perseverance and rest assured your IBC Web 3 journey is filled with benefits 🚀  for you at every milestone! 🌟📈
                                  </p>
                                  <p>
                                      Looking forward to your continued dedication and a successful completion 🎯 of IBC - CEP and future success 🤩🤩in emerging technologies.🧑‍💻🧑‍💻
                                  </p>
                                  <p>
                                      Warm regards,
                                  </p>
                                  <p>
                                      IBC Team
                                  </p>
                              </div>
                          </div>
                      </body>
                      </html>`;

      let subject = 'Your Certificate from IBC Media';

      // Send the email with the personalized PDF certificate as an attachment
      sendMail(contact.email, subject, mailBody, contact.name, pdfFilePath)
        .then(data => {
          console.log(`Email sent to ${contact.email}`);
          // Delete the generated PDF certificate
          fs.unlinkSync(pdfFilePath);
        })
        .catch(err => {
          console.log(`Failed to send email to ${contact.email}: ${err}`);
        });
    }

    res.status(200).json({ message: "Emails with certificates sent successfully." });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: "failed." });
  }
});

app.listen(3005, () => {
  console.log("Port is listening at 3005");
});
