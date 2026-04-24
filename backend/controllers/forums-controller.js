import HttpError from '../util/http-error.js';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import Forum from '../models/forums.js';
import Message from '../models/messages.js'
import User from '../models/users.js'

const getForums = async (req, res, next) => {
    let forums;
    try {
        forums = await Forum.find({});
    } catch (err) {
        const error = new HttpError(
            'Une erreur BD est survenue, veuillez réessayer plus tard.',
            500
        );
        return next(error);
    }
    res.json({ forums: forums.map(forums => forums.toObject({ getters: true })) });
};

const createForum = async (req, res, next) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        return next(
            new HttpError(
                'Données saisies invalides. Vérifiez votre payload.',
                422
            )
        );
    }

    const { titre, description } = req.body;
    const createurId = req.userData.userId;

    const createdForum = new Forum({
        titre,
        description,
        createurId,
        messages: []
    });

    try {
        await createdForum.save();
        await User.findByIdAndUpdate(
            createurId,
            { $push: { forums: createdForum._id } }
        );
    } catch (err) {
        console.log(err);
        const error = new HttpError(
            'Création dans la BD échouée.',
            500
        );
        return next(error);
    }

    res.status(201).json({ forum: createdForum.toObject({ getters: true }) });
};

// Supprime les messages du forum aussi
const deleteForum = async (req, res, next) => {
    const forumId = req.params.fid;
    let forum;
    try {
        forum = await Forum.findById(forumId)
    } catch (err) {
        const error = new HttpError(
            'Une erreur BD est survenue, veuillez réessayer plus tard.',
            500
        );
        return next(error);
    }

    if (!forum) {
        const error = new HttpError(
            'Forum non trouvé.',
            404
        );
        return next(error);
    }

    if (forum.createurId.toString() !== req.userData.userId) {
        const error = new HttpError(
            'Interdit : Vous n\'êtes pas le créateur.',
            403
        );

        return next(error);
    }

    try {
        await forum.deleteOne();
        await Message.deleteMany({ forumId: forumId });
        await User.updateOne(
            { _id: forum.createurId },
            { $pull: { forums: forumId } }
        );
    } catch (err) {
        const error = new HttpError(
            'Une erreur est survenue lors de la suppression du forum et des messages.',
            500
        );
        return next(error);
    }

    res.status(200).json({ message: 'Forum et messages supprimé.' });
};

export default {
    getForums,
    createForum,
    deleteForum,
};
