import { Schema, model } from 'mongoose';

export interface Sport {
	key: string;
	active: boolean;
	group: string;
	details: string;
}

const SportSchema = new Schema({
	key: String,
	active: Boolean,
	group: String,
	details: String,
});

export default model<Sport>('Sport', SportSchema);
