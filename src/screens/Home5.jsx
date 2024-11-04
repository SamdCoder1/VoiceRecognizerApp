import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Vosk from 'react-native-vosk';
// import vosk from '../../android/app/src/main/assets/vosk-model-small-en-us-0.15'

const modelPath = '../../android/app/src/main/assets/vosk-model-small-en-us-0.15';

const Home5 = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  useEffect(() => {
    // Load the model when the component mounts
    console.log(Vosk);
        // Vosk.init


    Vosk.init(modelPath)
      .then(() => console.log('Model loaded successfully'))
      .catch((error) => console.error('Failed to load model:', error));
    
    return () => {
      Vosk.destroy();
    };
  }, []);

  const startListening = async () => {
    try {
      await Vosk.start();
      setIsListening(true);
    } catch (error) {
      console.error('Error starting Vosk:', error);
    }
  };

  const stopListening = async () => {
    try {
      await Vosk.stop();
      setIsListening(false);
    } catch (error) {
      console.error('Error stopping Vosk:', error);
    }
  };

  const handleResults = (event) => {
    const { partial, text } = event;
    setTranscript(text || partial);
  };

  useEffect(() => {
    const subscription = Vosk.onResult(handleResults);
    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Offline Voice Transcription with Vosk</Text>
      <Text style={styles.transcript}>{transcript}</Text>

      <TouchableOpacity
        onPress={isListening ? stopListening : startListening}
        style={styles.button}
      >
        <Text style={styles.buttonText}>{isListening ? 'Stop' : 'Start'} Listening</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    fontSize: 18,
    marginBottom: 20,
  },
  transcript: {
    fontSize: 16,
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    width: '100%',
    minHeight: 100,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default Home5;
