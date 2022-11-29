import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'

const testBlog = {
	title: 'title',
	author: 'author',
	url: 'url.com',
	likes: 5,
	user: {
		id: '635b46daba0f11c42964ba39',
		username: 'testing',
		name: 'test',
	},
}

test('render title and author of blog by default', () => {
	const component = render(<Blog blog={testBlog} username={testBlog.user.username} />)

	expect(component.container).toHaveTextContent(testBlog.title)
	expect(component.container).toHaveTextContent(testBlog.author)
})

test('not render url and likes by default', () => {
	const component = render(<Blog blog={testBlog} username={testBlog.user.username} />)

	expect(component.container).not.toHaveTextContent(testBlog.url)
	expect(component.container).not.toHaveTextContent(testBlog.likes)
})

test('render url and likes when view button is clicked', () => {
	const component = render(<Blog blog={testBlog} username={testBlog.user.username} />)
	const button = component.getByText('view')

	fireEvent.click(button)
	expect(component.container).toHaveTextContent(testBlog.url)
	expect(component.container).toHaveTextContent(testBlog.likes)
})

test('clicking like button once disabled likes button and waits to call the updatedBlogsLikes function and then the like button is enabled again', async () => {
	const updateBlogLikes = jest.fn()
	const component = render(<Blog blog={testBlog} username={testBlog.user.username} updateBlogLikes={updateBlogLikes}/>)
	const viewButton = component.getByText('view')
	fireEvent.click(viewButton)

	const likeButton = component.getByText('like')
	fireEvent.click(likeButton)

	expect(likeButton).toBeDisabled()
	expect(updateBlogLikes.mock.calls).toHaveLength(1)
	expect(await updateBlogLikes.mock.calls[0][0]).toBe(testBlog)
	expect(likeButton).toBeEnabled()
})
