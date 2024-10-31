import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Button} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Voice from '@react-native-voice/voice';
import LottieView from 'lottie-react-native';

const Home2 = () => {
  const [result, setResult] = useState('');
  const [partialResult, setPartialResult] = useState('');
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    Voice.onSpeechStart = () => setIsListening(true);
    Voice.onSpeechEnd = () => setIsListening(false);
    Voice.onSpeechResults = e => setResult(e.value[0]);
    Voice.onSpeechPartialResults = e => setPartialResult(e.value[0]);

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const startListening = async () => {
    try {
      await Voice.start('en-US');
    } catch (e) {
      console.error(e);
    }
  };

  const stopListening = async () => {
    try {
      await Voice.stop();
      setIsListening(false);
    } catch (e) {
      console.error(e);
    }
  };

  const cancelListening = async () => {
    try {
      await Voice.cancel();
      setIsListening(false);
    } catch (e) {
      console.error(e);
    }
  };

  const destroyVoice = async () => {
    try {
      await Voice.destroy();
      setResult('');
      setPartialResult('');
      setIsListening(false);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Speech to Text Conversion</Text>
      <Text style={styles.subtitle}>Tap on Mic</Text>

      {isListening ? (
        <LottieView
          source={require('../assets/lottieFiles/Animation - 1730226998310.json')}
          style={{height: 150, width: 150}}
          autoPlay
          loop
        />
      ) : (
        <TouchableOpacity onPress={startListening} style={styles.micButton}>
          <Icon name="microphone" size={50} color="#000" />
        </TouchableOpacity>
      )}

      <Text style={styles.partialResult}>Partial Results: {partialResult}</Text>

      <View
        style={{
          borderColor: 'teal',
          borderWidth: 1,
          padding: 8,
          marginTop: 20,
          paddingBottom: 10,
          width: '90%',
        }}>
        <Text style={styles.resultHeading}>Results</Text>
        <Text style={styles.result}>{result}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Stop" onPress={stopListening} color="#000" />
        <Button title="Cancel" onPress={cancelListening} color="#000" />
        <Button title="Destroy" onPress={destroyVoice} color="#000" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    color: 'black',
  },
  micButton: {
    marginBottom: 20,
    padding: 20,
    borderRadius: 50,
    backgroundColor: '#e0e0e0',
  },
  partialResult: {
    fontSize: 18,
    color: '#888',
    marginTop: 20,
  },
  resultHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 2,
    textAlign: 'center',
    // borderBottomWidth: 2,
    color: 'black',
  },
  result: {
    fontSize: 20,
    // fontWeight: 'bold',
    marginTop: 2,
    textAlign: 'center',
    color: 'black',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 30,
    width: '100%',
    justifyContent: 'space-around',
  },
});

export default Home2;
