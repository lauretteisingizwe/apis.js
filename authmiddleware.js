const { verify } = require("jsonwebtoken");
require("dotenv").config();

const validateToken = (req, res, next) => {
  const accessToken = req.header("accessToken");

  if (!accessToken)
    return res.status(401).send({ error: "User not logged in" });

  try {
    const validToken = verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    req.user = validToken;
    if (validToken) {
      return next();
    }
  } catch (err) {
    return res.status(500).send({ error: err });
  }
};

module.exports = { validateToken };