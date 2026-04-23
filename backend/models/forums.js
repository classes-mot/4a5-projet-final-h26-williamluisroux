import mongoose from 'mongoose';

const forumsSchema = new mongoose.Schema({
    titre: { type: String, required: true },
    description: { type: String },
    createurId: { type: String, immutable: true },
    dateCreation: { type: Date, default: Date.now, immutable: true },
});
const Forum = mongoose.model('Forum', forumsSchema);
export default Forum;
