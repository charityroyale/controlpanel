export interface CmsContent {
	title: string
	date: string
	thumbnail: string
	featuredStream: string
	customDonationLink?: string
	featuredYoutubeStream?: string
	upcoming: CmsUpcomingStreamer[]
	wishes: MakeAWishWish[]
	faq: {
		'questions-de': FAQEntryDe[]
		'questions-en': FAQEntryEn[]
		videos: FAQVideoEntry[]
	}
}

export type StreamerType = 'main' | 'community'

export interface CmsUpcomingStreamer {
	streamerName: string
	streamerChannel: string
	streamLink: string
	customLink?: string
	imgUrl: string
	date: string
	type: StreamerType
	wishes?: string[]
}

export interface UpcomingStreamerDonationPage {
	streamerName: string
	streamerChannel: string
	streamLink: string
	customLink?: string
	imgUrl: string
	date: string
	wishes: MakeAWishWish[]
}

export interface FAQEntryDe {
	'question-de': string
	'answer-de': string
}

export interface FAQEntryEn {
	'question-en': string
	'answer-en': string
}

export interface FAQVideoEntry {
	url: string
	name: string
}

export interface MakeAWishWish {
	slug: string
	tagline: string
	childname: string
	descripion: string
	donationGoal: string
	streamers?: string[]
}
