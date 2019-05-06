/** Middleware for handling req authorization for routes. */

const jwt = require("jsonwebtoken");
const msg = require("../models/message")
const { JWT_SECRET } = require("../config");

/** Middleware: Authenticate user. */

function authenticateJWT(req, res, next) {
  try {
    const tokenFromBody = req.headers.authorization;
    const payload = jwt.verify(tokenFromBody, JWT_SECRET);
    req.user = payload; // create a current user
    return next();
  } catch (err) {
    return next();
  }
}
// end

/** Middleware: Requires user is authenticated. */

function ensureLoggedIn(req, res, next) {
  if (!req.user) {
    return next({ status: 401, message: "Unauthorized Logged" });
  } else {
    return next();
  }
}

// end

/** Middleware: Requires correct username. */

function ensureCorrectUser(req, res, next) {
  try {
    if (req.user.username === req.params.username) {
      return next();
    } else {
      return next({ status: 401, message: "Unauthorized Ensure Correct User" });
    }
  } catch (err) {
    // errors would happen here if we made a request and req.user is undefined
    return next({ status: 401, message: "Unauthorized Ensure Correct User" });
  }
}
// end

async function validUser(req, res, next) {
  try {
    let message = await msg.get(req.params.id)
    
    if (req.user.username === message.to_user.username || req.user.username === message.from_user.username) {
      return next();
    } else {
      return next({ status: 401, message: "Unauthorized Valid User" });
    }
  } catch (err) {
    // errors would happen here if we made a request and req.user is undefined
    return next({ status: 401, message: "Unauthorized Valid User" });
  }
}

async function recepientOnly(req, res, next) {
  try {
    let message = await msg.get(req.params.id)
    if (req.user.username === message.to_user.username) {
      return next();
    } else {
      return next({ status: 401, message: "Unauthorized Recepient" });
    }
  } catch (err) {
    // errors would happen here if we made a request and req.user is undefined
    return next({ status: 401, message: "Unauthorized Recepient" });
  }
}
module.exports = {
  authenticateJWT,
  ensureLoggedIn,
  ensureCorrectUser,
  validUser,
  recepientOnly
};
