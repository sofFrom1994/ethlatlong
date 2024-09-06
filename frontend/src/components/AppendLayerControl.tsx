import React, { useEffect } from 'react';
import { layerType } from './types';
import { ColorSwatch } from 'react-aria-components';
import { nToColor } from '../utils';
import {createRoot} from 'react-dom/client';

const colorSwatchStyle = {
  borderRadius: "0.2rem",
  height: "1rem",
  margin: 0,
  padding: 0,
  width: "1rem",
  display: "inline"
};

const AddHelloDiv = (props: { layers : layerType[]}) => {
  useEffect(() => {
    const layerList = document.querySelectorAll('div.leaflet-control-layers-overlays > label > span > span');

     // Append the new HTML content to each selected element
    layerList.forEach((element) => {
      const layerName = element.innerHTML.trim();

      // Find the corresponding layer by name
      const layer = props.layers.find((v) => v.name === layerName);
      if (layer !== undefined) {
        // Create a temporary container to render the JSX element into
        const tempContainer = document.createElement('div');

        // Render the ColorSwatch component into the temporary container
        const root = createRoot(tempContainer);
        root.render(
          <ColorSwatch
            style={colorSwatchStyle}
            color={`#${nToColor(layer.color)}`}
          />
        );

        // Use a setTimeout to ensure the rendering is complete before appending
        setTimeout(() => {
          // Append the real DOM node (firstChild) to the target element
          if (tempContainer.firstChild) {
            element.appendChild(tempContainer.firstChild);
          }
        }, 400);
      }
    });
  }, [props.layers]); // Empty dependency array to run only once on mount

  return null; // This component doesn't render anything
};

export default AddHelloDiv;