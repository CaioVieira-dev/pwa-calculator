/// <reference types="cypress" />

describe("render",()=>{
    beforeEach(()=>{
        cy.visit("http://localhost:3000/")
    })

    it('displays "+" key',()=>{
        cy.get("button").contains("+").should('be.visible')
    })

    it('should sum two numbers',()=>{
        cy.get("button").contains("3").click();
        cy.get("button").contains("4").click();
        cy.get("button").contains("+").click();
        cy.get("button").contains("8").click();
        cy.get("button").contains("=").click();

        cy.get(".display").should("have.text","34 + 8 = 42")
    })

    it("should show the pre loaded memory",()=>{
        cy.get('select').select('2 + 2 = 4')
        cy.get(".display").should("have.text","2 + 2 = 4")


    })

})