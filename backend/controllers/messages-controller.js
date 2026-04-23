import HttpError from '../util/http-error.js';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import Message from '../models/messages.js';
import User from '../models/users.js';
import Forum from '../models/forums.js'

const getMessagesByForumId = async (req, res, next) => {
    const fid = req.params.fid;
    let messages;
    try {
        messages = await Message.find({ forumId: fid });
    } catch (err) {
        const error = new HttpError(
            'Une erreur BD est survenue, veuillez réessayer plus tard.',
            500
        );
        return next(error);
    }
    res.json({ messages: messages.map(messages => messages.toObject({ getters: true })) });
};

const createMessage = async (req, res, next) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        return next(
            new HttpError(
                'Données saisies invalides. Vérifiez votre payload.',
                422
            )
        );
    }

    const { contenu, auteurId, forumId } = req.body;

    const createdMessage = new Message({
        contenu,
        auteurId,
        forumId
    });

    try {
        await createdMessage.save();
        await User.findByIdAndUpdate(
            auteurId,
            { $push: { messages: createdMessage._id } }
        );
        await Forum.findByIdAndUpdate(
            forumId,
            { $push: { messages: createdMessage._id } }
        );
    } catch (err) {
        console.log(err);
        const error = new HttpError(
            'Création dans la BD échouée.',
            500
        );
        return next(error);
    }

    res.status(201).json({ message: createdMessage.toObject({ getters: true }) });
};

const deleteMessage = async (req, res, next) => {
    const messageId = req.params.mid;
    let message;
    try {
        message = await Message.findById(messageId)
    } catch (err) {
        const error = new HttpError(
            'Une erreur BD est survenue, veuillez réessayer plus tard.',
            500
        );
        return next(error);
    }

    if (!message) {
        const error = new HttpError(
            'Message non trouvé.',
            404
        );
        return next(error);
    }

    try {
        await message.deleteOne();
        await User.updateOne(
            { _id: message.auteurId },
            { $pull: { messages: messageId } }
        );
        await Forum.updateOne(
            { _id: message.forumId },
            { $pull: { messages: messageId } }
        );
    } catch (err) {
        const error = new HttpError(
            'Une erreur est survenue lors de la suppression du message.',
            500
        );
        return next(error);
    }

    res.status(200).json({ message: 'Messages supprimé.' });
};

export default {
    getMessagesByForumId,
    createMessage,
    deleteMessage,
};
