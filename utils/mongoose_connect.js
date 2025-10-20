import mongoose from "mongoose";

let isConnected = false;

async function connectToMongoose() {
    if (isConnected) {
        return true;
    }

    try {
        let _uri;

        if (process.env.MONGODB_URI) {
            _uri = process.env.MONGODB_URI;
        } else {
            const _pwd = process.env.MONGO_DB_PWD;
            const _database = "vz_wa";
            const _user = "admin_movie_db";
            const _cluster = "moviescluster.cn5kxis.mongodb.net";
            _uri = `mongodb+srv://${_user}:${_pwd}@${_cluster}/${_database}?retryWrites=true&w=majority`;
        }


        await mongoose.connect(_uri, {
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
            connectTimeoutMS: 10000,
        });

        await mongoose.connection.asPromise();

        isConnected = true;

        if (mongoose.connection.db) {
            const collections = (
                await mongoose.connection.db.listCollections().toArray()
            ).map((el) => el.name);
        } else {
            console.error('Database connection established but db object not available yet');
        }

        return true;
    } catch (error) {
        console.error("Could not connect to mongoose", error);
        console.error("Error details:", {
            name: error.name,
            message: error.message,
            code: error.code
        });
        isConnected = false;
        return false;
    }
}

export default connectToMongoose;