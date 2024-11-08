import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TextInput,
  PermissionsAndroid,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Voice from '@react-native-voice/voice';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import RNFetchBlob from 'react-native-blob-util';
import * as Animatable from 'react-native-animatable';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

const data = [
  {
    name: '1783 BPS',
    originalTranscript: '',
    processedTranscript: '',
    recording: '',
    status: 'idle',
  }, // status can be: 'idle', 'recording', 'processing', 'completed'
  {
    name: '1811 BOP',
    originalTranscript: '',
    processedTranscript: '',
    recording: '',
    status: 'idle',
  },
  {
    name: '1792 FBOP',
    originalTranscript: '',
    processedTranscript: '',
    recording: '',
    status: 'idle',
  },
  {
    name: '1810 FBOP',
    originalTranscript: '',
    processedTranscript: '',
    recording: '',
    status: 'idle',
  },
  // ... other items
];

const audioRecorderPlayer = new AudioRecorderPlayer();

const Home = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [updatedDataArray, setUpdatedDataArray] = useState(data);
  const [result, setResult] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessedTranscript, setIsProcessedTranscript] = useState(false);

  useEffect(() => {
    // Voice event listeners
    Voice.onSpeechStart = () => setIsListening(true);
    Voice.onSpeechEnd = () => setIsListening(false);
    Voice.onSpeechResults = e => {
      if (e.value && e.value[0]) {
        setResult(e.value[0]);
      }
    };

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
      if (isRecording) {
        stopRecording();
      }
    };
  }, []);

  const startListening = async () => {
    try {
      await Voice.start('en-US');
      setResult('');
    } catch (e) {
      console.error('Start listening error:', e);
    }
  };

  const startRecording = async (item) => {
    try {
      const path = `${RNFetchBlob.fs.dirs.DocumentDir}/${item.name}.aac`;
      await audioRecorderPlayer.startRecorder(path);
      setIsRecording(true);

      const updatedArray = updatedDataArray.map((dataItem) =>
        dataItem.name === item.name ? { ...dataItem, recording: path } : dataItem
      );
      setUpdatedDataArray(updatedArray);
    } catch (error) {
      console.error('Recording error:', error);
    }
  };

  const stopRecording = async () => {
    try {
      if (isRecording) {
        await audioRecorderPlayer.stopRecorder();
        setIsRecording(false);
      }
    } catch (error) {
      console.error('Stop recording error:', error);
    }
  };

  const handleSelect = async (item) => {
    try {
      // Save current transcript
      if (selectedItem && result) {
        const updatedArray = updatedDataArray.map((dataItem) =>
          dataItem.name === selectedItem.name
            ? { ...dataItem, processedTranscript: result }
            : dataItem
        );
        setUpdatedDataArray(updatedArray);
      }

      // Stop any ongoing recording and listening
      if (isRecording) {
        await stopRecording();
      }
      if (isListening) {
        await Voice.stop();
      }

      // Set up for the new item
      if (item.processedTranscript) {
        setIsProcessedTranscript(true);
        setResult(item.processedTranscript);
      } else {
        setIsProcessedTranscript(false);
        setResult('');
        await startListening();
        await startRecording(item);
      }

      setSelectedItem(item);
    } catch (error) {
      console.error('Handle select error:', error);
    }
  };

  const onRetry = async (item) => {
    try {
      if (isRecording) {
        await stopRecording();
      }
      if (isListening) {
        await Voice.stop();
      }

      const updatedArray = updatedDataArray.map((dataItem) =>
        dataItem.name === item.name
          ? { ...dataItem, processedTranscript: '', recording: '' }
          : dataItem
      );
      setUpdatedDataArray(updatedArray);
      handleSelect(item);
    } catch (error) {
      console.error('Retry error:', error);
    }
  };

  return (
    <ScrollView style={{ flexGrow: 1, padding: 20 }}>
      <Animatable.Text animation="fadeIn" style={styles.listeningText1}>
        LIST OF ITEMS
      </Animatable.Text>
      <View style={styles.listContainer}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {updatedDataArray.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleSelect(item)}
              style={[
                styles.itemContainer,
                {
                  backgroundColor:
                    selectedItem?.name === item.name ? '#b6d1fc' : '#f0f0f0',
                },
              ]}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ color: 'black', fontSize: wp(4) }}>
                  {item.name}
                </Text>
                {selectedItem?.name === item.name &&
                (isListening || isRecording) ? (
                  <Icon name="mic" size={wp(5)} color="red" />
                ) : (
                  <View style={{ flexDirection: 'row', gap: wp(2) }}>
                    <Icon name="mic-off" size={wp(5)} color="black" />
                    {selectedItem?.name === item.name && isProcessedTranscript && (
                      <TouchableOpacity onPress={() => onRetry(item)}>
                        <Icon name="reload" size={wp(5)} color="red" />
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.listeningContainer}>
        <TouchableOpacity onPress={() => console.log(updatedDataArray)}>
          <Animatable.Text animation="fadeIn" style={styles.listeningText}>
            Recorded Text
          </Animatable.Text>
        </TouchableOpacity>

        <TextInput
          style={styles.textInput}
          value={result}
          onChangeText={(text) => setResult(text)}
          placeholder="Speech to Text Result"
          multiline
        />
      </View>
    </ScrollView>
  );
};

export default Home;

// Styles remain the same
