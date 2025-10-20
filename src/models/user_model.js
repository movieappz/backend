import mongoose from "mongoose";
import bcrypt from "bcrypt";



const user_model = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
    },
    username: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },

    createdAt: {
        type: Date,
        immutable: true,
        default: () => new Date(),
    },
    updatedAt: {
        type: Date,
        default: () => new Date(),
    },
    description: {
        type: String,
    },
    favorite_movies: {
        type: [String],
        default: []
    },
    profileCompleted: {
        type: Boolean,
        default: false
    },
});

user_model.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    if (this.password && this.password.startsWith("$2b$")) return next();
    this.password = await bcrypt.hash(this.password, 15);
    next();
});

export default mongoose.model("User", user_model);
