import NodeCache, { ValueSetItem } from 'node-cache';
import { Match } from '../models/match';

const oddsCache = new NodeCache();

export const getKey = (matchId: string, bookmakerId: string, key: string) =>
	`Data.[${matchId}].Odds[${bookmakerId}][${key}]`;

export function cacheOdds(matches: Match[]) {
	oddsCache.data = {};

	const data: ValueSetItem[] = [];
	matches.forEach((match) => {
		const matchId = match.id;
		const bookmakers = match.sites;
		bookmakers.forEach((bookmaker) => {
			const bookmakerId = bookmaker.site_key;
			const markets = bookmaker.odds;
			for (const key in markets) {
				const odds = markets[key];
				data.push({ key: getKey(matchId, bookmakerId, key), val: odds });
			}
		});
	});

	oddsCache.mset(data);
}

export default oddsCache;
