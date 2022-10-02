export interface GlobalState {
	donationAlert: DonationAlertState
	donationWidget: DonationWidgetState
	settings: SettingsState
}

export interface SettingsState {
	volume: number
	isLockedOverlay: boolean
	text2speech: {
		volume: number
		minDonationAmount: number
		language: SpeakerType
	}
}

export interface DonationAlertState {
	isVisible: boolean
	scale: number
	position: {
		x: number
		y: number
	}
}

export interface DonationWidgetState {
	isVisible: boolean
	scale: number
	position: {
		x: number
		y: number
	}
	wish: {
		slug: string
		info?: MakeAWishRootLevelWishDTO
	} | null
}

/**
 * Sync with /donation endpoint
 */
export interface Donation {
	id: number
	user: string
	amount: number
	amount_net: number // netto - pure without taxes
	message: string
	streamer: string
	timestamp: number
	fullFilledWish: boolean
}

export interface UserEntry {
	streamer: string
	channel: string
}

export const DONATION_ALERT_UPDATE = 'donationAlertUpdate'
export const DONATION_WIDGET_UPDATE = 'donationWidgetUpdate'
export const SETTINGS_UPDATE = 'settingsUpdate'
export const STATE_UPDATE = 'stateUpdate'
export const REQUEST_STATE = 'requestState'
export const REQUEST_MAW_INFO_JSON_DATA = 'requestMawInfoJsonData'
export const DONATION_TRIGGER = 'donationTrigger'
export const MAW_INFO_JSON_DATA_UPDATE = 'mawJsonDataUpdate'
export const REQUEST_CMS_DATA = 'requestCmsData'
export const CMS_UPDATE = 'cmsUpdate'
export const REQUEST_DONATION_TRIGGER = 'requestDonationTrigger'

export interface SocketEventsMap {
	[DONATION_ALERT_UPDATE]: (donationAlertUpdate: Partial<DonationAlertState>) => void
	[DONATION_WIDGET_UPDATE]: (donationWidgetUpdate: Partial<DonationWidgetState>) => void
	[SETTINGS_UPDATE]: (settingsUpdate: Partial<SettingsState>) => void
	[STATE_UPDATE]: (state: GlobalState) => void
	[REQUEST_STATE]: () => void
	[REQUEST_MAW_INFO_JSON_DATA]: () => void
	[DONATION_TRIGGER]: (donation: Donation) => void
	[REQUEST_DONATION_TRIGGER]: (donation: Donation) => void
	[MAW_INFO_JSON_DATA_UPDATE]: (mawInfoJsonData: MakeAWishInfoJsonDTO) => void
	[REQUEST_CMS_DATA]: () => void
	[CMS_UPDATE]: (cmsStreamerWishSlugs: string[]) => void
}

export interface SocketJwtPayload {
	channel: string
	mode: 'read' | 'readwrite'
}

export type StreamerType = 'main' | 'community'
/**
 * Clientside DTO
 * Latest changes and updates
 */
export class MakeAWishInfoJsonDTO {
	public id = '' // some MAW internal ID
	public total_donation_sum = '' // sum of donations
	public total_donation_sum_net = '' // sum of donations netto - without taxes - pure
	public total_donation_count = -1 // count of unqique donators
	public last_update = -1 // unix timestamp of latest update
	// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
	public streamers = {} as { [streamerSlug: string]: MakeAWishStreamerDTO }
	// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
	public wishes = {} as { [wishSlug: string]: MakeAWishRootLevelWishDTO }
	public recent_donations: MakeWishInfoJsonRecentDonationDTO[] = [] // latest 10 donations made over all wishes
	public top_donors: MakeAWishInfoJsonTopDonationDTO[] = [] // top 10 donations made over all wishes
}

// Streamer DTOs
export class MakeAWishWishStreamerDTO {
	public id = -1 // some MAW internal ID
	public current_donation_sum = ''
	public slug = '' // identifier, streamchannel twitch in lower case
	public current_donation_count = -1
	public top_donors: MakeAWishInfoJsonTopDonationDTO[] = []
	public recent_donations: MakeWishInfoJsonRecentDonationDTO[] = []
}

export class MakeAWishStreamerDTO {
	public id = -1 // some MAW internal ID
	public color = '' // some MAW internal color code
	public slug = '' // identifier, streamchannel twitch in lower case
	public name = '' // streamer name
	public type: StreamerType = 'main' // 'main' or 'community'
	public current_donation_sum = ''
	public current_donation_sum_net = '0'
	public current_donation_count = -1
	public top_donors: MakeAWishInfoJsonTopDonationDTO[] = []
	public recent_donations: MakeWishInfoJsonRecentDonationDTO[] = []
	public wishes: [] | { [wishSlug: string]: MakeAWishStreamerWishDTO } = []
}

// Wish DTOs
export class MakeAWishRootLevelWishDTO {
	public id = -1 // some MAW internal ID
	public color = '' // some MAW internal color code
	public slug = '' // identifier
	public kid_name = ''
	public wish = '' // MAW internal title of wish
	public donation_goal = ''
	public country = '' // DE | AT
	public current_donation_sum = '0'
	public current_donation_sum_net = '0'
	public current_donation_count = -1
	public recent_donations: MakeWishInfoJsonRecentDonationDTO[] = []
	public top_donors: MakeAWishInfoJsonTopDonationDTO[] = []
	public streamers: [] | { [streamerSlug: string]: MakeAWishWishStreamerDTO } = [] // streamers who are fullfilling this wish
}

export class MakeAWishStreamerWishDTO {
	public id = -1 // some MAW internal ID
	public slug = '' // identifier
	public current_donation_sum = '0'
	public current_donation_sum_net = '0'
	public current_donation_count = -1
	public recent_donations: MakeWishInfoJsonRecentDonationDTO[] = []
	public top_donors: MakeAWishInfoJsonTopDonationDTO[] = []
}

// Donation DTOs
export class MakeWishInfoJsonRecentDonationDTO {
	public unix_timestamp = -1
	public username = ''
	public amount = ''
	public amount_net = ''
}

export class MakeAWishInfoJsonTopDonationDTO {
	public username = ''
	public amount_net = '' // netto - pure - without taxes --> ! will be renamed by MAW
}

export const TTS_SPEAKER = {
	'0': {
		languageCode: 'de-DE',
		voice: 'de-DE-Wavenet-C',
		ssmlGender: 'FEMALE',
		label: 'Sissi (German)',
	},
	'1': {
		languageCode: 'de-DE',
		voice: 'de-DE-Wavenet-B',
		ssmlGender: 'MALE',
		label: 'Alex (German)',
	},
	'2': {
		languageCode: 'en-US',
		voice: 'en-US-Wavenet-H',
		ssmlGender: 'FEMALE',
		label: 'Corinna (English)',
	},
	'3': {
		languageCode: 'en-US',
		voice: 'en-US-Wavenet-D',
		ssmlGender: 'MALE',
		label: 'Patrick (English)',
	},
}

export type SpeakerType = '0' | '1' | '2' | '3'

export interface Speaker {
	languageCode: string
	voice: string
	ssmlGender: string
	label: string
}

export const TTS_SPEAKER_SELECT_ITEMS = Object.keys(TTS_SPEAKER).map((key) => {
	return { label: TTS_SPEAKER[key as SpeakerType].label, value: key }
})
