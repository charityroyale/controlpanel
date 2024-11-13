import { Donation } from '@cp/common'
import SessionManager from '../SessionManager'

const multiStreams = [
	['icyvace', 'cherryylein'],
	['xmrcr4zy', 's0ulrider'],
	['stephantschany', 'yourhostlaura'],
	[
		'a1esports',
		'a1esports-01',
		'a1esports-02',
		'a1esports-03',
		'a1esports-04',
		'a1esports-05',
		'a1esports-06',
		'a1esports-07',
		'a1esports-08',
	],
]

const flatMultiStreams = multiStreams.reduce((prev, curr) => prev.concat(curr), [])

export const isMultiStream = (streamer: string) => {
	return flatMultiStreams.includes(streamer.toLowerCase())
}

export const triggerDonationAlert = (sessionManager: SessionManager, targetChannel: string, donation: Donation) => {
	if (!isMultiStream(targetChannel)) {
		sessionManager.getOrCreateSession(targetChannel).triggerDonationAlert(donation)
		return
	}

	for (const multiStream of multiStreams) {
		if (multiStream.includes(targetChannel)) {
			for (const channel of multiStream) {
				sessionManager.getOrCreateSession(channel).triggerDonationAlert(donation)
			}
			return
		}
	}
}
