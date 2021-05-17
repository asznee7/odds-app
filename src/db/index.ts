import mongoose from 'mongoose';

mongoose.connect(process.env.MONGO_URI || 'mongodb://mongodb:27017/odds', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

const db = mongoose.connection;

export default db;
