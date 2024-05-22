import WaitlistDB from "../model/Waitlist.js";
import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";
// Get the current file's URL
const __filename = fileURLToPath(import.meta.url);

// Get the directory name
import { dirname } from "path";
const __dirname = dirname(__filename);

const handleWaitlist = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({
      message: "Email is required",
    });
  }
  //   Check for duplicate users in the database
  const duplicate = await WaitlistDB.findOne({ email }).exec(); //findOne method need exec() if there is no callback

  if (duplicate) {
    return res.status(409).json({ message: "Email is already in waitlist" });
  }

  try {
    //     create waitlist
    await WaitlistDB.create({
      email,
    });
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // Use `true` for port 465, `false` for all other ports
      auth: {
        user: process.env.USER_EMAIL, //send gmail address
        pass: process.env.USER_PWD, //app password from email account
      },
    });
    const mailOptions = {
      from: {
        name: "EcommartNg",
        address: process.env.USER_EMAIL,
      }, // sender address
      to: [email], // list of receivers
      subject: "EcommartNg Waitlist ✔", // Subject line
      text: "Hello world?", // plain text body
      html: "<b>Hi Customer, you have successfully joined our waitlist. we will updated you on our latest features and launch date. Stay tuned!</b>", // html body
      //   cc:['email']
      attachments: [
        {
          filename: "About_EcommartNg.pdf",
          path: path.join(__dirname, "..", "receipts", "About_EcommartNg.pdf"),
          contentType: "application/pdf",
        },
      ],
    };
    await transporter.sendMail(mailOptions);
    console.log("Email send successfully!");
    res
      .status(201)
      .json({ message: `${email} added to waitlist successfully!` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export default handleWaitlist;
