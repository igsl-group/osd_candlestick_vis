/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useMemo, useCallback } from 'react';
import {
    EuiPanel, EuiSpacer, EuiTitle, EuiFormRow, EuiSuperSelect,
    EuiComboBox, EuiComboBoxOptionOption
} from '@elastic/eui';
import { VisOptionsProps, VisParams } from '../types';
import { Field } from 'src/plugins/dashboard/public/types';
import { i18n } from '@osd/i18n';

const intervalOptions = [
    {
        label: i18n.translate('candlestick.vis.interval.hour', {
            defaultMessage: 'Hour'
        }),
        value: '1h'
    },
    {
        label: i18n.translate('candlestick.vis.interval.day', {
            defaultMessage: 'Day'
        }),
        value: '1d'
    },
    {
        label: i18n.translate('candlestick.vis.interval.week', {
            defaultMessage: 'Week'
        }),
        value: '1w'
    },
    {
        label: i18n.translate('candlestick.vis.interval.month', {
            defaultMessage: 'Month'
        }),
        value: '1M'
    },
    {
        label: i18n.translate('candlestick.vis.interval.year', {
            defaultMessage: 'Year'
        }),
        value: '1y'
    }
];

function ChartEditor({ aggs, stateParams, setValue }: VisOptionsProps<VisParams>) {
    const docFields = aggs.indexPattern.fields.map((field: Field) => {
        return {
            value: field.name,
            inputDisplay: field.name
        };
    });

    const selectedInterval = stateParams.interval ?? '';

    const selectedIntervalOption = useMemo(
        () => [intervalOptions.find((op) => op.value === selectedInterval) || { label: selectedInterval, value: selectedInterval }],
        [selectedInterval]
    );

    const onChange = useCallback(
        (opts: Array<EuiComboBoxOptionOption<string>>) => {
            setValue('interval', (opts[0] && opts[0].value) || '');
        },
        [setValue]
    );

    return (
        <>
            <EuiPanel paddingSize='s'>
                <EuiTitle size='xs'>
                    <h3>Metrics</h3>
                </EuiTitle>

                <EuiSpacer size='s' />

                <EuiFormRow
                    label={i18n.translate('candlestick.vis.priceLabel', {
                        defaultMessage: 'Price'
                    })}
                    helpText={i18n.translate('candlestick.vis.price.helpText', {
                        defaultMessage: "The document's field to generate the Open, High, Low, Close value"
                    })}
                    fullWidth={true}
                >
                    <EuiSuperSelect
                        options={docFields}
                        valueOfSelected={stateParams.priceField || 'select'}
                        onChange={(value) => setValue('priceField', value)}
                        fullWidth={true}
                    />
                </EuiFormRow>
            </EuiPanel>

            <EuiSpacer size='s' />

            <EuiPanel paddingSize='s'>
                <EuiTitle size='xs'>
                    <h3>Buckets</h3>
                </EuiTitle>

                <EuiSpacer size='s' />

                <EuiFormRow
                    label={i18n.translate('candlestick.vis.timeLabel', {
                        defaultMessage: 'Time Field'
                    })}
                    fullWidth={true}
                >
                    <EuiSuperSelect
                        options={docFields}
                        valueOfSelected={stateParams.timeField || 'select'}
                        onChange={(value) => setValue('timeField', value)}
                        fullWidth={true}
                    />
                </EuiFormRow>

                <EuiFormRow
                    label={i18n.translate('candlestick.vis.intervalLabel', {
                        defaultMessage: 'Interval'
                    })}
                    fullWidth={true}
                >
                    <EuiComboBox
                        onChange={onChange}
                        options={intervalOptions}
                        selectedOptions={selectedIntervalOption}
                        singleSelection={{ asPlainText: true }}
                        placeholder={i18n.translate('candlestick.vis.selectIntervalPlaceholder', {
                            defaultMessage: 'Select an interval'
                        })}
                        fullWidth={true}
                    />
                </EuiFormRow>
            </EuiPanel>
        </>
    );
}

export { ChartEditor };