import jwt from 'jsonwebtoken';
import User from '../models/users.js';
import HttpError from '../util/http-error.js';
import { use } from 'react';

const registerUser = async (req, res, next) => {
    console.log('registering');
    const { name, email, password, jeux } = req.body;
    let existingUser;
    try {
        existingUser = await User.findOne({ email: email })
    } catch (err) {
        console.log(err);
        const error = new HttpError(
            'Enregistrement échoué, veuillez réessayer plus tard.',
            500
        )
        return next(error)
    }
    console.log('existingUser', existingUser);
    if (existingUser) {
        const error = new HttpError(
            'Un utilisateur avec cette adresse e-mail existe déjà.',
            422
        )
    }
    const createdUser = new User({
        name,
        email,
        password,
        jeux,
    });
    console.log('createdUser', createdUser);
    try {
        await createdUser.save();
    } catch (err) {
        console.log(err);
        const error = new HttpError(
            'Enregistrement échoué, veuillez réessayer plus tard.',
            500
        );
        return next(error);
    }
    res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
    const { email, password } = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({ email })
    } catch (err) {
        console.error(err);
        const error = new HttpError(
            'Échec de connexion, veuillez réessauer plus tard.',
            500
        );
        return next(error);
    }

    if (!existingUser || existingUser.password !== password) {
        const error = new HttpError(
            'Identification échouée, vérifiez vos identifiants.',
            401
        );
        return next(error);
    }

    let token;
    try {
        token = jwt.sign(
            { userId: existingUser.id, email: existingUser.email },
            'cleSuperSecrete!',
            { expiresIn: '1h' }
        );
    } catch (err) {
        const error = new HttpError(
            'Erreur lors de la génération du jeton. Réessayer plus tard.',
            500
        );
        return next(error);
    }

    res.status(200).json({
        userId: existingUser.id,
        email: existingUser.email,
        token,
    });
};

// Seulement pour le user profile, ne peut pas accéder aux profiles d'autres utilisateurs
const getUserById = async (req, res, next) => {
    const userId = req.params.pid;

    let user;

    try {
        user = await User.findById(userId).select('-password');
    } catch (e) {
        console.log(e);
        const err = new HttpError(
            'Une erreur BD est survenue',
            500
        );
        return next(err)
    }

    if (!user) {
        const err = new HttpError(
            'Utilisateur non disponible',
            404
        );
        return next(err);
    }

    res.json({ user: user.toObject({ getters: true }) })
};

const updateUserNameById = async (req, res, next) => {
    const { name } = req.body;
    const userId = req.params.uid;

    try {
        const user = await User.findByIdAndUpdate(
            userId,
            { name },
            { new: true, runValidators: true }
        );

        if (!user) {
            return next(new HttpError(
                'User non trouvé.',
                404)
            );
        }

        res.status(200).json({ user: user.toObject({ getters: true }) });
    } catch (err) {
        return next(new HttpError(
            'Une erreur BD est survenue.',
            500)
        );
    }

    res.status(200).json({ user: user.toObject({ getters: true }) });
};

const updateUserPictureById = async (req, res, next) => {
    const userId = req.params.uid;

    if (!req.file) {
        return next(new HttpError(
            'Aucun fichier image fourni.',
            422));
    }

    let user;
    try {
        user = await User.findByIdAndUpdate(
            userId,
            { profilePicture: req.file.path },
            { new: true }
        );
    } catch (err) {
        return next(new HttpError('Erreur lors de la mise à jour de l\'image.', 500));
    }

    if (!user) {
        return next(new HttpError('Utilisateur non trouvé.', 404));
    }

    res.status(200).json({ user: user.toObject({ getters: true }) });
};

export default {
    registerUser,
    login,
    getUserById,
    updateUserNameById,
    updateUserPictureById
};
