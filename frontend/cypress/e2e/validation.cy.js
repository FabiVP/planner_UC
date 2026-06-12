describe('Validation - Acceptance Tests', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('debe rechazar email sin formato válido', () => {
    cy.get('#email').clear().type('email-invalido');
    cy.get('#password').clear().type('password123');
    cy.get('#email').then(($el) => {
      expect($el[0].checkValidity()).to.be.false;
    });
  });

  it('debe rechazar formulario vacío', () => {
    cy.get('#email').clear();
    cy.get('#password').clear();
    cy.contains('button', 'Iniciar sesión').click();
    cy.get('#email').then(($el) => {
      expect($el[0].validationMessage).to.not.be.empty;
    });
  });

  it('debe requerir el campo password', () => {
    cy.get('#email').clear().type('admin@uni.edu');
    cy.get('#password').clear();
    cy.contains('button', 'Iniciar sesión').click();
    cy.get('#password').then(($el) => {
      expect($el[0].validationMessage).to.not.be.empty;
    });
  });
});
