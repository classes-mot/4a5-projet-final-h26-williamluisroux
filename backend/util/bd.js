import mongoose from 'mongoose';

let isConnected = false;

export const connectDB = async () => {
    if (isConnected) return;
    const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/WilliamLuisRoux_BD_ProjetSynthese_Forums"
    try {
        await mongoose.connect(MONGODB_URI);
        isConnected = true;
        console.log('Connexion MongoDB réussie');
    } catch (err) {
        console.error('Erreur de connexion MongoDB :', err.message);
        process.exit(1); // Arrête le serveur en cas d’échec
    }
};
