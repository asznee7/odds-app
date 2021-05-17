import { fetchMatches, fetchSports } from '../api';
import db from '../db';
import Match, { Match as MatchType, Site as BookmakerType } from '../models/match';
import Sport from '../models/sport';
import oddsCache, { cacheOdds, getKey } from './cache';

export async function loadAndPersistSports() {
	// does not affect the quata usage
	const fetchedSports = await fetchSports();

	if (!fetchedSports.length) return;

	const session = await db.startSession();
	session.startTransaction();
	await Sport.deleteMany();
	await Sport.insertMany(fetchedSports);
	await session.commitTransaction();
	session.endSession();
}

export async function loadAndPersistMatches() {
	const sports = await Sport.find();
	const matches = await Match.find();

	const fetchedMatches: MatchType[] = [];

	// runninng this subsequently to not hit the limit, there's probably a better solution
	for (const sport of sports) {
		const result = await fetchMatches(sport.key);
		fetchedMatches.push(...result);
	}

	if (!fetchedMatches.length) return;

	const session = await db.startSession();
	session.startTransaction();
	await Match.deleteMany();
	await Match.insertMany(fetchedMatches);
	await session.commitTransaction();
	session.endSession();
}

export async function loadInPlayMatches() {
	const inPlayMatches = await fetchMatches();

	if (!inPlayMatches.length) return;

	cacheOdds(inPlayMatches);

	const session = await db.startSession();
	session.startTransaction();
	await Match.deleteMany({ id: { $in: inPlayMatches.map(({ id }) => id) } });
	await Match.insertMany(inPlayMatches);
	await session.commitTransaction();
	session.endSession();
}

export async function getOdds({
	matchId,
	bookmakerKey,
	marketKey = 'h2h',
}: {
	matchId: string;
	bookmakerKey: string;
	marketKey?: string;
}) {
	return (
		oddsCache.get<BookmakerType['odds']>(getKey(matchId, bookmakerKey, marketKey)) ||
		// fallback to database
		(await Match.findOne({ id: matchId }))?.sites
			.find((s) => s.site_key === bookmakerKey)
			?.odds.get(marketKey)
	);
}
