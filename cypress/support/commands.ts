/// <reference types="cypress" />

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

const resizeObserverLoopErrRe = /^[^(ResizeObserver loop limit exceeded)]/;
Cypress.on('uncaught:exception', (err) => {
    /* returning false here prevents Cypress from failing the test */
    if (resizeObserverLoopErrRe.test(err.message)) {
        return false;
    }
});

const ADMIN_AUTH = {
    username: 'admin',
    password: 'admin'
};

Cypress.Commands.overwrite('visit', (originalFn, url, options) => {
    // Add the basic auth header when security enabled in the OpenSearch cluster
    // https://github.com/cypress-io/cypress/issues/1288
    if (Cypress.env('security_enabled')) {
        if (options) {
            options.auth = ADMIN_AUTH;
        } else {
            options = { auth: ADMIN_AUTH };
        }

        // Add query parameters - select the default OpenSearch Dashboards tenant
        options.qs = { security_tenant: 'private' };

        return originalFn(url, options);
    } else {
        return originalFn(url, options);
    }
});

// Be able to add default options to cy.request(), https://github.com/cypress-io/cypress/issues/726
Cypress.Commands.overwrite('request', (originalFn, ...args) => {
    let defaults: any = {};
    // Add the basic authentication header when security enabled in the OpenSearch cluster
    if (Cypress.env('security_enabled')) {
        defaults.auth = ADMIN_AUTH;
    }

    let options: any = {};

    if (typeof args[0] === 'object' && args[0] !== null) {
        options = Object.assign({}, args[0]);
    } else if (args.length === 1) {
        options.url = args['url'];
    } else if (args.length === 2) {
        options.method = args['method'];
        options.url = args['url'];
    } else if (args.length === 3) {
        options.method = args['method'];
        options.url = args['url'];
        options.body = args['body'];
    }

    return originalFn(Object.assign({}, defaults, options));
});