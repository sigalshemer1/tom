import { Image , SafeAreaView, StyleSheet, ScrollView ,View, Text,TextInput, TouchableOpacity} from 'react-native';
import React from 'react'
export default function Intro() {
  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <Text>Intro</Text> 
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F3EFF0',
  },
})