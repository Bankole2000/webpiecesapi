const { helpers, config } = require("../../config/setup");
const UpdateRequest = require("../models/UpdateRequest");
const nodemailer = require("nodemailer");
const { emailMaker } = require("../../config/emailMaker");

module.exports.getAllUpdateRequests = async (req, res) => {
  UpdateRequest.sync({ alter: true });
  try {
    const updateRequests = await UpdateRequest.findAndCountAll();
    res.status(200).json({ message: "All update requests", updateRequests });
  } catch (err) {
    console.log(err);
    let errors = helpers.generateError(err);
    res.status(400).json(errors);
  }
};

module.exports.addUpdateRequest = async (req, res) => {
  UpdateRequest.sync({ alter: true });
  const { name, email, type, isDark, color, link } = req.body;
  console.log({ name, email, type, isDark, color, link });
  const formerRequest = await UpdateRequest.findOne({ where: { email, type } });
  if (formerRequest) {
    res.status(429).json({
      message: "You've already signed up for this",
      success: false,
      formerRequest
    });
  } else {
    try {
      const newUpdateRequest = await UpdateRequest.create({
        username: name,
        email,
        type
      });
      res.status(200).json({
        message: "Update request created",
        success: true,
        newUpdateRequest
      });

      const profileImages = [
        "https://bankole2000.github.io/webpieces/img/nightprofile.jpg.658435b5.webp",
        "https://bankole2000.github.io/portfolio/img/profile.jpg.webp"
      ];
      const channels = {
        youtube: "Youtube Channel",
        discord: "Discord Server",
        twitch: "Twitch Channel"
      };

      let profileImage = isDark ? profileImages[0] : profileImages[1];

      const emailText = emailMaker.makePlainTextInvitation(
        name,
        "https://youtube.com"
      );

      const emailBody = emailMaker.makeHTMLInvitation(
        name,
        color,
        profileImage,
        link,
        channels[type]
      );
      const emailToSend = emailMaker.makeEmailParams(
        "💻 Banky Studio",
        email,
        `👋 Hi ${name}, I'll keep you updated`,
        emailText,
        emailBody
      );
      let transporter = nodemailer.createTransport(emailMaker.transport);
      let info = await transporter.sendMail(emailToSend);
      console.log("Message sent: %s", info.messageId);
    } catch (err) {
      let errors = helpers.generateError(err);
      res.status(400).json(errors);
    }
  }
};
