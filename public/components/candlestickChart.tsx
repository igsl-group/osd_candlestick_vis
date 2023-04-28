/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */
import React from 'react';
import { format } from 'date-fns';
// @ts-ignore
import Plotly, { PlotData } from 'plotly.js-dist';
import plotComponentFactory from 'react-plotly.js/factory';
import { CandlestickChartQueryResp, CandlestickChartTimeData } from '../visDefinition';
import { VisParams } from '../types';
import { EuiEmptyPrompt, EuiText } from '@elastic/eui';

function CandlestickChart({
    visData,
    visParams
}: {
    visData: CandlestickChartQueryResp;
    visParams: VisParams;
}) {
    const Plot = plotComponentFactory(Plotly);

    const genChartData = (): {
        data: PlotData[];
    } => {
        const by_time: any[] = visData.by_time;
        const data: PlotData[] = [];
        if (by_time.length === 0) return { data };

        let trace: any = {};
        trace.type = 'candlestick';
        trace.xaxis = 'x';
        trace.yaxis = 'y';
        trace.increasing = {
            line: { color: visParams.upColor }
        };
        trace.decreasing = {
            line: { color: visParams.downColor }
        };

        trace.x = [];
        trace.open = [];
        trace.close = [];
        trace.high = [];
        trace.low = [];

        by_time.forEach((entry: CandlestickChartTimeData) => {
            let xField = '';
            let time = Date.parse(entry.time);

            if (visParams.interval == '1M') {
                xField = new Intl.DateTimeFormat('en', { month: 'short' }).format(time) + ' '
                    + new Intl.DateTimeFormat('en', { year: 'numeric' }).format(time);
            }
            else if (visParams.interval == '1y') {
                xField = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(time);
            }
            else if (visParams.interval == '1d' || visParams.interval == '1w') {
                xField = format(new Date(time), 'YYYY-MM-DD');
            }
            else {
                xField = format(new Date(time), 'YYYY-MM-DDTHH:mm:ss.SSS');
            }

            trace.x.push(xField);
            trace.open.push(entry.openDoc[visParams.priceField]);
            trace.close.push(entry.closeDoc[visParams.priceField]);
            trace.high.push(entry.high);
            trace.low.push(entry.low);
        });

        data.push(trace);

        return { data };
    };

    if (!visParams.priceField || !visParams.timeField || !visParams.interval) {
        return (
            <EuiEmptyPrompt
                title={<h2>No data</h2>}
                body={
                    <EuiText>
                        Specify data to plot the chart using the Data & Settings panel
                        <br />
                        on the right.
                    </EuiText>
                }
            />
        );
    }

    const chartData = genChartData();

    if (chartData.data.length > 0) {
        let rangebreaks = [];

        if (visParams.interval == '1d') {
            rangebreaks.push({ 'pattern': 'day of week', 'bounds': ['sat', 'mon'] });
        }
        else if (visParams.interval == '1h') {
            rangebreaks.push({ 'pattern': 'hour', 'bounds': [16, 9.5] });    // Break after hours and market close
        }

        return (
            <Plot
                divId='plotly-candlestick-chart'
                data={chartData.data}
                style={{ width: '100%', height: '100%' }}
                config={{ displayModeBar: false }}
                layout={{
                    autosize: true,
                    dragmode: false,
                    showlegend: false,
                    margin: {
                        t: 10
                    },
                    xaxis: {
                        rangeslider: { visible: visParams.showRangeslider },
                        rangebreaks: rangebreaks
                    },
                    yaxis: {
                        side: visParams.yaxisPos,
                        title: {
                            text: visParams.yaxisLabel,
                            font: { family: 'sans-serif' }
                        },
                        tickprefix: visParams.yaxisUnit,
                        showtickprefix: 'all'
                    }
                }}
            />
        );
    }
    else {
        return (
            <EuiEmptyPrompt
                title={<h2>No data</h2>}
                body={
                    <EuiText>No data matching the selected filter.</EuiText>
                }
            />
        );
    }
}

export { CandlestickChart };