import jwt from 'jsonwebtoken';
import User from '../models/users.js';
import HttpError from '../util/http-error.js';

const registerUser = async (req, res, next) => {
    console.log('registering');
    const { name, email, password, profilePicture, forums } = req.body;

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
            'Un utilisateur avec cette adresse err-mail existe déjà.',
            422
        )

        return next(error);
    }

    const createdUser = new User({
        name,
        email,
        password,
        profilePicture: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
        forums: forums || [],
        messages: []
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
    const userId = req.params.uid;

    let user;

    try {
        user = await User.findById(userId).select('-password');
    } catch (err) {
        console.log(err);
        const error = new HttpError(
            'Une erreur BD est survenue',
            500
        );
        return next(error)
    }

    if (!user) {
        const error = new HttpError(
            'Utilisateur non disponible',
            404
        );
        return next(error);
    }

    res.status(200).json({ user: user.toObject({ getters: true }) })
};

const updateUserNameById = async (req, res, next) => {
    const { name } = req.body;
    const userId = req.params.uid;

    let user;
    try {
        user = await User.findByIdAndUpdate(
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
    } catch (err) {
        const error = new HttpError(
            'Une erreur BD est survenue.',
            500
        );

        return next(error);
    }

    res.status(200).json({ user: user.toObject({ getters: true }) });
};

const updateUserPictureById = async (req, res, next) => {
    const userId = req.params.uid;
    const { imagePath } = req.body;

    if (!imagePath) {
        const error = new HttpError(
            'Aucune URL fournie.',
            422
        );
        return next(error);
    }

    let user;
    try {
        user = await User.findByIdAndUpdate(
            userId,
            { profilePicture: imagePath },
            { new: true }
        );
    } catch (err) {
        const error = new HttpError(
            "Erreur lors de la mise à jour de l'image.",
            500
        );

        return next(error);
    }

    if (!user) {
        const error = new HttpError(
            'Utilisateur non trouvé.',
            404);

        return next(error);
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
