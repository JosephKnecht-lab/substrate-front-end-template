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

    cy.get('#root > div > div > div > div.MuiBox-root.css-0 > div.MuiGrid-root.MuiGrid-container.MuiGrid-spacing-xs-2.css-6npxnp-MuiGrid-root > div:nth-child(2) > div > div.MuiCardContent-root.css-jk4si8-MuiCardContent-root > div > button').should('have.text', "Show Metadata")
    cy.get('#root > div > div > div > div.MuiBox-root.css-0 > div.MuiGrid-root.MuiGrid-container.MuiGrid-spacing-xs-2.css-6npxnp-MuiGrid-root > div:nth-child(2) > div > div.MuiCardContent-root.css-jk4si8-MuiCardContent-root > div > button').click()


    cy.get('#modal-modal-title').should('have.text', 'Runtime Metadata')
  })

  it('can toggle between light/dark theme', () => {
    // This tests ensures that we can switch between light/dark mode

    cy.get('#root > div > div > div > div.MuiBox-root.css-1frfh3z > div > span > span.MuiButtonBase-root.MuiSwitch-switchBase.MuiSwitch-colorPrimary.PrivateSwitchBase-root.MuiSwitch-switchBase.MuiSwitch-colorPrimary.css-1psdadt-MuiButtonBase-root-MuiSwitch-switchBase > input').click()
    cy.get('#root > div > div > div > div.MuiBox-root.css-1frfh3z > div > span.MuiSwitch-root.MuiSwitch-sizeMedium.css-julti5-MuiSwitch-root > span.MuiButtonBase-root.MuiSwitch-switchBase.MuiSwitch-colorPrimary.PrivateSwitchBase-root.MuiSwitch-switchBase.MuiSwitch-colorPrimary.Mui-checked.css-qqho1c-MuiButtonBase-root-MuiSwitch-switchBase > input').click()

  })

  it('should be able to upload new WASM file', () => {
    // The following test aims to find the Wasm upload file,
    // to ensure that a new WASM file can be uploaded. 
    cy.get('#mui-6').click()
  })
})
