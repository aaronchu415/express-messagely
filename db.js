/** Database connection for messagely. */


const { Client } = require("pg");

const client = new Client("postgres:///messagely");

client.connect();


module.exports = client;
