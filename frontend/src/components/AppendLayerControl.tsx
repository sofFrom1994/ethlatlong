import React, { useEffect } from 'react';

const AddHelloDiv = () => {
  useEffect(() => {
    // Select all elements that match the selector
    const elements = document.querySelectorAll('div.leaflet-control-layers-overlays > label > span');

    // Append the new HTML content to each selected element
    elements.forEach(element => {
      const helloDiv = document.createElement('div');
      helloDiv.textContent = 'hello';
      element.appendChild(helloDiv);
    });

    // Cleanup function to remove the added elements if needed
    return () => {
      elements.forEach(element => {
        const helloDiv = element.querySelector('div');
        if (helloDiv) {
          element.removeChild(helloDiv);
        }
      });
    };
  }, []); // Empty dependency array to run only once on mount

  return null; // This component doesn't render anything
};

export default AddHelloDiv;