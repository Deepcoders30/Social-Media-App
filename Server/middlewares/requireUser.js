const jwt = require("jsonwebtoken");
const { error, success } = require("../utils/responseWrapper");
const User = require("../models/Users.js");

module.exports = async (req, res, next) => {
  if (
    !req.headers ||
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer")
  ) {
    return res.send(error(401, "Authorization header is required."));
  }

  const accessToken = req.headers.authorization.split(" ")[1];

  try {
    const decoded = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_PRIVATE_KEY
    );
    req._id = decoded._id;

    const user = await User.findById(req._id);
    if (!user) {
      return res.send(error(404, "user not found"));
    }

    next();
  } catch (e) {
    return res.send(error(401, "Invalid access key"));
  }
};
