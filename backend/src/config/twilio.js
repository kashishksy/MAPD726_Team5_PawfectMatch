const twilio = require('twilio');
require('dotenv').config();
module.exports = new twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);


