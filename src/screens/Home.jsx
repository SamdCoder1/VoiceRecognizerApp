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
import * as Animatable from 'react-native-animatable';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

// App Running Successfully. In Ios listens longer period of time.

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

const Home = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [updatedDataArray, setUpdatedDataArray] = useState(data);
  const [result, setResult] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isProcessedTranscript, setIsProcessedTranscript] = useState(false);

  useEffect(() => {
    Voice.onSpeechStart = () => setIsListening(true);
    Voice.onSpeechEnd = () => setIsListening(false);
    Voice.onSpeechResults = e => setResult(e.value[0]);

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const startListening = async () => {
    try {
      await Voice.start('en-US');
      setResult('');
    } catch (e) {
      console.error(e);
    }
  };

  const handleSelect = item => {
    // If there is a selected item and a result to save, save the result to processedTranscript
    if (selectedItem && result) {
      const updatedArray = updatedDataArray.map(dataItem =>
        dataItem.name === selectedItem.name
          ? {...dataItem, processedTranscript: result}
          : dataItem,
      );
      // console.log('updated array----', partialResult);

      setUpdatedDataArray(updatedArray);
    }

    // If the tapped item has a processedTranscript, display it; otherwise, start listening
    if (item.processedTranscript) {
      setIsProcessedTranscript(true);
      setResult(item.processedTranscript);
    } else {
      setIsProcessedTranscript(false);
      setResult('');
      startListening();
    }

    // Update the selected item
    setSelectedItem(item);
  };

  function onRetry(item) {
    // console.log(item.processedTranscript);
    item.processedTranscript = '';
    handleSelect(item);
  }

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
                {selectedItem?.name === item.name && isListening ? (
                  <Icon name="mic" size={wp(5)} color="red" />
                ) : (
                  <View style={{flexDirection: 'row', gap: wp(2)}}>
                    <Icon name="mic-off" size={wp(5)} color="black" />
                    {selectedItem?.name === item.name &&
                      isProcessedTranscript && (
                        <TouchableOpacity
                          onPress={() => {
                            onRetry(item);
                          }}>
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
        <TouchableOpacity
          onPress={() => {
            console.log(updatedDataArray);
          }}>
          <Animatable.Text animation="fadeIn" style={styles.listeningText}>
            Recorded Text
          </Animatable.Text>
        </TouchableOpacity>

        {/* <Animatable.View animation="slideInDown"> */}
        <TextInput
          style={styles.textInput}
          value={result}
          onChangeText={text => setResult(text)}
          placeholder="Speech to Text Result"
          multiline
        />
        {/* </Animatable.View> */}
      </View>
    </ScrollView>
  );
};

export default Home;

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
});
