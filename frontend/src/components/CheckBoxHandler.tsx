import React, { useEffect, useState } from 'react';
import { LocalStorageManager } from '../utils'; // Adjust the import path as necessary

const CheckboxHandler = () => {
  const [checkedLayers, setCheckedLayers] = useState<string[]>([]);

  useEffect(() => {
    // Retrieve checked layers from local storage
    const storedCheckedLayers = LocalStorageManager.get('checkedLayers');
    if (storedCheckedLayers) {
      setCheckedLayers(JSON.parse(storedCheckedLayers));
    }

    // Function to add event listeners
    const addEventListeners = () => {
      // Select all checkboxes with the class 'leaflet-control-layers-selector'
      const checkboxes = document.querySelectorAll('input.leaflet-control-layers-selector');

      // Define the event handler
      const handleCheckboxChange = (event) => {
        const isChecked = event.target.checked;
        const layerName = event.target.nextElementSibling.textContent.trim();

        // Update the state
        let newCheckedLayers;
        if (isChecked) {
          newCheckedLayers = [...checkedLayers, layerName];
        } else {
          newCheckedLayers = checkedLayers.filter(layer => layer !== layerName);
        }

        setCheckedLayers(newCheckedLayers);

        // Store the updated checked layers in local storage
        LocalStorageManager.set('checkedLayers', newCheckedLayers);
      };

      // Add event listener to each checkbox
      checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', handleCheckboxChange);
      });

      // Cleanup function to remove event listeners when the component unmounts
      return () => {
        checkboxes.forEach(checkbox => {
          checkbox.removeEventListener('change', handleCheckboxChange);
        });
      };
    };

    // Add event listeners after a short delay to ensure the DOM is ready
    const timeoutId = setTimeout(() => {
      const cleanup = addEventListeners();
      return cleanup; // Return the cleanup function
    }, 100); // Adjust the delay as necessary

    // Cleanup function to clear the timeout if the component unmounts
    return () => clearTimeout(timeoutId);
  }, []); // Empty dependency array to run only once on mount

  useEffect(() => {
    // Set the checkboxes based on the stored checked layers
    const checkboxes = document.querySelectorAll('input.leaflet-control-layers-selector');
    checkboxes.forEach(checkbox => {
      const layerName = checkbox.nextElementSibling.textContent.trim();
      checkbox.checked = checkedLayers.includes(layerName);
    });
  }, [checkedLayers]); // Dependency on checkedLayers to re-run the effect when it changes

  return null; // This component doesn't render anything
};

export default CheckboxHandler;