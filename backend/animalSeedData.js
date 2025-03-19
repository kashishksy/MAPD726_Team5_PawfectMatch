require('dotenv').config();
const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const Pet = require('./src/models/petModel');
const Breed = require('./src/models/breedModel');
const Animal = require('./src/models/animalModel');

const mongoURI = process.env.MONGO_URL;

const seedAnimals = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log("MongoDB Connected");

        // Fetch all pet types and breeds
        const pets = await Pet.find();
        const breeds = await Breed.find();

        if (!pets.length || !breeds.length) {
            console.error("No pet types or breeds found. Please seed pets and breeds first.");
            mongoose.connection.close();
            return;
        }

        // Helper function to get a random item from an array
        const getRandomItem = (arr) => (arr.length ? arr[Math.floor(Math.random() * arr.length)] : null);

        const sizes = ["Small", "Medium", "Large"];
        const ages = ["Baby", "Young", "Adult", "Senior"];
        const genders = ["Male", "Female"];

        let animals = [];

        for (let i = 0; i < 50; i++) {
            const randomPet = getRandomItem(pets);
            if (!randomPet) {
                console.warn("Skipping animal creation due to missing pet type.");
                continue;
            }
        
            const breedOptions = breeds.filter(b => b.petId && b.petId.equals(randomPet._id));
            const randomBreed = getRandomItem(breedOptions);
        
            const animal = {
                name: faker.animal.dog(),
                images: [
                    faker.image.urlPicsumPhotos({ width: 640, height: 480 }),
                    faker.image.urlPicsumPhotos({ width: 640, height: 480 })
                ],
                gender: getRandomItem(["Male", "Female"]),
                petType: randomPet._id,
                breedType: randomBreed ? randomBreed._id : null,
                size: getRandomItem(["Small", "Medium", "Large"]),
                age: getRandomItem(["Baby", "Young", "Adult", "Senior"]),
                location: {
                    lat: faker.location.latitude(),
                    lng: faker.location.longitude(),
                },
                address: faker.location.streetAddress(),
                city: faker.location.city(),
                state: faker.location.state(),
                country: faker.location.country(),
                owner: faker.person.fullName(),
                description: faker.lorem.sentences(3)
            };
        
            animals.push(animal);
        }
        

        await Animal.insertMany(animals);

        await Animal.updateMany(
            { honourName: { $exists: true } },
            { $rename: { "honourName": "owner" } }
        );
        
        mongoose.connection.close();
    } catch (err) {
        console.error("Error seeding animals:", err);
    }
};

seedAnimals();
