describe('Login - Acceptance Tests', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('debe mostrar el formulario de login con campos email y password', () => {
    cy.get('form').should('exist');
    cy.get('#email').should('be.visible');
    cy.get('#password').should('be.visible');
    cy.contains('button', 'Iniciar sesión').should('be.visible');
  });

  it('debe mostrar enlace de acceso rápido para los 3 roles', () => {
    cy.contains('Coordinador').should('be.visible');
    cy.contains('Docente').should('be.visible');
    cy.contains('Estudiante').should('be.visible');
  });

  it('debe mostrar error con credenciales inválidas', () => {
    cy.get('#email').clear().type('invalido@test.com');
    cy.get('#password').clear().type('wrongpass');
    cy.contains('button', 'Iniciar sesión').click();
    cy.get('.login-error').should('be.visible');
  });

  it('debe mostrar spinner de carga al enviar formulario', () => {
    cy.get('#email').clear().type('admin@uni.edu');
    cy.get('#password').clear().type('admin123');
    cy.contains('button', 'Iniciar sesión').click();
    cy.get('.spinner').should('be.visible');
  });

  it('debe deshabilitar botón de submit mientras carga', () => {
    cy.get('#email').clear().type('admin@uni.edu');
    cy.get('#password').clear().type('admin123');
    cy.contains('button', 'Iniciar sesión').click();
    cy.contains('button', 'Iniciar sesión').should('be.disabled');
  });

  it('debe llenar campos automáticamente al usar acceso rápido', () => {
    cy.contains('Coordinador').click();
    cy.get('#email').should('have.value', 'admin@uni.edu');
    cy.get('#password').should('have.value', 'admin123');
  });
});
