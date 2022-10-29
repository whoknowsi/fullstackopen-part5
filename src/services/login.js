import axios from 'axios'
const baseUrl = '/api/login'

const login = async (username, password) => {
	const req = await axios.post(baseUrl, {
		username,
		password,
	})
	return req.data
}

export default {
	login,
}
