import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TextInput,
  Alert,
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

const Home4 = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [updatedDataArray, setUpdatedDataArray] = useState(data);
  const [result, setResult] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    Voice.onSpeechResults = e => {
      const transcription = e.value[0];
      setResult(transcription);

      if (selectedItem) {
        updateItemTranscript(selectedItem, transcription);
      }
    };

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
      stopRecording();
    };
  }, [selectedItem]);

  const updateItemTranscript = (item, transcription) => {
    const updatedArray = updatedDataArray.map(dataItem =>
      dataItem.name === item.name
        ? {...dataItem, processedTranscript: transcription, status: 'completed'}
        : dataItem,
    );
    setUpdatedDataArray(updatedArray);
  };

  const updateItemStatus = (item, status) => {
    const updatedArray = updatedDataArray.map(dataItem =>
      dataItem.name === item.name ? {...dataItem, status: status} : dataItem,
    );
    setUpdatedDataArray(updatedArray);
  };

  const startRecording = async item => {
    try {
      const path = `${RNFetchBlob.fs.dirs.DocumentDir}/${item.name}.aac`;
      await audioRecorderPlayer.startRecorder(path);
      setIsRecording(true);
      updateItemStatus(item, 'recording');

      const updatedArray = updatedDataArray.map(dataItem =>
        dataItem.name === item.name ? {...dataItem, recording: path} : dataItem,
      );
      setUpdatedDataArray(updatedArray);
    } catch (error) {
      console.error('Recording error:', error);
      Alert.alert('Error', 'Failed to start recording');
    }
  };

  const stopRecording = async () => {
    try {
      if (isRecording) {
        await audioRecorderPlayer.stopRecorder();
        setIsRecording(false);
        if (selectedItem) {
          updateItemStatus(selectedItem, 'processing');
          // Start speech recognition after recording stops
          await startSpeechRecognition();
        }
      }
    } catch (error) {
      console.error('Stop recording error:', error);
      Alert.alert('Error', 'Failed to stop recording');
    }
  };

  const startSpeechRecognition = async () => {
    try {
      await Voice.start('en-US');
      setIsListening(true);
    } catch (error) {
      console.error('Speech recognition error:', error);
      Alert.alert('Error', 'Failed to start speech recognition');
    }
  };

  const handleSelect = async item => {
    try {
      // If there's already a selected item being recorded or processed
      if (selectedItem && (isRecording || isListening)) {
        await stopRecording();
        await Voice.stop();
      }

      // If the item already has a transcript, just display it
      if (item.processedTranscript) {
        setResult(item.processedTranscript);
        setSelectedItem(item);
        return;
      }

      // Start new recording for the selected item
      setSelectedItem(item);
      setResult('');
      await startRecording(item);
    } catch (error) {
      console.error('Handle select error:', error);
      Alert.alert('Error', 'Failed to process selection');
    }
  };

  const handleRetry = async item => {
    try {
      // Reset the item's data
      const updatedArray = updatedDataArray.map(dataItem =>
        dataItem.name === item.name
          ? {
              ...dataItem,
              processedTranscript: '',
              recording: '',
              status: 'idle',
            }
          : dataItem,
      );
      setUpdatedDataArray(updatedArray);
      setResult('');

      // Start new recording
      await handleSelect(item);
    } catch (error) {
      console.error('Retry error:', error);
      Alert.alert('Error', 'Failed to retry');
    }
  };

  return (
    <ScrollView style={{flexGrow: 1, padding: 20}}>
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
              ]}>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={{color: 'black', fontSize: wp(4)}}>
                  {item.name}
                </Text>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  {item.status === 'recording' && (
                    <Icon name="mic" size={wp(5)} color="red" />
                  )}
                  {item.status === 'processing' && (
                    <Text style={{color: 'blue'}}>Processing...</Text>
                  )}
                  {item.status === 'completed' && (
                    <TouchableOpacity onPress={() => handleRetry(item)}>
                      <Icon name="reload" size={wp(5)} color="red" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.listeningContainer}>
        {isRecording && selectedItem && (
          <TouchableOpacity style={styles.stopButton} onPress={stopRecording}>
            <Text style={styles.stopButtonText}>Stop Recording</Text>
          </TouchableOpacity>
        )}

        <TextInput
          style={styles.textInput}
          value={result}
          onChangeText={text => setResult(text)}
          placeholder="Speech to Text Result"
          multiline
          editable={!isRecording}
        />
      </View>
    </ScrollView>
  );
};

// Add these new styles
const styles = StyleSheet.create({
  // ... existing styles ... ,
  listContainer: {
    height: hp(60),
    borderWidth: wp(1),
    padding: wp(5),
    borderColor: '#b6d1fc',
    elevation: 3,
  },
  itemContainer: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  listeningContainer: {
    marginTop: hp(1.5),
  },
  listeningText1: {
    fontSize: wp(6),
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'gray',
    marginBottom: hp(1),
  },
  listeningText: {
    fontSize: wp(6),
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'gray',
  },
  textInput: {
    marginTop: hp(1),
    height: hp(22),
    borderColor: 'black',
    borderWidth: wp(0.5),
    paddingHorizontal: 10,
    fontSize: wp(4.5),
  },

  stopButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
  },
  stopButtonText: {
    color: 'white',
    fontSize: wp(4),
    textAlign: 'center',
  },
});

export default Home4;
