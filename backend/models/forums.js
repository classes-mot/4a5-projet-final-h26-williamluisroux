import mongoose from 'mongoose';

const forumsSchema = new mongoose.Schema({
    titre: { type: String, required: true },
    description: { type: String },
    createurId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', immutable: true },
    dateCreation: { type: Date, default: Date.now, immutable: true },
    messages: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Message'
        }
    ]
});

const Forum = mongoose.model('Forum', forumsSchema);
export default Forum;
