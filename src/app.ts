import express from 'express';
import checkEnv from './utils/checkEnv';
import db from './db';
import { getOdds, loadAndPersistMatches, loadAndPersistSports } from './core/core';
import scheduleOddsUpdate from './core/scheduler';

checkEnv();

db.on('error', (e: any) => console.log(e));

db.once('open', async () => {
	await loadAndPersistSports();
	await loadAndPersistMatches();

	scheduleOddsUpdate();
});

const app = express();

app.get('/odds', async (req, res) => {
	const params = req.query as { matchId: string; bookmakerKey: string; marketKey: string };
	const { matchId, bookmakerKey, marketKey } = params;

	const odds = (await getOdds({ matchId, bookmakerKey, marketKey })) || { msg: 'Not found' };

	res.json(odds);
});

app.listen(8082);
