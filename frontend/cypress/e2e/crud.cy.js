describe('Data Management - Acceptance Tests', () => {
  it('debe mostrar página de campus cuando está autenticado', () => {
    cy.visit('/login');
    cy.get('#email').clear().type('admin@uni.edu');
    cy.get('#password').clear().type('admin123');
    cy.contains('button', 'Iniciar sesión').click();
    cy.url().should('not.include', '/login');
    cy.visit('/campus');
    cy.url().should('include', '/campus');
  });

  it('debe mostrar página de asignaturas cuando está autenticado', () => {
    cy.visit('/login');
    cy.get('#email').clear().type('admin@uni.edu');
    cy.get('#password').clear().type('admin123');
    cy.contains('button', 'Iniciar sesión').click();
    cy.visit('/courses');
    cy.url().should('include', '/courses');
  });

  it('debe mostrar página de aulas cuando está autenticado', () => {
    cy.visit('/login');
    cy.get('#email').clear().type('admin@uni.edu');
    cy.get('#password').clear().type('admin123');
    cy.contains('button', 'Iniciar sesión').click();
    cy.visit('/classrooms');
    cy.url().should('include', '/classrooms');
  });

  it('debe mostrar página de estudiantes cuando está autenticado', () => {
    cy.visit('/login');
    cy.get('#email').clear().type('admin@uni.edu');
    cy.get('#password').clear().type('admin123');
    cy.contains('button', 'Iniciar sesión').click();
    cy.visit('/students');
    cy.url().should('include', '/students');
  });

  it('debe mostrar página de docentes cuando está autenticado', () => {
    cy.visit('/login');
    cy.get('#email').clear().type('admin@uni.edu');
    cy.get('#password').clear().type('admin123');
    cy.contains('button', 'Iniciar sesión').click();
    cy.visit('/teachers');
    cy.url().should('include', '/teachers');
  });
});
