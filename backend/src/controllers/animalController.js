const Animal = require('../models/animalModel');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const Favorite = require('../models/favoriteAnimalModel');
const User = require('../models/userModel');
require('dotenv').config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'animals',
        allowed_formats: ['jpg', 'png', 'jpeg'],
    },
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
        const ownerIds = animals.map((animal) => animal.owner);

        const owners = await User.find({ _id: { $in: ownerIds } }).lean();

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

            const ownerDetails = owners.find((owner) => owner._id.toString() === obj.owner);

            return {
                ...obj.toObject(),
                kms: distanceInKm,
                isFavorite: favoriteAnimalIds.includes(obj._id.toString()), // Check if the animal is a favorite
                owner: ownerDetails || obj.owner
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
        // Handle multiple petType filtering
        if (Array.isArray(petType) && petType.length > 0) {
            query.petType = { $in: petType };
        }

        // Handle multiple breedType filtering
        if (Array.isArray(breedType) && breedType.length > 0) {
            query.breedType = { $in: breedType };
        }

        const totalAnimals = await Animal.countDocuments(query);

        const animals = await Animal.find(query)
            .populate('petType', 'name')
            .populate('breedType', 'name')
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit))
            .sort({ createdAt: -1 });

        const animalIds = animals.map((animal) => animal._id); // Extract animal IDs
        const ownerIds = animals.map((animal) => animal.owner);

        const owners = await User.find({ _id: { $in: ownerIds } }).lean();
        

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
            const ownerDetails = owners.find((owner) => owner._id.toString() === obj.owner);

            return {
                ...obj.toObject(),
                kms: distanceInKm,
                isFavorite: favoriteAnimalIds.includes(obj._id.toString()), // Check if the animal is a favorite
                owner: ownerDetails || obj.owner
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

        const ownerDetails = await User.findById(animal.owner).lean();
        const animalData = animal.toObject();

        return res.status(200).json({
            status: 200,
            message: "Animal details fetched successfully!",
            data: {
                ...animalData,
                owner: ownerDetails || animal.owner, 
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
            const user = req.user;
            const userId = user ? user._id : null;

            if (!userId) {
                return res.status(401).json({ status: 401, message: "Unauthorized: User not logged in." });
            }

            // Check if user has permission to create or edit animals
            if (user.userType !== "Pet Owner") {
                return res.status(403).json({ status: 403, message: "Forbidden: Only Pet Owners can add or edit animals." });
            }

            let animal;
            if (id) {
                // Updating existing animal
                animal = await Animal.findById(id);
                if (!animal) {
                    return res.status(404).json({ status: 404, message: "Animal not found." });
                }

                // Update only the fields that are provided in the request body
                Object.keys(req.body).forEach(key => {
                    if (req.body[key] !== undefined) {
                        animal[key] = req.body[key];
                    }
                });

                // Handle location update if provided
                if (req.body.location) {
                    try {
                        const location = typeof req.body.location === "string" ? JSON.parse(req.body.location) : req.body.location;
                        if (location.lat && location.lng) {
                            animal.location = {
                                lat: parseFloat(location.lat),
                                lng: parseFloat(location.lng)
                            };
                        }
                    } catch (parseError) {
                        return res.status(400).json({ status: 400, message: "Invalid location format. It must be a valid JSON object." });
                    }
                }

                // Handle image updates if new images are uploaded
                // if (req.files && req.files.length > 0) {
                //     const newImages = req.files.map(file => `/uploads/animals/${file.filename}`);
                //     animal.images = newImages;
                // }
                // Handle image updates if new images are uploaded
                if (req.files && req.files.length > 0) {
                    const newImages = req.files.map(file => file.path); // file.path contains the full URL in Cloudinary
                    animal.images = newImages; // Save full URLs to the 'images' field of the animal
                }


                await animal.save();
            } else {
                // Creating new animal 
                const {
                    name,
                    gender,
                    petType,
                    breedType,
                    size,
                    age,
                    location,
                    address,
                    city,
                    state,
                    country,
                    description,
                } = req.body;

                const missingFields = [];
                if (!name) missingFields.push("name");
                if (!gender) missingFields.push("gender");
                if (!petType) missingFields.push("petType");
                if (!size) missingFields.push("size");
                if (!age) missingFields.push("age");
                if (!location) missingFields.push("location");
                if (!address) missingFields.push("address");
                if (!city) missingFields.push("city");
                if (!state) missingFields.push("state");
                if (!country) missingFields.push("country");
                if (!description) missingFields.push("description");

                if (missingFields.length > 0) {
                    return res.status(400).json({
                        status: 400,
                        message: "Validation failed. The following fields are required:",
                        missingFields: missingFields
                    });
                }
                let parsedLocation;
                try {
                    parsedLocation = typeof location === "string" ? JSON.parse(location) : location;
                    if (!parsedLocation.lat || !parsedLocation.lng) {
                        return res.status(400).json({ status: 400, message: "Invalid location format. lat and lng are required." });
                    }
                } catch (parseError) {
                    return res.status(400).json({ status: 400, message: "Invalid location format. Must be a JSON object." });
                }

                // Ensure images are uploaded
                if (!req.files || req.files.length === 0) {
                    return res.status(400).json({ status: 400, message: "At least one image is required." });
                }
                const images = req.files.map((file) => file.path); // Cloudinary image URLs

                // Create a new animal (Assign 'owner' as 'userId')
                animal = new Animal({
                    name,
                    images,
                    gender,
                    petType,
                    breedType: breedType || null,
                    size,
                    age,
                    location: {
                        lat: parseFloat(parsedLocation.lat),
                        lng: parseFloat(parsedLocation.lng),
                    },
                    address,
                    city,
                    state,
                    country,
                    owner: userId, //  Set the logged-in user as the owner
                    description,
                });

                await animal.save();

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
