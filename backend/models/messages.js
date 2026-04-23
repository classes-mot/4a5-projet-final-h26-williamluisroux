import mongoose from 'mongoose';

const messagesSchema = new mongoose.Schema({
    contenu: { type: String, required: true },
    auteurId: { type: String, immutable: true },
    forumId: { type: String, immutable: true },
    dateEnvoi: { type: Date, default: Date.now, immutable: true },
});

const Message = mongoose.model('Message', messagesSchema);
export default Message;
