import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Home from './src/screens/Home';
import Home2 from './src/screens/Home2';
import Home3 from './src/screens/Home3';

export default function App() {
  return (
    <View style={{flex: 1}}>
      {/* <Home /> */}
      {/* <Home2 /> */}
      <Home3/>
    </View>
  );
}

const styles = StyleSheet.create({});
