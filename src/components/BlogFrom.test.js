import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import BlogFrom from './BlogForm'

test('<BlogForm /> updates parent state and calls onSubmit', () => {
	const createBlogEntry = jest.fn()

	const component = render(<BlogFrom createBlogEntry={createBlogEntry} />)

	const title = component.container.querySelector('#title')
	const author = component.container.querySelector('#author')
	const url = component.container.querySelector('#url')
	const form = component.container.querySelector('form')

	fireEvent.change(title, {
		target: { value: 'new title value' },
	})
	fireEvent.change(author, {
		target: { value: 'new author value' },
	})
	fireEvent.change(url, {
		target: { value: 'new url value' },
	})
	fireEvent.submit(form)

	expect(createBlogEntry.mock.calls).toHaveLength(1)
	expect(createBlogEntry.mock.calls[0][0].title).toBe('new title value')
	expect(createBlogEntry.mock.calls[0][0].author).toBe('new author value')
	expect(createBlogEntry.mock.calls[0][0].url).toBe('new url value')
})
