/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */
import React from 'react';
import {
    EuiColorPicker, EuiFormRow, EuiPanel, EuiSpacer, EuiSwitch,
    EuiTitle, EuiFieldText, EuiSelect
} from '@elastic/eui';
import { i18n } from '@osd/i18n';
import { VisOptionsProps, VisParams, PlotlyAxisPosition } from '../types';

function OptionsEditor({ stateParams, setValue }: VisOptionsProps<VisParams>) {
    const yaxisPosOptions: Array<{ value: PlotlyAxisPosition; text: string }> = [
        { value: 'left', text: 'Left' },
        { value: 'right', text: 'Right' },
    ];

    return (
        <>
            <EuiPanel paddingSize='s'>
                <EuiTitle size='xs'>
                    <h3>Y-axis</h3>
                </EuiTitle>

                <EuiSpacer size='s' />

                <EuiFormRow
                    label={i18n.translate('candlestick.option.yaxis.posLabel', {
                        defaultMessage: 'Position'
                    })}
                    fullWidth={true}
                >
                    <EuiSelect
                        options={yaxisPosOptions}
                        value={stateParams.yaxisPos}
                        onChange={(e) => setValue('yaxisPos', e.target.value as PlotlyAxisPosition)}
                        fullWidth={true}
                    />
                </EuiFormRow>

                <EuiFormRow
                    label={i18n.translate('candlestick.option.yaxis.unitLabel', {
                        defaultMessage: 'Unit'
                    })}
                    fullWidth={true}
                >
                    <EuiFieldText
                        value={stateParams.yaxisUnit}
                        onChange={(e) => setValue('yaxisUnit', e.target.value)}
                        fullWidth={true}
                    />
                </EuiFormRow>

                <EuiFormRow label={i18n.translate('candlestick.option.yaxis.label', {
                    defaultMessage: 'Label'
                })}
                    fullWidth={true}
                >
                    <EuiFieldText
                        value={stateParams.yaxisLabel}
                        onChange={(e) => setValue('yaxisLabel', e.target.value)}
                        fullWidth={true}
                    />
                </EuiFormRow>
            </EuiPanel>

            <EuiPanel paddingSize='s'>
                <EuiTitle size='xs'>
                    <h3>Settings</h3>
                </EuiTitle>

                <EuiSpacer size='s' />

                <EuiFormRow
                    label={i18n.translate('candlestick.option.upColorLabel', {
                        defaultMessage: 'Up Color'
                    })}
                    fullWidth={true}
                >
                    <EuiColorPicker
                        color={stateParams.upColor}
                        onChange={(e) => setValue('upColor', e)}
                        fullWidth={true}
                    />
                </EuiFormRow>

                <EuiFormRow
                    label={i18n.translate('candlestick.option.downColorLabel', {
                        defaultMessage: 'Down Color'
                    })}
                    fullWidth={true}
                >
                    <EuiColorPicker
                        color={stateParams.downColor}
                        onChange={(e) => setValue('downColor', e)}
                        fullWidth={true}
                    />
                </EuiFormRow>

                <EuiFormRow>
                    <EuiSwitch
                        label={i18n.translate('candlestick.option.showRangeslider', {
                            defaultMessage: 'Show Rangeslider'
                        })}
                        checked={stateParams.showRangeslider}
                        onChange={(e) => setValue('showRangeslider', e.target.checked)}
                    />
                </EuiFormRow>
            </EuiPanel>
        </>
    );
}

export { OptionsEditor };