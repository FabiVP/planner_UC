describe('Navigation - Acceptance Tests', () => {
  it('debe redirigir al login si no está autenticado', () => {
    cy.visit('/');
    cy.url().should('include', '/login');
  });

  it('debe mostrar página 404 para rutas inexistentes', () => {
    cy.visit('/ruta-que-no-existe', { failOnStatusCode: false });
    cy.get('body').should('be.visible');
  });
});
