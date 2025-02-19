const Authentication = require("../models/authModel");
const User = require("../models/userModel");

/**
 * Generate and store OTP in the database
 * @param {string} email - User's email
 * @param {string} otp - OTP to store
 */
const saveOTP = async (email, otp) => {
  return await Authentication.findOneAndUpdate(
    { email },
    { otp },
    { upsert: true, new: true }
  );
};

/**
 * Retrieve OTP from the database
 * @param {string} email - User's email
 * @param {string} otp - OTP to verify
 */
const verifyOTP = async (email, otp) => {
  return await Authentication.findOne({ email, otp });
};

/**
 * Delete OTP after successful verification
 * @param {string} email - User's email
 */
const deleteOTP = async (email) => {
  return await Authentication.deleteOne({ email });
};

/**
 * Check if a user exists in the database
 * @param {string} email - User's email
 */
const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

module.exports = {
  saveOTP,
  verifyOTP,
  deleteOTP,
  findUserByEmail,
};
