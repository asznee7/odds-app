import { AsyncTask, SimpleIntervalJob, ToadScheduler } from 'toad-scheduler';
import { loadAndPersistMatches, loadInPlayMatches } from './core';

const logError = (e: any) => console.log(e);

const scheduler = new ToadScheduler();

export default function scheduleOddsUpdate() {
	scheduler.stop();

	const updateAllMatchesJob = new SimpleIntervalJob(
		{ hours: 1 },
		new AsyncTask('update_matches', loadAndPersistMatches, logError),
	);

	const updateInPlayMatchesJob = new SimpleIntervalJob(
		{ seconds: Number(process.env.IN_PLAY_ODDS_DELAY) || 120 },
		new AsyncTask('update_in-play_matches', loadInPlayMatches, logError),
	);

	scheduler.addSimpleIntervalJob(updateAllMatchesJob);
	scheduler.addSimpleIntervalJob(updateInPlayMatchesJob);
}
