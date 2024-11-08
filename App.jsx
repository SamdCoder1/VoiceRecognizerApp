import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Home from './src/screens/Home';
import Home2 from './src/screens/Home2';
import Home3 from './src/screens/Home3';
import Home4 from './src/screens/Home4';
import Home5 from './src/screens/Home5';
import Home6 from './src/screens/Home6';

export default function App() {
  return (
    <SafeAreaView style={{flex: 1}}>
      {/* <Home /> */}
      {/* <Home2 /> */}
      {/* <Home3 /> */}
      <Home4 />
      {/* <Home5/> */}
      {/* <Home6/> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
