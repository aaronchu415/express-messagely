/** Common config for message.ly */

// read .env files and make environmental variables

require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY || "secret";
const BCRYPT_WORK_ROUNDS = 10;


module.exports = {
  SECRET_KEY,
  BCRYPT_WORK_ROUNDS,
};