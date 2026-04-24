import { defaultMaxListeners } from "node:events";

// middleware/check-owner.js
const checkOwner = (req, res, next) => {
    if (req.params.uid !== req.userData.userId) {
        const error = new HttpError(
            'Accès non autorisé.',
            403
        );

        return next(error)
    }
    next();
};

export default checkOwner;