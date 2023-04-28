/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */
import {
  PluginInitializerContext,
  CoreSetup,
  CoreStart,
  Plugin,
  Logger,
} from '../../../src/core/server';

import { CandlestickChartPluginSetup, CandlestickChartPluginStart } from './types';
import { defineRoutes } from './routes';

export class CandlestickChartPlugin
  implements Plugin<CandlestickChartPluginSetup, CandlestickChartPluginStart> {
  private readonly logger: Logger;

  constructor(initializerContext: PluginInitializerContext) {
    this.logger = initializerContext.logger.get();
  }

  public setup(core: CoreSetup) {
    this.logger.debug('candlestick_chart: Setup');
    const router = core.http.createRouter();

    // Register server side APIs
    defineRoutes(router);

    return {};
  }

  public start(core: CoreStart) {
    this.logger.debug('candlestick_chart: Started');
    return {};
  }

  public stop() {}
}
