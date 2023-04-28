/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

/// <reference types="cypress" />

import * as Settings from './settings';

describe('Create test data', () => {
  it('Indexes test data for candlestick chart', () => {
    (function () {
      cy.readFile(Settings.TEST_JSON_FILE).then((json) => {
        cy.request({
          method: 'POST',
          url: '/api/console/proxy',
          headers: {
            'content-type': 'application/json;charset=UTF-8',
            'osd-xsrf': true
          },
          qs: {
            path: `${Settings.INDEX}/_bulk`,
            method: 'POST',
          },
          body: json
        });
      });
    })();

    cy.request({
      method: 'POST',
      failOnStatusCode: false,
      url: `/api/saved_objects/index-pattern/${Settings.INDEX}`,
      headers: {
        'content-type': 'application/json',
        'osd-xsrf': true
      },
      body: JSON.stringify({ attributes: { title: Settings.INDEX, timeFieldName: '@timestamp' } }),
    });
  });
});

describe('Save Visualization', () => {
  beforeEach(() => {
    cy.visit(`/app/visualize#?${Settings.TIME_FILTER_QUERY_PARAM}`);
    cy.wait(Settings.DELAY * 5);
  });

  it('Creates and saves a candlestick chart', () => {
    cy.get('.euiButton__text').contains('Create visualization').click({ force: true });
    cy.wait(Settings.DELAY * 5);
    cy.get('span[data-test-subj="visTypeTitle"]').contains('Candlestick Chart').click({ force: true });
    cy.wait(Settings.DELAY * 5);
    cy.get('.euiListGroupItem__label')
      .contains(Settings.INDEX)
      .click({ force: true });
    cy.wait(Settings.DELAY * 5);
    cy.get('.euiButton__text').contains('Save').click({ force: true });
    cy.wait(Settings.DELAY);
    cy.get('input[data-test-subj="savedObjectTitle"]').type(Settings.CANDLESTICK_VIS_NAME);
    cy.wait(Settings.DELAY);
    cy.get('button[data-test-subj="confirmSaveSavedObjectButton"]').click({ force: true });
    cy.wait(Settings.DELAY * 3);

    cy.get('.euiToastHeader__title').contains('Saved').should('exist');
  });
});

describe('Render Chart', () => {
  beforeEach(() => {
    cy.visit(`/app/visualize#?${Settings.TIME_FILTER_QUERY_PARAM}`);
    cy.wait(Settings.DELAY * 5);
    cy.get('a').contains(Settings.CANDLESTICK_VIS_NAME).click({ force: true });
    cy.wait(Settings.DELAY * 5);
  });

  it('Render No Data case', () => {
    cy.get('.euiTitle').contains('No data').should('exist');
  });

  it('Renders Candlestick chart', () => {
    cy.get('button.euiSuperSelectControl').eq(0).click({ force: true });
    cy.wait(Settings.DELAY);
    cy.get('.euiContextMenuItem__text')
      .contains(/^price$/)
      .click({ force: true });
    cy.wait(Settings.DELAY);
    cy.get('button.euiSuperSelectControl').eq(1).click({ force: true });
    cy.wait(Settings.DELAY);
    cy.get('.euiContextMenuItem__text')
      .contains(/^@timestamp$/)
      .click({ force: true });
    cy.wait(Settings.DELAY);
    cy.get('button[data-test-subj="comboBoxToggleListButton"]').eq(0).click({ force: true });
    cy.wait(Settings.DELAY);
    cy.get('.euiComboBoxOption__content')
      .contains(/^Day$/)
      .click({ force: true });
    cy.wait(Settings.DELAY);

    cy.get('.euiButton__text').contains('Update').click({ force: true });
    cy.wait(Settings.DELAY);

    cy.get('#plotly-candlestick-chart').should('exist');

    cy.get('.euiButton__text').contains('Save').click({ force: true });
    cy.wait(Settings.DELAY);
    cy.get('button[data-test-subj="confirmSaveSavedObjectButton"]').click({ force: true });
    cy.wait(Settings.DELAY * 3);
  });
});

describe('Configure panel settings', () => {
  beforeEach(() => {
    cy.visit(`/app/visualize#?${Settings.TIME_FILTER_QUERY_PARAM}`);
    cy.wait(Settings.DELAY * 5);
    cy.get('a').contains(Settings.CANDLESTICK_VIS_NAME).click({ force: true });
    cy.wait(Settings.DELAY * 5);
    cy.get('.euiTab__content').contains('Panel settings').click({ force: true });
    cy.wait(Settings.DELAY);
  });

  it('Changes Y-axis', () => {
    cy.get('input.euiFieldText').eq(0).focus().type('$');
    cy.wait(Settings.DELAY);
    cy.get('.euiButton__text').contains('Update').click({ force: true });
    cy.wait(Settings.DELAY);

    cy.get('.ytick text').eq(0).contains('$');
  });

  it('Changes Settings', () => {
    cy.get('.euiSwitch__label').contains('Show Rangeslider').click({ force: true });
    cy.wait(Settings.DELAY);
    cy.get('.euiButton__text').contains('Update').click({ force: true });
    cy.wait(Settings.DELAY);

    cy.get('.rangeslider-container').should('exist');
  });
});

describe('Add chart to dashboard', () => {
  it('Adds candlestick chart to dashboard', () => {
    cy.visit(`/app/dashboards#/create?${Settings.TIME_FILTER_QUERY_PARAM}`);
    cy.wait(Settings.DELAY * 5);

    cy.get('.euiLink').contains('Add an existing').click({ force: true });
    cy.wait(Settings.DELAY);
    cy.get('input[data-test-subj="savedObjectFinderSearchInput"]').focus().type(Settings.CANDLESTICK_VIS_NAME);
    cy.wait(Settings.DELAY);
    cy.get(`.euiListGroupItem__label[title="${Settings.CANDLESTICK_VIS_NAME}"]`).click({ force: true });
    cy.wait(Settings.DELAY);
  });
});