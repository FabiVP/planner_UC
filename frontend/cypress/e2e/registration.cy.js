describe('Registration - Acceptance Tests', () => {
  it('debe mostrar opciones de registro de acceso rápido', () => {
    cy.visit('/login');
    cy.contains('Coordinador').should('be.visible');
    cy.contains('Docente').should('be.visible');
    cy.contains('Estudiante').should('be.visible');
  });

  it('debe permitir acceso rápido como Coordinador', () => {
    cy.visit('/login');
    cy.contains('Coordinador').click();
    cy.get('#email').should('have.value', 'admin@uni.edu');
    cy.get('#password').should('have.value', 'admin123');
    cy.contains('button', 'Iniciar sesión').click();
    cy.url().should('not.include', '/login');
  });

  it('debe permitir acceso rápido como Docente', () => {
    cy.visit('/login');
    cy.contains('Docente').click();
    cy.get('#email').should('not.be.empty');
    cy.get('#password').should('not.be.empty');
  });

  it('debe permitir acceso rápido como Estudiante', () => {
    cy.visit('/login');
    cy.contains('Estudiante').click();
    cy.get('#email').should('not.be.empty');
    cy.get('#password').should('not.be.empty');
  });

  it('debe mostrar el formulario con los campos requeridos', () => {
    cy.visit('/login');
    cy.get('form').should('exist');
    cy.get('#email').should('have.attr', 'required');
    cy.get('#password').should('have.attr', 'required');
  });
});
