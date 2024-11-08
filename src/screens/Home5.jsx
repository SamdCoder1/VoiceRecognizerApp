import React, { useEffect } from 'react';
import Vosk from 'react-native-vosk';

const App = () => {
  useEffect(() => {
    const loadModel = async () => {
      const vosk = new Vosk();
      const modelPath = '../../android/app/src/main/assets/vosk-model-small-en-us-0.15'; // Adjust the path to your model

      try {
        await vosk.loadModel(modelPath);
        console.log('Model loaded successfully');
      } catch (error) {
        console.error('Error loading model:', error);
      }
    };

    loadModel();
  }, []);

  return null; // Replace with your component's UI
};

export default App;