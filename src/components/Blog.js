import { useState } from 'react'
import blogsService from '../services/blogs'

const Blog = ({ username, blog, removeBlogEntry }) => {
	const [view, setView] = useState(false)
	const [currentLikes, setCurrentLikes] = useState(blog.likes)

	const handleLike = async (e) => {
		const data = { ...blog }
		data.likes = currentLikes + 1
		data.user = data.user.id

		e.target.disabled = true

		const updatedBlog = await blogsService.likeBlog(blog.id, data)

		e.target.disabled = false
		setCurrentLikes(updatedBlog.likes)
	}

	const handleDelete = (e) => {
		if (window.confirm(`Do you really want to delete ${blog.title}?`)) {
			e.target.disabled = true
			removeBlogEntry(blog)
		}
	}

	const toggleView = () => {
		setView(!view)
	}

	const details = () => {
		return (
			<>
				<div>{blog.url}</div>
				<div>
					likes {currentLikes} <button onClick={handleLike}>like</button>
				</div>
				<div>{blog.author}</div>

				{username === blog.user.username && <button onClick={handleDelete}>remove</button>}
			</>
		)
	}

	return (
		<div className="blogEntry">
			{blog.title} <button onClick={toggleView}>{view ? 'hide' : 'view'}</button>
			{view && details()}
		</div>
	)
}

export default Blog
