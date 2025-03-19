const Animal = require('../models/animalModel');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const Favorite = require('../models/favoriteAnimalModel');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../../uploads/animals');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage: storage }).array('images', 5);

// Default center location (change as needed)
const DEFAULT_LOCATION = { lat: 43.7756435641, lng: -79.2340690637 };

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
        const { page = 1, limit = 10, searchName, searchLocation, size, age, gender, petType, breedType } = req.body;
        const userId = req.user ? req.user._id : null; // Get user ID from auth middleware

        const query = {};

        if (searchName) query.name = { $regex: new RegExp(searchName, 'i') };
        if (searchLocation) query.address = { $regex: new RegExp(searchLocation, 'i') };
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


const validEnums = {
    gender: ["Male", "Female"],
    size: ["Small", "Medium", "Large"],
    age: ["Baby", "Young", "Adult", "Senior"]
};

exports.addOrEditAnimal = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(500).json({ status: 500, message: "File upload error", error: err.message });
        }

        try {
            const { id } = req.params;
            const userId = req.user ? req.user._id : null; // Get user ID from auth middleware

            console.log(userId);
            if (!userId) {
                return res.status(401).json({ status: 401, message: "Unauthorized: User not logged in." });
            }

            const requiredFields = ["name", "gender", "petType", "size", "age", "location", "address", "city", "state", "country", "owner", "description"];

            for (const field of requiredFields) {
                if (!req.body[field]) {
                    return res.status(400).json({ status: 400, message: `${field} is required.` });
                }
            }

            // Parse location if sent as string
            let location;
            try {
                location = typeof req.body.location === "string" ? JSON.parse(req.body.location) : req.body.location;
            } catch (parseError) {
                return res.status(400).json({ status: 400, message: "Invalid location format. It must be a valid JSON object." });
            }

            // Validate latitude and longitude
            if (!location.lat || !location.lng || isNaN(location.lat) || isNaN(location.lng)) {
                return res.status(400).json({ status: 400, message: "Valid latitude and longitude are required." });
            }

            // Ensure location values are numbers
            location.lat = parseFloat(location.lat);
            location.lng = parseFloat(location.lng);

            // Ensure address is a string (Fix for address error)
            req.body.address = Array.isArray(req.body.address) ? req.body.address.join(" ") : req.body.address;

            for (const field in validEnums) {
                if (req.body[field] && !validEnums[field].includes(req.body[field])) {
                    return res.status(400).json({ status: 400, message: `${field} must be one of ${validEnums[field].join(", ")}.` });
                }
            }

            let images = req.files ? req.files.map(file => `/uploads/animals/${file.filename}`) : [];

            let animal;
            if (id) {
                // Fetch existing animal
                animal = await Animal.findById(id);
                if (!animal) {
                    return res.status(404).json({ status: 404, message: "Animal not found." });
                }

                // console.log(animal.owner.toString(), userId.toString());
                // if (animal.owner.toString() !== userId.toString()) {
                //     return res.status(403).json({ status: 403, message: "Forbidden: You do not have permission to edit this animal." });
                // }

                // Remove old images if new ones are uploaded
                if (images.length && animal.images.length) {
                    animal.images.forEach((imagePath) => {
                        const fullPath = path.join(__dirname, "../../", imagePath);
                        if (fs.existsSync(fullPath)) {
                            fs.unlinkSync(fullPath); // Delete old image
                        }
                    });
                }

                // Update existing animal
                animal = await Animal.findByIdAndUpdate(id, {
                    ...req.body,
                    location,
                    images: images.length ? images : animal.images // Keep old images if no new ones are uploaded
                }, { new: true });
            } else {
                // Create new animal
                animal = await Animal.create({
                    ...req.body,
                    location,
                    images
                });
            }

            return res.status(200).json({
                status: 200,
                message: id ? "Animal updated successfully!" : "Animal added successfully!",
                data: animal
            });
        } catch (err) {
            console.error("Error in addOrEditAnimal:", err);
            return res.status(500).json({ status: 500, message: "Internal server error", error: err.message });
        }
    });
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




