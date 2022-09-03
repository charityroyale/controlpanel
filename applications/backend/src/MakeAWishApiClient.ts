import fetch from 'node-fetch'
export const fetchMawData = async () => {
	try {
		const response = await fetch('https://streamer.make-a-wish.at/charityroyale2021/info.json')
		const data = await response.json()
		console.log(data)
	} catch (e) {
		console.log(e)
	}
}
