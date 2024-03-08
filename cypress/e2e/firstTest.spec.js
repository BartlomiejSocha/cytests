describe('Test with backend', () => {

    beforeEach('Login to application', () => {
        cy.intercept('GET', 'https://conduit-api.bondaracademy.com/api/tags', {fixture: 'tags.json'})
        cy.loginToApplication()
    })

    it('verify correct request and response', () =>{

        cy.intercept('POST', 'https://conduit-api.bondaracademy.com/api/articles/').as('postArticles')
        
        cy.contains('New Article').click()
        cy.get('[formcontrolname="title"]').type('This is a title')
        cy.get('[formcontrolname="description"]').type('This is a description')
        cy.get('[formcontrolname="body"]').type('This is a body of the article')
        cy.contains('Publish Article').click()

        cy.wait('@postArticles').then( xhr => {
          console.log(xhr)
          expect(xhr.response.statusCode).to.equal(201)
          expect(xhr.request.body.article.body).to.equal('This is a body of the article')
          expect(xhr.response.body.article.description).to.equal('This is a description')
        })

    })
    it.only('verify popular tags are displayed', () =>{
        cy.get('.tag-list')
        .should('contain', 'cypress')
        .and('contain', 'automation')
        .and('contain', 'testing')
    })

    it('verify global feed likes count', () => {
        cy.intercept('GET', 'https://conduit-api.bondaracademy.com/api/articles/feed*', {"articles":[],"articlesCount":0})
        cy.intercpet("GET", 'https://conduit-api.bondaracademy.com/api/articles*',)
    })

})