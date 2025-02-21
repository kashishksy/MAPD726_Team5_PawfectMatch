require('dotenv').config();
const mongoose = require('mongoose');
const Pet = require('./src/models/petModel');
const Breed = require('./src/models/breedModel');

const mongoURI = process.env.MONGO_URL; // Replace with your actual MongoDB URL

const seedData = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log("MongoDB Connected");

        // Pet types
        const petTypes = ["Dogs", "Cats", "Rabbits", "Birds", "Reptiles", "Fish", "Primates", "Horses", "Other"];
        
        const petDocs = await Pet.insertMany(petTypes.map(name => ({ name })));
        console.log("Pets Inserted:", petDocs);

        // Breed mapping
        const breeds = {
            Dogs: ["Labrador Retriever", "German Shepherd", "Golden Retriever"],
            Cats: ["Persian", "Siamese", "Bengal"],
            Rabbits: ["Holland Lop", "Mini Rex", "Flemish Giant"],
            Birds: ["Parrot", "Canary", "Cockatoo"],
            Reptiles: ["Iguana", "Chameleon", "Python"],
            Fish: ["Goldfish", "Betta", "Guppy"],
            Primates: ["Chimpanzee", "Macaque", "Capuchin"],
            Horses: ["Arabian", "Thoroughbred", "Clydesdale"],
            Other: ["Ferret", "Hedgehog", "Sugar Glider"]
        };

        let breedDocs = [];
        for (let pet of petDocs) {
            let petBreeds = breeds[pet.name] || [];
            petBreeds.forEach(breed => {
                breedDocs.push({ petId: pet._id, name: breed });
            });
        }

        await Breed.insertMany(breedDocs);
        console.log("Breeds Inserted:", breedDocs);

        mongoose.connection.close();
    } catch (err) {
        console.error("Error seeding data:", err);
    }
};

seedData();
