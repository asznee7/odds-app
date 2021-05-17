export interface IProcessEnv {
	ODDS_API_KEY: string;
	MONGO_URI: string;
	IN_PLAY_ODDS_DELAY: string;
}

declare global {
	namespace NodeJS {
		interface ProcessEnv extends IProcessEnv {}
	}
}

export default function checkEnv() {
	if (!process.env.ODDS_API_KEY) {
		throw new Error('Environment is missing variable ODDS_API_KEY');
	}

	if (process.env.IN_PLAY_ODDS_DELAY && isNaN(Number(process.env.IN_PLAY_ODDS_DELAY))) {
		throw new Error('Environment variable IN_PLAY_ODDS_DELAY must be a number');
	}
}
