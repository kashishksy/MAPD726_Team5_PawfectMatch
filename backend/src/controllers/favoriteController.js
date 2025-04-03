const FavoriteAnimal = require('../models/favoriteAnimalModel');
const Animal = require('../models/animalModel');

exports.toggleFavoriteAnimals = async (req, res) => {
    try {
        const { animalIds } = req.body; // Expecting an array of animal IDs
        const userId = req.user.id; // User ID from JWT authentication

        if (!Array.isArray(animalIds) || animalIds.length === 0) {
            return res.status(400).json({ status: 400, message: "Animal IDs array is required" });
        }

        // Fetch valid animals
        const animals = await Animal.find({ _id: { $in: animalIds } });

        if (animals.length !== animalIds.length) {
            return res.status(404).json({ status: 404, message: "One or more animals not found" });
        }

        // Fetch user's existing favorite animals
        const existingFavorites = await FavoriteAnimal.find({ userId, animalId: { $in: animalIds } });

        // Determine which to add and which to remove
        const existingFavoriteIds = existingFavorites.map(fav => fav.animalId.toString());
        const toRemove = existingFavorites.map(fav => fav._id);
        const toAdd = animalIds.filter(id => !existingFavoriteIds.includes(id));

        // Remove existing favorites
        if (toRemove.length > 0) {
            await FavoriteAnimal.deleteMany({ _id: { $in: toRemove } });
        }

        // Add new favorites
        if (toAdd.length > 0) {
            const favoriteDocs = toAdd.map(animalId => ({ userId, animalId }));
            await FavoriteAnimal.insertMany(favoriteDocs);
        }

        return res.status(200).json({
            status: 200,
            message: "Favorites updated successfully",
            added: toAdd,
            removed: existingFavoriteIds
        });

    } catch (error) {
        console.error("Error toggling favorites:", error);
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
