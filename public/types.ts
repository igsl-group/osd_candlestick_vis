/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */
import { IAggConfigs } from 'src/plugins/data/public';
import { PersistedState, Vis } from 'src/plugins/visualizations/public';

export interface ChartParams {
    priceField: string;
    timeField: string;
    interval: string;
}

export interface OptionParams {
    upColor: string;
    downColor: string;
    showRangeslider: boolean;
    yaxisUnit: string;
    yaxisPos: PlotlyAxisPosition;
    yaxisLabel: string;
}

export type VisParams = ChartParams & OptionParams;

export interface VisOptionsProps<VisParamType = unknown> {
    aggs: IAggConfigs;
    hasHistogramAgg: boolean;
    isTabSelected: boolean;
    stateParams: VisParamType;
    vis: Vis;
    uiState: PersistedState;
    setValue<T extends keyof VisParamType>(paramName: T, value: VisParamType[T]): void;
    setValidity(isValid: boolean): void;
    setTouched(isTouched: boolean): void;
}

export type PlotlyAxisPosition = 'top' | 'left' | 'right' | 'bottom';
