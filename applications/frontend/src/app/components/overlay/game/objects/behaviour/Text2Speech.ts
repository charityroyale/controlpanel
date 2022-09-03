import { SettingsState } from '@pftp/common'

export class Text2Speech {
	public speechSynthesisUtterance = new SpeechSynthesisUtterance()
	public isSpeaking = false
	private speechSynthesis = window.speechSynthesis

	constructor(language: string, volume: number) {
		this.setVolume(volume)
		this.setLanguage(language)

		this.onSpeakEnd = this.onSpeakEnd.bind(this)
		this.onSpeakStart = this.onSpeakStart.bind(this)

		this.init()
	}

	public init() {
		this.speechSynthesisUtterance.addEventListener('start', this.onSpeakStart)
		this.speechSynthesisUtterance.addEventListener('end', this.onSpeakEnd)
	}

	public onSpeakEnd() {
		this.isSpeaking = false
	}

	public onSpeakStart() {
		this.isSpeaking = true
	}

	public isSupported() {
		return 'speechSynthesis' in window
	}

	public getLanguages() {
		const voices = this.speechSynthesis.getVoices()
		return voices.map((voice) => voice.lang)
	}

	public speak(text: string) {
		this.speechSynthesisUtterance.text = text
		this.speechSynthesis.speak(this.speechSynthesisUtterance)
	}

	public setVolume(volume: number) {
		if (volume < 0 || volume > 1) return
		this.speechSynthesisUtterance.volume = volume
	}

	public setLanguage(voice: string) {
		if (!this.getLanguages().includes(voice)) return this.getLanguages()[0]
		this.speechSynthesisUtterance.lang = voice
	}

	public handleState(state: SettingsState) {
		if (this.speechSynthesisUtterance.volume !== state.text2speech.volume) {
			this.setVolume(state.text2speech.volume)
		}
		if (this.speechSynthesisUtterance.lang !== state.text2speech.language) {
			this.setLanguage(state.text2speech.language)
		}
	}
}
