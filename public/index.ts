/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import './index.scss';

import { PluginInitializer } from 'opensearch-dashboards/public';
import {
  CandlestickChartVisPlugin,
  CandlestickChartVisSetup,
  CandlestickChartVisStart,
} from './plugin';

export { CandlestickChartVisPlugin as Plugin };

export const plugin: PluginInitializer<CandlestickChartVisSetup, CandlestickChartVisStart> = () =>
  new CandlestickChartVisPlugin();