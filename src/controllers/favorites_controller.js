import UserModel from "../models/user_model.js";

export const toggleFavorite = async (req, res) => {
    try {
        const { movieId } = req.params;
        const userId = req.userId; // Aus dem Auth-Middleware

        if (!userId) {
            return res.status(401).json({
                errors: [{
                    path: 'auth',
                    message: "Benutzer nicht authentifiziert"
                }]
            });
        }

        if (!movieId || isNaN(Number(movieId))) {
            return res.status(400).json({
                errors: [{
                    path: 'movieId',
                    message: "Ungültige Film-ID"
                }]
            });
        }

        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                errors: [{
                    path: 'user',
                    message: "Benutzer nicht gefunden"
                }]
            });
        }

        const movieIdNumber = Number(movieId);
        const isFavorite = user.favorites.includes(movieIdNumber);

        let updatedFavorites;
        if (isFavorite) {
            // Film aus Favoriten entfernen
            updatedFavorites = user.favorites.filter(id => id !== movieIdNumber);
        } else {
            // Film zu Favoriten hinzufügen
            updatedFavorites = [...user.favorites, movieIdNumber];
        }

        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { favorites: updatedFavorites },
            { new: true }
        ).select('-password');

        return res.status(200).json({
            success: true,
            user: updatedUser,
            isFavorite: !isFavorite,
            message: isFavorite ? "Film aus Favoriten entfernt" : "Film zu Favoriten hinzugefügt"
        });

    } catch (error) {
        console.error("Toggle favorite error:", error);
        return res.status(500).json({
            errors: [{
                path: 'general',
                message: "Server-Fehler beim Aktualisieren der Favoriten"
            }]
        });
    }
};

export const getFavorites = async (req, res) => {
    try {
        const userId = req.userId; // Aus dem Auth-Middleware

        if (!userId) {
            return res.status(401).json({
                errors: [{
                    path: 'auth',
                    message: "Benutzer nicht authentifiziert"
                }]
            });
        }

        const user = await UserModel.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({
                errors: [{
                    path: 'user',
                    message: "Benutzer nicht gefunden"
                }]
            });
        }

        return res.status(200).json({
            success: true,
            favorites: user.favorites || []
        });

    } catch (error) {
        console.error("Get favorites error:", error);
        return res.status(500).json({
            errors: [{
                path: 'general',
                message: "Server-Fehler beim Abrufen der Favoriten"
            }]
        });
    }
};
