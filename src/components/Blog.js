import { useState } from 'react'

const Blog = ({ username, blog, removeBlogEntry, updateBlogLikes }) => {
	const [view, setView] = useState(false)

	const handleLike = async (e) => {
		e.target.disabled = true
		await updateBlogLikes(blog)
		e.target.disabled = false
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
					likes {blog.likes} <button onClick={handleLike}>like</button>
				</div>
				<div>{blog.user.username}</div>
				{username === blog.user.username && <button onClick={handleDelete}>remove</button>}
			</>
		)
	}

	return (
		<div className="blogEntry">
			{blog.title} {blog.author} <button onClick={toggleView}>{view ? 'hide' : 'view'}</button>
			{view && details()}
		</div>
	)
}

export default Blog
