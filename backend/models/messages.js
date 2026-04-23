import mongoose from 'mongoose';

const messagesSchema = new mongoose.Schema({
    contenu: { type: String, required: true },
    auteurId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', immutable: true },
    forumId: { type: mongoose.Schema.Types.ObjectId, ref: 'Forum', immutable: true },
    dateEnvoi: { type: Date, default: Date.now, immutable: true },
});

const Message = mongoose.model('Message', messagesSchema);
export default Message;
