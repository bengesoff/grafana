import React from 'react';

import {
  FieldConfigEditorBuilder,
  StandardEditorProps,
  FieldType,
  identityOverrideProcessor,
  SelectableValue,
} from '@grafana/data';
import { GraphFieldConfig, StackingConfig, StackingMode, StackingNegativeSeriesHandling } from '@grafana/schema';

import { RadioButtonGroup } from '../../components/Forms/RadioButtonGroup/RadioButtonGroup';
import { IconButton } from '../../components/IconButton/IconButton';
import { Input } from '../../components/Input/Input';
import { HorizontalGroup } from '../../components/Layout/Layout';
import { graphFieldOptions } from '../../components/uPlot/config';

export const StackingEditor = ({
  value,
  context,
  onChange,
  item,
}: StandardEditorProps<StackingConfig, {
  mode_options: Array<SelectableValue<StackingMode>>
  negative_series_handling_options: Array<SelectableValue<StackingNegativeSeriesHandling>>
}>) => {
  return (
    // TODO: fix layout
    <>
      <HorizontalGroup>
        <RadioButtonGroup
          value={value?.mode || StackingMode.None}
          options={item.settings?.mode_options ?? []}
          onChange={(v) => {
            onChange({
              ...value,
              mode: v,
            });
          }}
        />
        {context.isOverride && value?.mode && value?.mode !== StackingMode.None && (
          <Input
            type="text"
            placeholder="Group"
            suffix={<IconButton name="question-circle" tooltip="Name of the stacking group" tooltipPlacement="top" />}
            defaultValue={value?.group}
            onChange={(v) => {
              onChange({
                ...value,
                group: v.currentTarget.value.trim(),
              });
            }}
          />
        )}
      </HorizontalGroup>
      {value?.mode !== StackingMode.None && (
        <RadioButtonGroup
          value={value?.negativeSeriesHandling || StackingNegativeSeriesHandling.StackSeparately}
          options={item.settings?.negative_series_handling_options ?? []}
          onChange={(v) => {
            onChange({
              ...value,
              negativeSeriesHandling: v,
            });
          }}
        />
      )}
    </>
  );
};

export function addStackingConfig(
  builder: FieldConfigEditorBuilder<GraphFieldConfig>,
  defaultConfig?: StackingConfig,
  category = ['Graph styles']
) {
  builder.addCustomEditor({
    id: 'stacking',
    path: 'stacking',
    name: 'Stack series',
    category: category,
    defaultValue: defaultConfig,
    editor: StackingEditor,
    override: StackingEditor,
    settings: {
      mode_options: graphFieldOptions.stacking_mode,
      negative_series_handling_options: graphFieldOptions.stacking_negative_series_handling,
    },
    process: identityOverrideProcessor,
    shouldApply: (f) => f.type === FieldType.number,
  });
}
