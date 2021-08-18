import {
    tags_to_test,
    names_to_test,
    all_names}
    from "../test-data/data.js";


//This can and should be optimized to avoid redundancy, using functions where possible; I avoided this for time's sake
//I do believe that the nature of these tests leans towards them being readable and self-documenting, either way.
describe('Filtering by name', () => {
    // start on a freshly loaded page each time
    beforeEach(() => {
        cy.visit('/')
        cy.get('.student-component-and-tags')
    })
    it('test inputting valid full name', () => {
        cy.get('input[id="search-by-name"]').type(all_names[0])
        cy.get('.student-component-and-tags').find('.student').should('have.length',1);
    })
    it('test inputting invalid text', () => {
        cy.get('input[id="search-by-name"]').type("Andrew Jones")
        cy.get('.student-component-and-tags').should('not.exist');
    })
    it('test clearing', () => {
        cy.get('input[id="search-by-name"]').type(all_names[0])
        cy.get('.student-component-and-tags').find('.student').should('have.length',1);
        cy.get('input[id="search-by-name"]').clear();
        cy.get('.student-component-and-tags').find('.student').should('have.length',25);
    })
    it('test inputting valid overlapping string', () => {
        cy.get('input[id="search-by-name"]').type(names_to_test[2])
        cy.get('.student-component-and-tags').find('.student').should('have.length',3);
    })

})

describe('Filtering by tag', () => {
    // start on a freshly loaded page each time
    beforeEach(() => {
        cy.visit('/')
    });
    it('test adding multiple tags', () => {
        cy.get('input[id="1-tag-input"]').type(tags_to_test[1]+'{enter}');
        cy.get('.student-component-and-tags').find('.tag').should('have.length',1);
        cy.get('input[id="1-tag-input"]').type(tags_to_test[2]+'{enter}');
        cy.get('.student-component-and-tags').find('.tag').should('have.length',2);
    })
    it('test searching for tag when there are no tags', () => {
        cy.get('input[id="search-by-tag"]').type(tags_to_test[1])
        cy.get('.student-component-and-tags').should('not.exist');
    })
    it('test searching for valid overlapping input of tags', () => {
        cy.get('input[id="1-tag-input"]').type(tags_to_test[1]+'{enter}');
        cy.get('input[id="2-tag-input"]').type(tags_to_test[2]+'{enter}');
        cy.get('input[id="search-by-tag"]').type("tag");
        cy.get('.student-component-and-tags').find('.student').should('have.length', 2);
    })
    it('test searching for invalid input tag', () => {
        cy.get('input[id="search-by-tag"]').type(all_names[0])
        cy.get('.student-component-and-tags').should('not.exist');
    })
    it('test clearing tag search field after successful adding and searching', () => {
        cy.get('input[id="1-tag-input"]').type(tags_to_test[1]+'{enter}');
        cy.get('input[id="2-tag-input"]').type(tags_to_test[2]+'{enter}');
        cy.get('input[id="search-by-tag"]').type("tag");
        cy.get('.student-component-and-tags').find('.student').should('have.length', 2);
        cy.get('input[id="search-by-tag"]').clear();
        cy.get('.student-component-and-tags').find('.student').should('have.length',25);
    })
})

describe('Filtering by combinations', () => {
    it('test adding tag, searching for names and searching for tags, then clearing', () => {
        cy.get('input[id="2-tag-input"]').type(tags_to_test[1]+'{enter}');
        cy.get('input[id="2-tag-input"]').type(tags_to_test[2]+'{enter}');
        cy.get('input[id="16-tag-input"]').type(tags_to_test[3]+'{enter}');
        cy.get('input[id="16-tag-input"]').type(tags_to_test[4]+'{enter}');
        cy.get('input[id="search-by-name"]').type(names_to_test[2]);
        cy.get('.student-component-and-tags').find('.student').should('have.length',3);
        cy.get('input[id="search-by-tag"]').type(tags_to_test[0]);
        cy.get('.student-component-and-tags').find('.student').should('have.length',2);
        cy.get('input[id="search-by-tag"]').type(tags_to_test[1].charAt(tags_to_test[1].length-1));
        cy.get('.student-component-and-tags').find('.student').should('have.length',1);
        cy.get('input[id="search-by-name"]').clear();
        cy.get('input[id="search-by-tag"]').clear();
        cy.get('.student-component-and-tags').find('.student').should('have.length',25);
    })
})