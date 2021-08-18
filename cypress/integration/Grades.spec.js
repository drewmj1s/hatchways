import {}
    from "../test-data/data.js";

describe('Test expanding', () => {
    // start on a freshly loaded page each time
    beforeEach(() => {
        cy.visit('/')
        cy.get('.student-component-and-tags')
    })
    it('test expanding grades of one student', () => {
        cy.get('.student-component-and-tags').find('.student p').should('have.length',4*25);
        cy.get('button[id="1-expnd"]').click()
        cy.get('.student-component-and-tags').find('.student p').should('have.length',4*25 + 8);
    })
    it('test expanding and contracting grades of one student', () => {
        cy.get('.student-component-and-tags').find('.student p').should('have.length',4*25);
        cy.get('button[id="1-expnd"]').click()
        cy.get('.student-component-and-tags').find('.student p').should('have.length',4*25 + 8);
        cy.get('button[id="1-expnd"]').click()
        cy.get('.student-component-and-tags').find('.student p').should('have.length',4*25);
    })
    it('test that average was correct', () => {
        cy.get('button[id="1-expnd"]').click()
        let total = 0;
        let numvalues = 0;
        let average = 0;
        cy.get('#1-avg').nextAll().each((el)=>{
            total += parseInt(el[0].textContent.slice(-4), 10);
            numvalues++;
            average = total/numvalues;
        }).then(()=>{
            cy.get('#1-avg').should('have.text', "Average: " + average +"%")
        })

    })

})