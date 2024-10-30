import React, {useState, useEffect} from 'react';
import { View, Text, TouchableOpacity, ScrollView, Button, StyleSheet, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Voice from '@react-native-voice/voice';
import LottieView from 'lottie-react-native';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
  } from 'react-native-responsive-screen';
  import * as Animatable from 'react-native-animatable'

const data = [
  { name: '1783 BPS', originalTranscript: '', processedTranscript: '' },
  { name: '1811 BOP', originalTranscript: '', processedTranscript: '' },
  { name: '1792 FBOP', originalTranscript: '', processedTranscript: '' },
  { name: '1810 FBOP', originalTranscript: '', processedTranscript: '' },
  { name: '1407 BOP1', originalTranscript: '', processedTranscript: '' },
  { name: '1313 BOP1', originalTranscript: '', processedTranscript: '' },
  { name: '1808 FBOP1', originalTranscript: '', processedTranscript: '' },
  { name: '1806 FBOP1', originalTranscript: '', processedTranscript: '' },
  { name: '1794 GBOP1', originalTranscript: '', processedTranscript: '' },
  { name: '1813 GBOP1', originalTranscript: '', processedTranscript: '' },
  { name: '1786 FOF1', originalTranscript: '', processedTranscript: '' },
  { name: '1801 FOF1', originalTranscript: '', processedTranscript: '' },
];

const Home = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [generatedData, setGeneratedData] = useState('');
  const [updatedDataArray, setUpdatedDataArray] = useState([]);
  const [result, setResult] = useState('');
  const [partialResult, setPartialResult] = useState('');
  const [isListening, setIsListening] = useState(false);

//   console.log("re-render");
  

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
      setGeneratedData(result);
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


  const handleSelect = (item) => {
    setSelectedItem(item);
    startListening();
    // Generate some data based on selection (you can customize this)
    // setGeneratedData(`Generated data for ${item.name}`);
  };


//   let updatedDataArray = [];

  const handleSave = () => {
    // console.log('generatedData---', generatedData);
    
    if (selectedItem) {
      const updatedItem = {
        ...selectedItem,
        processedTranscript: generatedData,
      };

      // Push updated item object to new Array
    //   console.log('Saved:', updatedItem);
    //   updatedDataArray.push(updatedItem);
      setUpdatedDataArray(updatedItem)
    //   console.log('Saved ARRAY-----:', updatedDataArray);

      // Optionally reset state
      setSelectedItem(null);
      setGeneratedData('');
    }
  };
//   console.log('Saved ARRAY-----:', updatedDataArray);
  

  return (
    <ScrollView style={{ flexGrow: 1, padding: 20,  }}>

        <View style={{height:hp(60), borderWidth:wp(1), padding:wp(5), borderColor: '#b6d1fc', elevation:3}}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {data.map((item, index) => (
                <TouchableOpacity
                    key={index}
                    onPress={() => handleSelect(item)}
                    style={{
                    padding: 10,
                    backgroundColor: selectedItem?.name === item.name ? '#b6d1fc' : '#f0f0f0',
                    marginVertical: 5,
                    borderRadius: 5,
                    }}
                >
                    <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                        <Text style={{color:'black', fontSize:wp(4)}}>{item.name}</Text>
                        {selectedItem?.name === item.name && isListening ? 
                        <Icon
                            name="mic"
                            size={wp(5)}
                            color="black"
                            // style={{marginLeft: wp(1)}}
                            /> : null}
                    </View>
                </TouchableOpacity>
                ))}
            </ScrollView>
        </View>

        <View style={{ marginTop:hp(3)}} >
            {isListening && <Animatable.Text animation="fadeIn" style={{fontSize:wp(6), textAlign:'center',fontWeight:'bold', color:'gray'}}>Listening...</Animatable.Text>}
            <TextInput 
            style={{marginTop:hp(1), height:hp(10), borderColor:'black', borderWidth:wp(0.5)}} 
            value={result}
            onChangeText={(text) => setResult(text)}
            />
        </View>
            
        <View style={{flexDirection:'row', justifyContent:'space-evenly', marginTop:hp(5)}}>
            {/* Add New Address Button */}
                <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => {
                        cancelListening();
                    }}>
                    <Text style={styles.editButtonText}>CANCEL</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.stopButton}
                    onPress={() => {
                        stopListening();
                    }}>
                    <Text style={styles.editButtonText}>STOP</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.saveButton}
                    onPress={() => {
                        handleSave();
                    }}>
                    <Text style={styles.editButtonText}>SAVE</Text>
                </TouchableOpacity>
        </View>
      {/* {selectedItem && (
        <View style={{ marginTop: 20 }}>
          <Text>Selected: {selectedItem.name}</Text>
          <Text>Generated Data: {generatedData}</Text>
          <Button title="Save" onPress={handleSave} />
        </View>
      )} */}
    </ScrollView>
  );
};

export default Home;

const styles = StyleSheet.create({
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
    backgroundColor: '#5f99f5',
    paddingVertical: hp(1),
    paddingHorizontal: wp(5),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: wp(2),
  },
  editButtonText: {
    color: 'white',
    fontSize: wp(4.5),
    fontWeight: 'bold',
  },
})