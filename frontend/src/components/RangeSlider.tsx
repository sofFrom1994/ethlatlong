import { Dispatch, SetStateAction } from "react";
import {
  SliderProps,
  Slider,
  Label,
  SliderOutput,
  SliderTrack,
  SliderThumb,
} from "react-aria-components";

interface RangeSliderProps<T> extends SliderProps<T> {
  label?: string;
  thumbLabels?: string[];
  formatThumbValue?: (value: number) => string; // Function to format thumb values
}

export function RangeSlider<T extends number | number[]>({
  label,
  thumbLabels,
  formatThumbValue, 
  ...props
}: RangeSliderProps<T>) {
  return (
    <Slider {...props}>
      {label && <Label>{label}</Label>}
      <SliderOutput style={{ whiteSpace: "nowrap" }}>
        {({ state }) =>
          state.values
            .map((value, i) =>
              formatThumbValue
                ? formatThumbValue(value)
                : state.getThumbValueLabel(i)
            )
            .join(" – ")
        }
      </SliderOutput>
      <SliderTrack style={{width: "90%"}} >
        {({ state }) =>
          state.values.map((_, i) => (
            <SliderThumb key={i} index={i} aria-label={thumbLabels?.[i]} />
          ))
        }
      </SliderTrack>
    </Slider>
  );
}

const formatUnixTime = (value: number) => {
  const date = new Date(value * 1000); 
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
  });
};

export const TimeSlider = (props: { value: number[], setValue: Dispatch<SetStateAction<number[]>> }) => {
  const min = 1725964900 // approximate time contract was deployed
  const max = Math.floor(Date.now() / 1000);
  return (
    <RangeSlider
      style={{ paddingTop: "1rem" }}
      defaultValue={[
        min, 
        max
      ]}
      value={props.value}
      onChange={props.setValue}
      minValue={1725964900} 
      maxValue={max}
      formatThumbValue={formatUnixTime}
    />
  );
};
