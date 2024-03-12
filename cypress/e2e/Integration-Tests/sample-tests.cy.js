/// <reference types="cypress" />


// To learn more about how Cypress works and
// what makes it such an awesome testing tool,
// please read our getting started guide:
// https://on.cypress.io/introduction-to-cypress

describe('End-to-end Integration tests', () => {
  beforeEach(() => {
    // Cypress starts out with a blank slate for each test
    // so we must tell it to visit our website with the `cy.visit()` command.
    // Since we want to visit the same URL at the start of all our tests,
    // we include it in our beforeEach function so that it runs before each test
    cy.visit('http://localhost:8000/substrate-front-end-template')
  })

  it('can show metadata', () => {
    // The following test ensures that we can see the Metadata JSON object.

    cy.get('[data-cy="show-metadata"]').should('have.text', "Show Metadata")
    cy.get('[data-cy="show-metadata"]').click()

    cy.get('[data-cy="modal-title"]').should('have.text', 'Runtime Metadata')
  })

  it('should be able to upload new WASM file', () => {
    // The following test aims to find the Wasm upload file,
    // to ensure that a new WASM file can be uploaded. 
    cy.get('[data-cy="choose-file"]').click()
  })
})
