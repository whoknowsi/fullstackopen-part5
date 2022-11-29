describe('Blog app', function () {
	const testUser = {
		name: 'Test User',
		username: 'username',
		password: 'password',
	}

	const testUserLogin = {
		username: 'username',
		password: 'password',
	}

	const testBlog = {
		title: 'TestBlog',
		author: 'TestAuthor',
		url: 'https://test.com',
		likes: 5,
	}

	const testBlog2 = {
		title: 'TestBlog2',
		author: 'TestAuthor2',
		url: 'https://test2.com',
		likes: 4,
	}

	beforeEach(function () {
		cy.request('POST', 'http://localhost:3001/api/testing/reset')
		cy.visit('http://localhost:3000')

		cy.request('POST', 'http://localhost:3001/api/users', testUser)
	})

	it('Login form is shown', function () {
		cy.contains('login').click()
		cy.contains('username')
		cy.contains('password')
	})

	describe('Login',function() {
		it('succeeds with correct credentials', function () {
			cy.contains('login').click()
			cy.get('#username').type(testUserLogin.username)
			cy.get('#password').type(testUserLogin.password)
			cy.get('#submit-button').click()
	
			cy.contains('Test User logged in')
		})
	
		it('fails with wrong credentials and shows notification with red border', function () {
			cy.contains('login').click()
			cy.get('#username').type(testUserLogin.username)
			cy.get('#password').type('wrong')
			cy.get('#submit-button').click()
	
			cy.contains('invalid username or password')
			cy.get('.notification').should('have.css', 'border', '3px solid rgb(255, 0, 0)')
		})

	})

	describe('When logged in', function () {
		beforeEach(function() {
			cy.request('POST', 'http://localhost:3001/api/login', testUserLogin)
				.then(response => {
					localStorage.setItem('user', JSON.stringify(response.body))
					cy.visit('http://localhost:3000')
				})
		})

		it('A blog can be created', function () {
			cy.contains('new blog').click()
			cy.get('#title').type(testBlog.title)
			cy.get('#author').type(testBlog.author)
			cy.get('#url').type(testBlog.url)
			cy.get('form').contains('create').click()

			cy.contains(`${testBlog.title} ${testBlog.author}`)
		})

		describe('and a blog exists', function () {
			beforeEach(function () {
				cy.request({
					url: 'http://localhost:3001/api/blogs',
					method: 'POST',
					body: testBlog,
					headers: {
						'Authorization': `bearer ${JSON.parse(localStorage.getItem('user')).token}`
					}
				})
				cy.visit('http://localhost:3000')
			})

			it('it can be liked', function () {
				cy.contains(`${testBlog.title} ${testBlog.author}`).parent().contains('view').click()
				cy.contains(`${testBlog.title} ${testBlog.author}`).parent().contains('like').click()
				cy.contains(`${testBlog.title} ${testBlog.author}`).parent().contains(`likes ${testBlog.likes}`)
			})

			it('it can be deleted if the blogs belongs to the current user', function () {
				cy.contains(`${testBlog.title} ${testBlog.author}`).parent().contains('view').click()
				cy.contains(`${testBlog.title} ${testBlog.author}`).parent().contains('remove').click()
				cy.get('html').should('not.contain', `${testBlog.title} ${testBlog.author}`)
			})
		})

		describe('and multiple blogs exist', function () {
			beforeEach(function () {
				cy.request({
					url: 'http://localhost:3001/api/blogs',
					method: 'POST',
					body: testBlog,
					headers: {
						'Authorization': `bearer ${JSON.parse(localStorage.getItem('user')).token}`
					}
				})
				cy.visit('http://localhost:3000')
				cy.request({
					url: 'http://localhost:3001/api/blogs',
					method: 'POST',
					body: testBlog2,
					headers: {
						'Authorization': `bearer ${JSON.parse(localStorage.getItem('user')).token}`
					}
				})
				cy.visit('http://localhost:3000')
			})

			it('the blogs are ordered by likes', function () {
				cy.get('.blogEntry').then(blogs => {
					cy.wrap(blogs[0]).contains(`${testBlog2.title} ${testBlog2.author}`)
					cy.wrap(blogs[1]).contains(`${testBlog.title} ${testBlog.author}`)
				})

				cy.contains(`${testBlog.title} ${testBlog.author}`).parent().contains('view').click()
				cy.contains(`${testBlog.title} ${testBlog.author}`).parent().contains('like').click()
				cy.contains(`${testBlog.title} ${testBlog.author}`).parent().contains('like').click()

				cy.get('.blogEntry').then(blogs => {
					cy.wrap(blogs[0]).contains(`${testBlog.title} ${testBlog.author}`)
					cy.wrap(blogs[1]).contains(`${testBlog2.title} ${testBlog2.author}`)
				})
			})
		})
	})
})