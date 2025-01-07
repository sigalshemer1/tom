import { Image, SafeAreaView, StyleSheet, ScrollView, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing'; // Optional for sharing
import { useEffect, useState } from 'react';

export default function Intro() {
  const db = useSQLiteContext();

  const exportData = async () => {
    const data = await db.getAllAsync('SELECT * FROM thoughts');

    // Convert data to JSON
    const jsonData = JSON.stringify(data);
    const exportPath = `${FileSystem.documentDirectory}exportedData.json`;

    try {
      // Write the JSON data to a file
      await FileSystem.writeAsStringAsync(exportPath, jsonData);

      // Now share the file
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(exportPath);
        Alert.alert('Success', `Data exported and ready to share!`);
      } else {
        Alert.alert('Error', 'Sharing is not available on this device.');
      }
    } catch (error) {
      console.error('Error writing or sharing file:', error);
      Alert.alert('Error', 'Failed to export and share the data.');
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <TouchableOpacity 
        style={styles.customButton}
        onPress={exportData}
      >
        <Text>ExportDB</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F3EFF0',
  },
  customButton: {
    backgroundColor: '#bf4da2',
    paddingVertical: 12,
    marginBottom:10,
    paddingHorizontal: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
    width:'100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
})