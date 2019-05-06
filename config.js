/** Common config for message.ly */

// read .env files and make environmental variables

require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY || "secret";
const JWT_SECRET = process.env.JWT_SECRET || "JWTsecret";

const BCRYPT_WORK_ROUNDS = 10;


module.exports = {
  SECRET_KEY,
  JWT_SECRET,
  BCRYPT_WORK_ROUNDS,
};