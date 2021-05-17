import fetch from 'node-fetch';
import { Sport } from '../models/sport';
import { Match } from '../models/match';
import { URLSearchParams } from 'url';

const apiKey = process.env.ODDS_API_KEY;
const apiBase = process.env.ODDS_API_BASE || 'https://api.the-odds-api.com';

enum Endpoints {
	SPORTS = 'sports',
	ODDS = 'odds',
}

interface IOddsAPIResponse {
	success: boolean;
	data?: unknown;
	status?: string;
	msg?: string;
}

async function genericFetch<T>(endpoint: Endpoints, params?: Record<string, string>) {
	try {
		const searchParams = new URLSearchParams({
			apiKey,
			...params,
		});

		const response = await fetch(`${apiBase}/v3/${endpoint}?${searchParams.toString()}`);

		if (response.ok) {
			const responseData: IOddsAPIResponse = await response.json();
			if (responseData.success) {
				return responseData.data as T[];
			}

			throw new Error(responseData.msg);
		}

		throw new Error(`Request failed with status: ${response.status}`);
	} catch (e) {
		console.log(e);
	}

	return [];
}

export const fetchSports = () => genericFetch<Sport>(Endpoints.SPORTS);

export const fetchMatches = async (sport: string = 'upcoming') =>
	genericFetch<Match>(Endpoints.ODDS, {
		region: 'uk',
		sport,
	});
