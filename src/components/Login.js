import loginService from '../services/login'
import blogsService from '../services/blogs'
import { useState } from 'react'
import Notification from './Notification'
import PropTypes from 'prop-types'

const Login = ({ setUser, setNotification, message, notificationType: notificationStatus }) => {
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')

	const handleLogin = async (e) => {
		e.preventDefault()
		try {
			const user = await loginService.login(username, password)

			window.localStorage.setItem('user', JSON.stringify(user))
			blogsService.setToken(user.token)
			setUser(user)
			setNotification('welcome ' + user.name, 'success')
			setUsername('')
			setPassword('')
		} catch (error) {
			setNotification(error.response.data.error, 'error')
		}
	}

	return (
		<div>
			<h2>Log in to application</h2>
			<Notification message={message} notificationStatus={notificationStatus} />
			<form onSubmit={handleLogin}>
				<div>
					username
					<input
						type="text"
						value={username}
						name="Username"
						onChange={({ target }) => setUsername(target.value)}
					></input>
				</div>
				<div>
					password
					<input
						type="password"
						value={password}
						name="Password"
						onChange={({ target }) => setPassword(target.value)}
					></input>
				</div>
				<button type="submit">login</button>
			</form>
		</div>
	)
}


Login.propTypes = {
	setUser: PropTypes.func.isRequired,
	setNotification: PropTypes.func.isRequired,
	message: PropTypes.string.isRequired,
	notificationStatus: PropTypes.string.isRequired,
}

export default Login
