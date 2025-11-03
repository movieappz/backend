export const logoutController = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            sameSite: "none",
            secure: process.env.NODE_ENV === "production",
            path: "/"
        });

        return res.status(200).json({ success: true });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};


