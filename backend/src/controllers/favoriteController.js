const FavoriteAnimal = require('../models/favoriteAnimalModel');
const Animal = require('../models/animalModel');

exports.toggleFavoriteAnimal = async (req, res) => {
    try {
        const { animalId } = req.body;
        const userId = req.user.id; // Assuming user ID comes from JWT authentication

        if (!animalId) {
            return res.status(400).json({ status: 400, message: "Animal ID is required" });
        }

        const animal = await Animal.findById(animalId);
        if (!animal) {
            return res.status(404).json({ status: 404, message: "Animal not found" });
        }

        const existingFavorite = await FavoriteAnimal.findOne({ userId, animalId });

        if (existingFavorite) {
            await FavoriteAnimal.deleteOne({ _id: existingFavorite._id });
            return res.status(200).json({ status: 200, message: "Animal removed from favorites" });
        } else {
            await FavoriteAnimal.create({ userId, animalId });
            return res.status(201).json({ status: 201, message: "Animal added to favorites" });
        }
    } catch (error) {
        console.error("Error toggling favorite:", error);
        return res.status(500).json({ status: 500, message: "Internal Server Error" });
    }
};


exports.getFavoriteAnimals = async (req, res) => {
    try {
        const userId = req.user.id;

        const favorites = await FavoriteAnimal.find({ userId })
            .populate({
                path: 'animalId',
                populate: [{ path: 'petType', select: 'name' }, { path: 'breedType', select: 'name' }]
            });

        const favoriteAnimals = favorites.map(fav => {
            let animal = fav.animalId.toObject();
            animal.isFavorite = true; // Mark as favorite

            return animal;
        });

        return res.status(200).json({
            status: 200,
            message: "Favorite animals fetched successfully",
            data: favoriteAnimals
        });
    } catch (error) {
        console.error("Error fetching favorite animals:", error);
        return res.status(500).json({ status: 500, message: "Internal Server Error" });
    }
};
