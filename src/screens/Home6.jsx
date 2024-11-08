import React, { useEffect, useState } from 'react';
import { View, Button, Text, StyleSheet } from 'react-native';
import Vosk from 'react-native-vosk';

// Vosk in Ios loads model successfully but App Crash

const Home6 = () => {
  const [vosk, setVosk] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');

  useEffect(() => {
    const loadModel = async () => {
      const voskInstance = new Vosk();
      const modelPath = '../../android/app/src/main/assets/vosk-model-small-en-us-0.15'; // Adjust the path to your model

      try {
        await voskInstance.loadModel(modelPath);
        console.log('Model loaded successfully');
        setVosk(voskInstance);
      } catch (error) {
        console.error('Error loading model:', error);
      }
    };

    loadModel();
  }, []);

  const handleStartRecording = async () => {
    if (vosk) {
      setIsRecording(true);
      vosk.start()
        .then(() => console.log('Recording started'))
        .catch((error) => console.error('Error starting recording:', error));
    }
  };

  const handleStopRecording = async () => {
    if (vosk) {
      try {
        const result = await vosk.stop();
        setIsRecording(false);
        console.log('Recording stopped');
        console.log('Transcription:', result);
        setTranscription(result); // Update transcription state
      } catch (error) {
        console.error('Error stopping recording:', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vosk Voice Recognition</Text>
      <Button
        title={isRecording ? 'Stop Recording' : 'Start Recording'}
        onPress={isRecording ? handleStopRecording : handleStartRecording}
      />
      <Text style={styles.transcriptionLabel}>Transcription:</Text>
      <Text style={styles.transcription}>{transcription}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  transcriptionLabel: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: 'bold',
  },
  transcription: {
    marginTop: 10,
    fontSize: 14,
    color: '#333',
  },
});

export default Home6;
