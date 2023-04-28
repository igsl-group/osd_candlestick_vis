/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */
import { CandlestickChart } from './components/candlestickChart';
import { ChartEditor } from './components/chartEditor';
import { OptionsEditor } from './components/optionsEditor';
import { CandlestickVisDependencies } from "./plugin";

import { IUiSettingsClient } from 'opensearch-dashboards/public';
import {
    buildOpenSearchQuery,
    Filter,
    getTime,
    OpenSearchQueryConfig,
    Query,
    TimeRange,
} from '../../../src/plugins/data/common';
import { IndexPattern } from 'src/plugins/data/public';
import { VisParams } from 'src/plugins/visualizations/public';

export interface CandlestickChartTimeData {
    time: string;
    openDoc: any;
    closeDoc: any;
    high: number;
    low: number;
}

export interface CandlestickChartQueryResp {
    by_time: CandlestickChartTimeData[];
}

interface CandlestickChartQueryParams {
    timeRange: TimeRange;
    filters: Filter[];
    query: Query;
    index: IndexPattern;
    visParams: VisParams;
    forceFetch?: boolean;
}

const retriVisReqHandler = ({ uiSettings, http }: CandlestickVisDependencies) => {
    return async (params: CandlestickChartQueryParams) => {
        if (!params.visParams.priceField
            || !params.visParams.timeField
            || !params.visParams.interval) {
            return 'none';
        }

        const request = constructRequest(uiSettings, params);

        return http
            .post('../api/candlestick_chart_vis/query', {
                body: JSON.stringify(request),
            })
            .catch((error) => console.error(error));
    };
};

const constructRequest = (
    uiSettings: IUiSettingsClient,
    { timeRange, filters, query, index, visParams }: CandlestickChartQueryParams
) => {
    let DSL;
    try {
        const config: OpenSearchQueryConfig = {
            allowLeadingWildcards: uiSettings.get('query:allowLeadingWildcards'),
            queryStringOptions: uiSettings.get('query:queryString:options'),
            ignoreFilterIfFieldNotInIndex: uiSettings.get('courier:ignoreFilterIfFieldNotInIndex'),
        };
        DSL = buildOpenSearchQuery(index, query, filters, config);
    } catch (error) {
        DSL = buildOpenSearchQuery(index, query, filters);
    }

    const request: any = {
        index: index.title,
        size: 0,
        body: {
            sort: [] as any,
            query: DSL,
        },
    };

    const timeFilter = getTime(index, timeRange);

    if (timeFilter && timeFilter.range) {
        request.body.query.bool.must.push({
            range: timeFilter.range,
        });
    }

    request.body.aggs = constrAggsReqField(visParams);

    return request;
};

const constrAggsReqField = (visParams: VisParams): any => {
    return {
        by_time: {
            date_histogram: {
                field: visParams.timeField,
                calendar_interval: visParams.interval
            },
            aggs: {
                open: {
                    top_hits: {
                        size: 1,
                        sort: [{
                            [visParams.timeField]: { order: 'asc' }
                        }]
                    }
                },
                close: {
                    top_hits: {
                        size: 1,
                        sort: [{
                            [visParams.timeField]: { order: 'desc' }
                        }]
                    }
                },
                high: {
                    max: { field: visParams.priceField }
                },
                low: {
                    min: { field: visParams.priceField }
                }
            }
        }
    };
};

const retriVisRespHandler =
    () =>
        async ({ aggregations }: { aggregations: any }) => {
            if (!aggregations) {
                return {};
            }

            let by_time: CandlestickChartTimeData[] = aggregations.by_time.buckets
                .filter((bucket: any) => bucket.doc_count > 0)
                .map((bucket: any) => {
                    return {
                        time: bucket.key_as_string,
                        openDoc: bucket.open.hits.hits[0]._source,
                        closeDoc: bucket.close.hits.hits[0]._source,
                        high: bucket.high.value,
                        low: bucket.low.value
                    } as CandlestickChartTimeData;
                });

            const responseData: CandlestickChartQueryResp = {
                by_time
            };

            return responseData;
        };


export function retriVisDefinition(dependencies: CandlestickVisDependencies) {
    const visReqHandler = retriVisReqHandler(dependencies);
    const visRespHandler = retriVisRespHandler();
    const defaultChartParams: VisParams = {
        upColor: '#00FF00',
        downColor: '#FF0000',
        yaxisPos: 'left',
        showRangeslider: false,
        priceField: '',
        timeField: '',
        interval: '',
        yaxisUnit: '',
        yaxisLabel: ''
    };

    return {
        name: 'candlestick_chart_vis',
        title: 'Candlestick Chart',
        icon: 'visVega',
        description: 'This visualization allows you to create a Candlestick chart',
        visConfig: {
            component: CandlestickChart,
            defaults: defaultChartParams
        },
        editorConfig: {
            optionTabs: [
                {
                    name: 'chartEditor',
                    title: 'Data',
                    editor: ChartEditor
                },
                {
                    name: 'optionsEditor',
                    title: 'Panel settings',
                    editor: OptionsEditor
                },
            ],
        },
        requestHandler: visReqHandler,
        responseHandler: visRespHandler
    };
}