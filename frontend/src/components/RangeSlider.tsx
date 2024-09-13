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
  formatThumbValue, // Added format function
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

// Helper function to format Unix timestamp to a readable date string
const formatUnixTime = (value: number) => {
  const date = new Date(value); // Convert seconds to milliseconds
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
  });
};

export const TimeSlider = (props: {value: number[], setValue: Dispatch<SetStateAction<number[]>> }) => {
  return (
    <RangeSlider
      style={{paddingTop: "1rem"}}
      defaultValue={[
        1725964900, 
        Date.now(), 
      ]}
      value={props.value}
      onChange={props.setValue}
      minValue={1725964900} // Example minimum Unix timestamp (01/01/2021)
      maxValue={Date.now()} // Maximum set to the current time
      formatThumbValue={formatUnixTime}
    />
  );
};