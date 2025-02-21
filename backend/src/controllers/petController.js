const Pet = require('../models/petModel');
const { successResponse, errorResponse } = require('../utils/response');

exports.getPetList = async (req, res) => {
    try {
        const pets = await Pet.find().select('_id name');
        return res.status(200).json(successResponse('Pet list fetched successfully', pets));
    } catch (err) {
        console.error("Error fetching pet list:", err);
        return res.status(500).json(errorResponse('Failed to fetch pet list'));
    }
};
