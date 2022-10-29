import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Login from './components/Login'
import BlogForm from './components/BlogForm'
import blogsService from './services/blogs'
import Notification from './components/Notification'
import Togglable from './components/Togglable'

const App = () => {
	const [blogs, setBlogs] = useState([])
	const [user, setUser] = useState()
	const [message, setMessage] = useState('')
	const [notificationStatus, setNotificationStatus] = useState('')
	const [currentTimeOut, setCurrentTimeOut] = useState('')

	const newBlogEntryRef = useRef()

	useEffect(() => {
		const getblogs = async () => {
			const blogsFound = await blogsService.getAll()
			setBlogs(blogsFound.sort(sortByLikes))
		}
		getblogs()
	}, [])

	useEffect(() => {
		const foundUserLocalStorage = window.localStorage.getItem('user')
		if (foundUserLocalStorage) {
			const userParsed = JSON.parse(foundUserLocalStorage)
			blogsService.setToken(userParsed.token)
			setUser(userParsed)
		}
	}, [])

	const sortByLikes = (a, b) => {
		return a.likes - b.likes
	}

	const handleLogout = () => {
		window.localStorage.removeItem('user')
		blogsService.setToken('')
		setUser('')
	}

	const createBlogEntry = async (data) => {
		try {
			const newBlog = await blogsService.createBlogEntry(data)

			setNotification(`a new blog ${data.title} by ${data.author} added`, 'success')
			setBlogs([...blogs, newBlog].sort(sortByLikes))
			newBlogEntryRef.current.toggleVisibility()
		} catch (error) {
			setNotification(error.response.data.error, 'error')
		}
	}

	const removeBlogEntry = async (data) => {
		await blogsService.deleteBlog(data.id)
		setBlogs(blogs.filter((x) => x.id !== data.id))
	}

	const setNotification = (newMessage, newStatus) => {
		message && clearTimeout(currentTimeOut)

		const notificationTimeOut = setTimeout(() => {
			setMessage('')
			setNotificationStatus('')
			setCurrentTimeOut('')
		}, 3000)

		setMessage(newMessage)
		setNotificationStatus(newStatus)
		setCurrentTimeOut(notificationTimeOut)
	}

	const blogEntries = () => {
		return (
			<div>
				<h2>blogs</h2>
				<Notification message={message} notificationStatus={notificationStatus} />
				<p>
					{user.name} logged in <button onClick={handleLogout}>logout</button>
				</p>
				<Togglable buttonLabel="new blog" ref={newBlogEntryRef}>
					<BlogForm createBlogEntry={createBlogEntry} />
				</Togglable>
				{blogs.map((blog) => (
					<Blog
						key={blog.id}
						username={user.username}
						blog={blog}
						removeBlogEntry={removeBlogEntry}
					/>
				))}
			</div>
		)
	}

	return (
		<div>
			{user ? (
				blogEntries()
			) : (
				<Togglable buttonLabel="login">
					<Login
						setUser={setUser}
						setNotification={setNotification}
						message={message}
						notificationStatus={notificationStatus}
					/>
				</Togglable>
			)}
		</div>
	)
}

export default App
