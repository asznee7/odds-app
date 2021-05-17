import { Schema, model } from 'mongoose';

export interface Site {
	site_key: string;
	site_nice: string;
	last_update: number;
	odds: Record<string, [number, number] | [number, number, number]>;
}

export interface SiteDocument extends Omit<Site, 'odds'> {
	odds: Map<string, [number, number] | [number, number, number]>;
}

export interface Match {
	id: string;
	sport_key: string;
	sport_nice: string;
	teams: [string, string];
	commence_time: string;
	home_team: string;
	sites: Site[];
}

export interface MatchDocument extends Omit<Match, 'sites'> {
	sites: SiteDocument[];
}

const SiteSchema = new Schema({
	site_key: String,
	site_nice: String,
	last_update: Number,
	odds: {
		type: Map,
		of: [Number],
	},
});

const MatchSchema = new Schema({
	id: String,
	sport_key: String,
	sport_nice: String,
	teams: [String, String],
	commence_time: Number,
	home_team: String,
	sites: [SiteSchema],
});

export default model<MatchDocument>('Match', MatchSchema);
