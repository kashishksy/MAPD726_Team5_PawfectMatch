const Animal = require('../models/animalModel');
const Favorite = require('../models/favoriteAnimalModel');
// Default center location (change as needed)
const DEFAULT_LOCATION = { lat: 37.7749, lng: -122.4194 }; // San Francisco (Example)

// Get Animal List API
exports.getAnimalList = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const userId = req.user ? req.user._id : null; // Get user ID from auth middleware

        const totalAnimals = await Animal.countDocuments();

        const animals = await Animal.find()
            .populate('petType', 'name')
            .populate('breedType', 'name')
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit))
            .sort({ createdAt: -1 });

        const animalIds = animals.map((animal) => animal._id); // Extract animal IDs

        let favoriteAnimalIds = [];
        if (userId) {
            const favoriteAnimals = await Favorite.find({ userId, animalId: { $in: animalIds } });
            favoriteAnimalIds = favoriteAnimals.map((fav) => fav.animalId.toString()); // Convert IDs to strings
        }

        const updatedAnimals = animals.map((obj) => {
            let distanceInKm = null;

            if (obj.location?.lat && obj.location?.lng) {
                distanceInKm = calculateDistance(
                    DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lng,
                    obj.location.lat, obj.location.lng
                );
            }

            return {
                ...obj.toObject(),
                kms: distanceInKm,
                isFavorite: favoriteAnimalIds.includes(obj._id.toString()) // Check if the animal is a favorite
            };
        });

        return res.status(200).json({
            status: 200,
            message: "Animal list fetched successfully!",
            total: totalAnimals,
            page: parseInt(page),
            limit: parseInt(limit),
            data: updatedAnimals
        });

    } catch (err) {
        console.error("Error fetching animals:", err);
        return res.status(500).json({ status: 500, message: "Failed to fetch animals", error: err.message });
    }
};

exports.searchAnimals = async (req, res) => {
    try {
        const { page = 1, limit = 10, search, size, age, gender, petType, breedType } = req.body;
        const userId = req.user ? req.user._id : null; // Get user ID from auth middleware

        const query = {};

        if (search) query.name = { $regex: new RegExp(search, 'i') };
        if (size) query.size = { $regex: new RegExp(`^${size}$`, 'i') };
        if (age) query.age = { $regex: new RegExp(`^${age}$`, 'i') };
        if (gender) {
            query.$or = [
                { gender: gender }, // Exact match
                { gender: { $regex: new RegExp(`^${gender}$`, 'i') } } // Case-insensitive match
            ];
        }
        if (petType) query.petType = petType;
        if (breedType) query.breedType = breedType;

        const totalAnimals = await Animal.countDocuments(query);

        const animals = await Animal.find(query)
            .populate('petType', 'name')
            .populate('breedType', 'name')
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit))
            .sort({ createdAt: -1 });

        const animalIds = animals.map((animal) => animal._id); // Extract animal IDs

        let favoriteAnimalIds = [];
        if (userId) {
            const favoriteAnimals = await Favorite.find({ userId, animalId: { $in: animalIds } });
            favoriteAnimalIds = favoriteAnimals.map((fav) => fav.animalId.toString()); // Convert IDs to strings
        }

        const updatedAnimals = animals.map((obj) => {
            let distanceInKm = null;

            if (obj.location?.lat && obj.location?.lng) {
                distanceInKm = calculateDistance(
                    DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lng,
                    obj.location.lat, obj.location.lng
                );
            }

            return {
                ...obj.toObject(),
                kms: distanceInKm,
                isFavorite: favoriteAnimalIds.includes(obj._id.toString()) // Check if the animal is a favorite
            };
        });

        return res.status(200).json({
            status: 200,
            message: "Animal search results fetched successfully!",
            total: totalAnimals,
            page: parseInt(page),
            limit: parseInt(limit),
            data: updatedAnimals
        });

    } catch (err) {
        console.error("Error searching animals:", err);
        return res.status(500).json({ status: 500, message: "Failed to fetch search results", error: err.message });
    }
};


exports.getAnimalDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user ? req.user._id : null; // Get user ID from auth middleware

        // Find the animal by ID and populate related fields
        const animal = await Animal.findById(id)
            .populate('petType', 'name')
            .populate('breedType', 'name');

        if (!animal) {
            return res.status(404).json({
                status: 404,
                message: "Animal not found",
                error: true
            });
        }

        // Check if the animal has a valid location
        let distanceInKm = null;
        if (animal.location?.lat && animal.location?.lng) {
            distanceInKm = calculateDistance(
                DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lng,
                animal.location.lat, animal.location.lng
            );
        }

        // Check if the animal is in the user's favorites list
        let isFavorite = false;
        if (userId) {
            const favorite = await Favorite.findOne({ userId, animalId: id });
            isFavorite = !!favorite; // Convert to boolean
        }

        return res.status(200).json({
            status: 200,
            message: "Animal details fetched successfully!",
            data: {
                ...animal.toObject(),
                kms: distanceInKm, // Add distance in km
                isFavorite: isFavorite // Add isFavorite key
            }
        });

    } catch (err) {
        console.error("Error fetching animal details:", err);
        return res.status(500).json({
            status: 500,
            message: "Failed to fetch animal details",
            error: err.message
        });
    }
};

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in km
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
}

function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}




