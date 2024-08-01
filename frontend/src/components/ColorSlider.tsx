import {useColorSlider} from '@react-aria/color';
import {useColorSliderState} from '@react-stately/color';
import {useLocale} from '@react-aria/i18n';
import {useFocusRing} from '@react-aria/focus';
import { useRef } from 'react';

const TRACK_THICKNESS = 28;
const THUMB_SIZE = 20;

export function ColorSlider(props) {
  let { isDisabled } = props;
  let { locale } = useLocale();
  let state = useColorSliderState({ ...props, locale });
  let trackRef = useRef(null);
  let inputRef = useRef(null);

  // Default label to the channel name in the current locale
  let label = props.label || state.value.getChannelName(props.channel, locale);

  let { trackProps, thumbProps, inputProps, labelProps, outputProps } =
    useColorSlider({
      ...props,
      label,
      trackRef,
      inputRef
    }, state);

  let { focusProps, isFocusVisible } = useFocusRing();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'start',
        width: "17rem" 
      }}
    >
      {/* Create a flex container for the label and output element. */}
      <div style={{ display: 'flex', alignSelf: 'start', gap: "1rem" }}>
        <label {...labelProps}>{label}</label>
        <output {...outputProps} style={{ flex: '1 0 auto', textAlign: 'end' }}>
          {state.value.formatChannelValue(props.channel, locale)}
        </output>
      </div>
      {/* The track element holds the visible track line and the thumb. */}
      <div
        {...trackProps}
        ref={trackRef}
        style={{
          ...trackProps.style,
          height: TRACK_THICKNESS,
          width: '80%',
          borderRadius: 4,
          background: isDisabled
            ? 'rgb(142, 142, 142)'
            : trackProps.style.background
        }}
      >
        <div
          {...thumbProps}
          style={{
            ...thumbProps.style,
            top: TRACK_THICKNESS / 2,
            background: isDisabled
              ? 'rgb(142, 142, 142)'
              : state.getDisplayColor().toString('css'),
            border: `2px solid ${isDisabled ? 'rgb(142, 142, 142)' : 'white'}`,
            boxShadow: '0 0 0 1px black, inset 0 0 0 1px black',
            overflow: "scroll",
            width: isFocusVisible ? TRACK_THICKNESS + 4 : THUMB_SIZE,
            height: isFocusVisible ? TRACK_THICKNESS + 4 : THUMB_SIZE,
            borderRadius: '50%',
            boxSizing: 'border-box'
          }}
        >
          <input ref={inputRef} {...inputProps} {...focusProps} />
        </div>
      </div>
    </div>
  );
}