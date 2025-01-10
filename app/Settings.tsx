import { Image, SafeAreaView, StyleSheet, ScrollView, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing'; 
import { useRouter } from 'expo-router'; // Import the useRouter hook
import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';

type RootStackParamList = {
  Home: undefined;
  Intro: undefined;
  Settings: undefined;
};

type SettingsNavigationProp = StackNavigationProp<RootStackParamList, 'Intro'>; 

export default function Settings() {
    const navigation = useNavigation<SettingsNavigationProp>();
  const db = useSQLiteContext();

  const showIntro = async () => {
    // Navigate to the Intro screen
    navigation.navigate('Intro');
  }
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
      } else {
        Alert.alert('Error', 'Sharing is not available on this device.');
      }
    } catch (error) {
      console.error('Error writing or sharing file:', error);
      Alert.alert('Error', 'Failed to export and share the data.');
    }
  }

  const DeleteDB = async () => {
    // Show confirmation alert
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete the database? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Delete Cancelled'),
          style: 'cancel',
        },
        {
          text: 'OK', // Confirm button
          onPress: async () => {
            try {
              await db.runAsync('DELETE FROM thoughts');
              Alert.alert('Success', 'Database has been deleted.');
            } catch (error) {
              console.error('Error deleting database:', error);
              Alert.alert('Error', 'Failed to delete the database.');
            }
          },
        },
      ],
      { cancelable: false }
    );
  };
  
  

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
        <SafeAreaView style={styles.safeAreaView}>
            <Text style={styles.title}>Settings</Text>
            <View style={styles.toolActions}>
              <Text style={styles.normalText}>
                  Show me the intro animation
              </Text>

              <TouchableOpacity onPress={showIntro}>
                <Icon name="videocam-outline" color={'#9d9099'} size={25} />
              </TouchableOpacity>
            </View>
            <View style={styles.toolActions}>
              <Text style={styles.normalText}>
                  Send me the Database
              </Text>
              <TouchableOpacity onPress={exportData}>
                <Icon name="paper-plane-outline" color={'#9d9099'} size={25} />
              </TouchableOpacity>
            </View>
            <View style={styles.toolActions}>
              <Text style={styles.normalText}>
                  Delete the Database
              </Text>
              <TouchableOpacity onPress={DeleteDB}>
              <Icon name="trash-outline" color={'#9d9099'} size={25} />
              </TouchableOpacity>
            </View>
        </SafeAreaView>
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
    marginBottom: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
    width: '50%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#6F5D6A',
  },
  safeAreaView: {
    flex: 1,
    backgroundColor: '#F3EFF0',
    overflow: 'visible',
  },
  normalText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 10,
    color: '#6F5D6A',
  },
  whiteText: {
    fontSize: 16,
    lineHeight: 20,
    marginBottom: 5,
    color: '#fff',
  },
  actionIcon: {
    width: 20,
    height: 20,
    marginHorizontal: 3,
  },
  toolActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
    marginRight: 10, 
},
});
