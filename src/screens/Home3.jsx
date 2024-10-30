import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Voice from '@react-native-voice/voice';
import LottieView from 'lottie-react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import * as Animatable from 'react-native-animatable';

const data = [
  {name: '1783 BPS', originalTranscript: '', processedTranscript: ''},
  {name: '1811 BOP', originalTranscript: '', processedTranscript: ''},
  {name: '1792 FBOP', originalTranscript: '', processedTranscript: ''},
  {name: '1810 FBOP', originalTranscript: '', processedTranscript: ''},
  {name: '1407 BOP1', originalTranscript: '', processedTranscript: ''},
  {name: '1313 BOP1', originalTranscript: '', processedTranscript: ''},
  {name: '1808 FBOP1', originalTranscript: '', processedTranscript: ''},
  {name: '1806 FBOP1', originalTranscript: '', processedTranscript: ''},
  {name: '1794 GBOP1', originalTranscript: '', processedTranscript: ''},
  {name: '1813 GBOP1', originalTranscript: '', processedTranscript: ''},
  {name: '1786 FOF1', originalTranscript: '', processedTranscript: ''},
  {name: '1801 FOF1', originalTranscript: '', processedTranscript: ''},
];
const Home3 = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [generatedData, setGeneratedData] = useState('');
  const [updatedDataArray, setUpdatedDataArray] = useState(data);
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

  useEffect(() => {
    console.log('useEffectis running');

    if (!isListening) {
      setGeneratedData(result);
    }
  }, [isListening]);

  const startListening = async () => {
    try {
      await Voice.start('en-US');
      setResult(''); // Clear previous result on new listen
    } catch (e) {
      console.error(e);
    }
  };

  // const stopListening = async () => {
  //   try {
  //     await Voice.stop();
  //     setIsListening(false);
  //     setGeneratedData(result);
  //   } catch (e) {
  //     console.error(e);
  //   }
  // };

  // const cancelListening = async () => {
  //   try {
  //     await Voice.cancel();
  //     setIsListening(false);
  //   } catch (e) {
  //     console.error(e);
  //   }
  // };

  const handleSelect = item => {
    console.log('selected item is--', item);

    setSelectedItem(item);
    setResult(''); // Clear previous result when a new item is selected

    //if processedTranscript is empty recording start
    console.log(
      'check processedTranscript---',
      item.processedTranscript.length,
    );

    if (item.processedTranscript.length == 0) {
      startListening();
    } else {
      setResult(item.processedTranscript);
    }
  };

  const handleSave = () => {
    if (selectedItem) {
      const updatedArray = updatedDataArray.map(item =>
        item.name === selectedItem.name
          ? {...item, processedTranscript: generatedData}
          : item,
      );
      console.log('new array--', updatedArray);

      setUpdatedDataArray(updatedArray);
      setSelectedItem(null);
      setGeneratedData('');
    }
  };

  return (
    <ScrollView style={{flexGrow: 1, padding: 20}}>
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
                {/* <Text style={{color: 'gray', fontSize: wp(3.5)}}>
                  {item.processedTranscript}
                </Text> */}
                {selectedItem?.name === item.name && isListening ? (
                  <Icon name="mic" size={wp(5)} color="red" />
                ) : (
                  <Icon name="mic-off" size={wp(5)} color="black" />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.listeningContainer}>
        {isListening && (
          <Animatable.Text animation="fadeIn" style={styles.listeningText}>
            Listening...
          </Animatable.Text>
        )}
        <TextInput
          style={styles.textInput}
          value={result}
          onChangeText={text => setResult(text)}
          placeholder="Speech to Text Result"
          multiline
        />
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.editButtonText}>SAVE</Text>
      </TouchableOpacity>

      {/* <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.cancelButton} onPress={cancelListening}>
          <Text style={styles.editButtonText}>CANCEL</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.stopButton} onPress={stopListening}>
          <Text style={styles.editButtonText}>STOP</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.editButtonText}>SAVE</Text>
        </TouchableOpacity>
      </View> */}
    </ScrollView>
  );
};

export default Home3;

const styles = StyleSheet.create({
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
  listeningText: {
    fontSize: wp(6),
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'gray',
  },
  textInput: {
    marginTop: hp(1),
    height: hp(20),
    borderColor: 'black',
    borderWidth: wp(0.5),
    paddingHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: hp(5),
  },
  cancelButton: {
    backgroundColor: '#f77c7c',
    paddingVertical: hp(1),
    paddingHorizontal: wp(5),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: wp(2),
  },
  stopButton: {
    backgroundColor: '#f7bc7c',
    paddingVertical: hp(1),
    paddingHorizontal: wp(5),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: wp(2),
  },
  saveButton: {
    marginTop: hp(2),
    width: '30%',
    alignSelf: 'center',
    backgroundColor: '#5f99f5',
    paddingVertical: hp(1),
    paddingHorizontal: wp(2),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: wp(2),
  },
  editButtonText: {
    color: 'white',
    fontSize: wp(4.5),
    fontWeight: 'bold',
  },
});
