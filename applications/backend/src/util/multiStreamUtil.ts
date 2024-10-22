import { Donation } from '@cp/common'
import SessionManager from '../SessionManager'

const multiStreams = [['icyvace', 'cherryylein']]

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
