const Breed = require('../models/breedModel');
const { successResponse, errorResponse } = require('../utils/response');

exports.getBreedsByPet = async (req, res) => {
    const { pet_id } = req.body; // Assuming pet_id is sent in the request body

    // Validate pet_id
    if (!pet_id) {
        return res.status(400).json(errorResponse('Pet ID is required'));
    }

    try {
        const breeds = await Breed.find({ petId: pet_id }).select('_id name');

        if (!breeds.length) {
            return res.status(404).json(errorResponse('No breeds found for the given pet'));
        }

        return res.status(200).json(successResponse('Breed list fetched successfully', breeds));
    } catch (err) {
        console.error("Error fetching breed list:", err);
        return res.status(500).json(errorResponse('Failed to fetch breed list'));
    }
};
