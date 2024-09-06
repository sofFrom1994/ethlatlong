import { useEffect, useState } from 'react';
import { LocalStorageManager } from '../utils';

const CheckboxHandler = ({ checkedSetter }) => {
  try {

  const [checkedLayers, setCheckedLayers] = useState<string[]>([]);

  // Synchronizes the DOM checkboxes with the React state
  const syncCheckedLayers = () => {
    const checkboxes = document.querySelectorAll(
      'input.leaflet-control-layers-selector'
    );
    checkboxes.forEach((checkbox) => {
      const layerName = checkbox.nextElementSibling.textContent.trim();
      checkbox.checked = checkedLayers.includes(layerName);
    });
    checkedSetter(checkedLayers);
  };

  // Load checked layers from local storage on initial render
  useEffect(() => {
    const storedCheckedLayers = LocalStorageManager.get('checkedLayers');
    if (storedCheckedLayers) {
      const parsedLayers = JSON.parse(storedCheckedLayers);
      setCheckedLayers(parsedLayers);
    }
  }, []);

  // Sync DOM checkboxes whenever `checkedLayers` changes
  useEffect(() => {
    syncCheckedLayers();
  }, [checkedLayers]);

  // Handler for checkbox state changes
  const handleCheckboxChange = (event) => {
    const isChecked = event.target.checked;
    const layerName = event.target.nextElementSibling.textContent.trim();

    setCheckedLayers((prevCheckedLayers) => {
      let newCheckedLayers;
      if (isChecked) {
        newCheckedLayers = [...prevCheckedLayers, layerName];
      } else {
        newCheckedLayers = prevCheckedLayers.filter((l) => l !== layerName);
      }

      // Update local storage with the latest state
      LocalStorageManager.set('checkedLayers', JSON.stringify(newCheckedLayers));
      return newCheckedLayers;
    });
  };

  // Add event listeners when checkboxes are detected in the DOM
  useEffect(() => {
    const addEventListeners = () => {
      const checkboxes = document.querySelectorAll(
        'input.leaflet-control-layers-selector'
      );

      checkboxes.forEach((checkbox) => {
        checkbox.addEventListener('change', handleCheckboxChange);
      });

      // Cleanup function to remove event listeners when component unmounts or dependencies change
      return () => {
        checkboxes.forEach((checkbox) => {
          checkbox.removeEventListener('change', handleCheckboxChange);
        });
      };
    };

    // Use MutationObserver to reliably detect when checkboxes are added/removed from the DOM
    const observer = new MutationObserver(() => addEventListeners());

    // Observe changes in the DOM, specifically targeting the container of the checkboxes
    const targetNode = document.querySelector('.leaflet-control-layers-list');
    if (targetNode) {
      observer.observe(targetNode, { childList: true, subtree: true });
    }

    // Cleanup observer on component unmount
    return () => {
      observer.disconnect();
    };
  }, []);
} catch (e ) {
  console.log(e);
}

  return null;
};

export default CheckboxHandler;
