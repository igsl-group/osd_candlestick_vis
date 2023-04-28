/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

export const INDEX: string = 'candlestick-chart-e2e-test';
export const TEST_JSON_FILE: string = `.\\cypress\\e2e\\data\\${INDEX}.ndjson`;
export const DELAY: number = 1000;
export const CANDLESTICK_VIS_NAME: string = 'Candlestick Chart from Cypress ' + Math.random().toString(36).substring(2);
export const TIME_FILTER_QUERY_PARAM = "_g=(filters:!(),refreshInterval:(pause:!t,value:0),time:(from:'2023-03-15T16:00:00.000Z',to:'2023-04-18T16:00:00.000Z'))";