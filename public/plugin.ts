/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  CoreSetup,
  CoreStart,
  HttpSetup,
  IUiSettingsClient,
  Plugin,
} from 'opensearch-dashboards/public';
import { VisualizationsSetup } from '../../../src/plugins/visualizations/public';
import { retriVisDefinition } from './visDefinition';

export interface SetupDependencies {
  visualizations: VisualizationsSetup;
}

export interface CandlestickVisDependencies extends Partial<CoreStart> {
  uiSettings: IUiSettingsClient;
  http: HttpSetup;
}

export class CandlestickChartVisPlugin
  implements Plugin<CandlestickChartVisSetup, CandlestickChartVisStart>
{
  public setup(core: CoreSetup, setupDeps: SetupDependencies) {
    const dependencies: CandlestickVisDependencies = {
      uiSettings: core.uiSettings,
      http: core.http,
    };
    setupDeps.visualizations.createReactVisualization(retriVisDefinition(dependencies));
  }

  public start() { }
  public stop() { }
}

export type CandlestickChartVisSetup = ReturnType<CandlestickChartVisPlugin['setup']>;
export type CandlestickChartVisStart = ReturnType<CandlestickChartVisPlugin['start']>;
