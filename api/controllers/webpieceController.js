const { helpers, config } = require("../../config/setup");
const Webpiece = require("../models/Webpiece");
const nodemailer = require("nodemailer");
const { emailMaker } = require("../../config/emailMaker");
// const sharp = require("sharp");
const jimp = require("jimp");
const path = require("path");
const fs = require("fs");

module.exports.getAllWebpieceRequests = async (req, res) => {
  Webpiece.sync({ alter: true });

  try {
    const result = await Webpiece.findAndCountAll();
    res.status(200).json({ message: "Get all webpieces is working", result });
  } catch (err) {
    console.log(err);
    let errors = helpers.handleErrors(err);
    res.status(400).json(errors);
  }
};

module.exports.addWebpieceRequestImage = async (req, res, next) => {
  // Webpiece.sync({ alter: true });

  console.log(req.file);
  const { filename: webpieceImage } = req.file;
  console.log({ webpieceImage });
  const image = await jimp.read(req.file.path);
  image
    .resize(466, jimp.AUTO)
    .quality(50)
    .write(path.resolve(req.file.destination, "resized", webpieceImage));

  // .then((image) => {
  // .then((info) => {
  const imageFullsizedPath = path.resolve(req.file.destination, webpieceImage);
  const imagePath = path.resolve(
    req.file.destination,
    "resized",
    webpieceImage
  );
  const imageFullsizedUrl = `${config.baseUrl}/uploads/webpieces/${webpieceImage}`;
  const imageUrl = `${config.baseUrl}/uploads/webpieces/resized/${webpieceImage}`;
  console.log({ image, imageFullsizedUrl, imageUrl });
  res.status(200).json({
    message: "Image Uploaded",
    image,
    imageFullsizedUrl,
    imageFullsizedPath,
    imagePath,
    imageUrl
  });
  // })
  //   return image
  //     .resize(466, 350)
  //     .quality(50)
  //     .write(path.resolve(req.file.destination, "resized", webpieceImage));
  // })
  // .catch((err) => {
  //   console.log(err);
  // });
  // await sharp(req.file.path)
  //   .resize(466, 350)
  //   .jpeg({ quality: 50 })
  //   .toFile(path.resolve(req.file.destination, "resized", webpieceImage))
  //   .then((info) => {
  //     console.log({ info });
  //     const imageFullsizedUrl = `${config.baseUrl}/uploads/webpieces/${webpieceImage}`;
  //     const imageUrl = `${config.baseUrl}/uploads/webpieces/resized/${webpieceImage}`;
  //     res
  //       .status(200)
  //       .json({ message: "Image Uploaded", info, imageFullsizedUrl, imageUrl });
  //   });
  // res
  //   .status(200)
  //   .json({ message: "apologies this route isn't working for now" });
};

module.exports.updateWebpieceRequest = async (req, res) => {
  const { id } = req.params;
  const { upvotes } = req.body;
  const updateData = {};
  updateData.upvotes = upvotes;
  try {
    const result = await Webpiece.update(updateData, { where: { id } });
    if (result[0]) {
      const updatedWebpieceRequest = await Webpiece.findByPk(id);
      res
        .status(200)
        .json({
          message: `Updated webpiece request with id - ${id}`,
          updatedWebpieceRequest
        });
    } else {
      res.status(404).json({ message: `Unable to update Webpiece Request` });
    }
  } catch (err) {
    console.log({ err });
    let errors = helpers.generateError(err);
    res.status(400).json(errors);
  }
  // res.status(200).json({ message: "Update Webpiece request works" });
};

module.exports.addWebpieceRequest = async (req, res) => {
  Webpiece.sync({ alter: true });
  let {
    username,
    title,
    description,
    imageUrl,
    imagePath,
    imageFullsizedUrl,
    imageFullsizedPath,
    selectedTechnologies,
    color,
    profileImage,
    email,
    isImage,
    facebookhandle,
    githubhandle,
    twitterhandle,
    uploadedImage
  } = req.body;
  let userContactDetails;
  if (githubhandle || facebookhandle || twitterhandle || email) {
    userContactDetails = {
      githubhandle,
      facebookhandle,
      twitterhandle,
      email
    };
  } else {
    userContactDetails = null;
  }

  // if (!isImage) {
  username = username ? username : null;
  title = title ? title : null;
  description = description ? description : null;
  imageUrl = imageUrl ? imageUrl : null;

  try {
    const webpieceRequest = await Webpiece.create({
      username,
      title,
      description,
      imageUrl,
      imagePath,
      imageFullsizedUrl,
      imageFullsizedPath,
      selectedTechnologies,
      userContactDetails
    });
    res.status(201).json({
      message: "Webpiece Request created",
      success: true,
      webpieceRequest
    });
  } catch (err) {
    console.log({ err });
    let errors = helpers.handleErrors(err);
    res.status(400).json(errors);
  }

  // const emailText = emailMaker.makePlainTextInvitation(
  //   "Test Username",
  //   "https://youtube.com"
  // );
  // const emailBody = emailMaker.makeHTMLInvitation(
  //   "Test Username",
  //   "#e91e63",
  //   "https://bankole2000.github.io/portfolio/img/profile.jpg.webp",
  //   "https://youtube.com"
  // );
  // const emailToSend = emailMaker.makeEmailParams(
  //   "💻 Banky Studio",
  //   email,
  //   `👋 Hi Test User, I'll keep you updated`,
  //   emailText,
  //   emailBody
  // );
  // let transporter = nodemailer.createTransport(emailMaker.transport);

  // res
  //   .status(201)
  //   .json({ message: "New wepiece request added", body: req.body });

  // let info = await transporter.sendMail(emailToSend);
  // console.log("Message sent: %s", info.messageId);
};

module.exports.deleteWebpieceRequest = async (req, res) => {
  const { id } = req.params;
  const { imagePath, imageFullsizedPath } = req.body;
  console.log({ id });
  const webpieceRequest = await Webpiece.findByPk(id);
  if (webpieceRequest.imagePath) {
    fs.unlink(imagePath, () => {
      console.log("image path Deleted");
    });
  }
  if (webpieceRequest.imageFullsizedPath) {
    fs.unlink(imageFullsizedPath, () => {
      console.log("image full sized path Deleted");
    });
  }
  await Webpiece.destroy({ where: { id } });

  res.status(200).json({ message: "webpiece Request deleted", id });
};
