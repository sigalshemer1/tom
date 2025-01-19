import { Image, SafeAreaView, StyleSheet, ScrollView, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing'; 
import { useRouter } from 'expo-router'; // Import the useRouter hook
import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAppContext } from './AppContext';
import { Asset } from 'expo-asset';

import Icon from 'react-native-vector-icons/Ionicons';

type RootStackParamList = {
  Home: undefined;
  Intro: undefined;
  Settings: undefined;
};

type SettingsNavigationProp = StackNavigationProp<RootStackParamList, 'Intro'>; 

export default function Settings() {
    const navigation = useNavigation<SettingsNavigationProp>();
    const { resetIntroFlag, setResetIntroFlag ,setIsButtonVisible} = useAppContext();
  const db = useSQLiteContext();


  const showIntro = async () => {
    setIsButtonVisible(false);
    setResetIntroFlag(true);     
  }
  
  useEffect(() => {
    if (resetIntroFlag===true) {
      navigation.navigate('Home');
    }
  }, [resetIntroFlag]);


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
  
  //functions to run the akgorithm on the thoughts table results
  //************************************************************/
/**
 * Predict the top 3 peak hours for thought intensity.
 *
 * @param {Array} data - Array of rows from the database. Each row must have 'level' and 'created' properties.
 * @returns {Array} - Array of objects with the top 3 peak hours and their predicted intensity levels.
 */
function predictTop2RecurringPeaks(data) {
  // Group by date and calculate the daily average level
  const dailyData = data.reduce((acc, entry) => {
      const date = entry.date;
      if (!acc[date]) {
          acc[date] = { levels: [], entries: [] };
      }
      acc[date].levels.push(entry.level);
      acc[date].entries.push(entry);
      return acc;
  }, {});

  // Identify peaks above the daily average for each day
  const peaksAboveAverage = Object.values(dailyData).flatMap(({ levels, entries }) => {
      const dailyAverage = levels.reduce((sum, level) => sum + level, 0) / levels.length;
      return entries.filter(entry => entry.level > dailyAverage);
  });

  // Count occurrences of each hour across all peaks
  const peakFrequencies = peaksAboveAverage.reduce((acc, entry) => {
      const hour = entry.hour;
      if (!acc[hour]) {
          acc[hour] = 0;
      }
      acc[hour] += 1;
      return acc;
  }, {});

  // Convert frequencies to an array and sort by count
  const sortedFrequencies = Object.keys(peakFrequencies).map(hour => ({
      hour: parseInt(hour, 10),
      frequency: peakFrequencies[hour]
  })).sort((a, b) => b.frequency - a.frequency);

  // Return the top 2 most frequent peak hours
  return sortedFrequencies.slice(0, 2);
}


/**
 * Retrieve data from the SQLite database, analyze it, and return the top 3 weekly peak hours.
 *
 * @param {Object} db - SQLite database connection object.
 * @returns {Promise<Array>} - Promise resolving to the top 3 weekly peak hours and their predicted levels.
 */
async function getTop2RecurringPeaks(db) {
  try {
      // Query data from the SQLite table
      const result = await db.getAllAsync('SELECT * FROM thoughts ORDER BY created ASC;');

      // Prepare the data for processing
      const data = result.map(row => ({
          level: row.level,
          hour: new Date(row.created).getHours(),
          date: new Date(row.created).toISOString().split('T')[0] // Extract date in YYYY-MM-DD format
      }));

      // Predict the top 2 recurring peak hours
      return predictTop2RecurringPeaks(data);
  } catch (error) {
      console.error('Error fetching data: ', error);
      throw error;
  }
}

  // Call this function where you need the top 3 peaks, e.g., in a component's useEffect or event handler.
  async function fetchTop3Peaks() {
    try {
      const top3Peaks = await getTop2RecurringPeaks(db);
      console.log('Top 3 Peak Hours:', top3Peaks);
    } catch (error) {
      console.error('Error fetching top 3 peaks:', error);
    }
  }
  

  ////////////////////////////////////////////////////////////////

  const insertRows = async () => {
    try {
      // Load the file from the assets folder
      const jsonData = [
        {"id":1,"level":2,"created":"2025-01-08 06:59:24"},
        {"id":2,"level":3,"created":"2025-01-08 09:25:05"},
        {"id":3,"level":3,"created":"2025-01-08 10:50:05"},
        {"id":4,"level":4,"created":"2025-01-08 12:52:16"},
        {"id":5,"level":3,"created":"2025-01-08 13:14:51"},
        {"id":6,"level":3,"created":"2025-01-08 15:15:13"},
        {"id":7,"level":3,"created":"2025-01-08 16:43:04"},
        {"id":8,"level":3,"created":"2025-01-08 18:59:31"},
        {"id":9,"level":3,"created":"2025-01-08 20:07:46"},
        {"id":10,"level":2,"created":"2025-01-09 08:36:28"},
        {"id":11,"level":2,"created":"2025-01-09 10:31:08"},
        {"id":12,"level":2,"created":"2025-01-09 11:01:46"},
        {"id":13,"level":2,"created":"2025-01-09 12:44:48"},
        {"id":14,"level":2,"created":"2025-01-09 14:16:56"},
        {"id":15,"level":2,"created":"2025-01-09 17:58:47"},
        {"id":16,"level":2,"created":"2025-01-09 21:30:16"},
        {"id":17,"level":3,"created":"2025-01-10 12:17:55"},
        {"id":18,"level":3,"created":"2025-01-10 14:18:58"},
        {"id":19,"level":3,"created":"2025-01-10 14:19:00"},
        {"id":20,"level":3,"created":"2025-01-10 15:26:43"},
        {"id":21,"level":5,"created":"2025-01-10 17:58:03"},
        {"id":22,"level":4,"created":"2025-01-10 19:00:16"},
        {"id":23,"level":4,"created":"2025-01-10 19:00:43"},
        {"id":24,"level":4,"created":"2025-01-10 21:12:45"},
        {"id":25,"level":4,"created":"2025-01-10 22:42:02"},
        {"id":26,"level":4,"created":"2025-01-11 06:37:47"},
        {"id":27,"level":3,"created":"2025-01-11 09:41:03"},
        {"id":28,"level":4,"created":"2025-01-11 10:41:17"},
        {"id":29,"level":3,"created":"2025-01-11 14:05:50"},
        {"id":30,"level":3,"created":"2025-01-11 14:06:19"},
        {"id":31,"level":3,"created":"2025-01-11 17:53:50"},
        {"id":32,"level":4,"created":"2025-01-11 19:09:42"},
        {"id":33,"level":3,"created":"2025-01-11 21:25:48"},
        {"id":34,"level":5,"created":"2025-01-11 22:25:49"},
        {"id":35,"level":4,"created":"2025-01-11 23:21:32"},
        {"id":36,"level":3,"created":"2025-01-12 07:38:48"},
        {"id":37,"level":3,"created":"2025-01-12 08:30:12"},
        {"id":38,"level":3,"created":"2025-01-12 10:35:58"},
        {"id":39,"level":4,"created":"2025-01-12 13:12:05"},
        {"id":40,"level":4,"created":"2025-01-12 14:22:09"},
        {"id":41,"level":3,"created":"2025-01-12 15:28:51"},
        {"id":42,"level":3,"created":"2025-01-12 17:18:25"},
        {"id":43,"level":3,"created":"2025-01-12 17:49:22"},
        {"id":44,"level":3,"created":"2025-01-12 18:41:40"},
        {"id":45,"level":3,"created":"2025-01-12 20:47:05"},
        {"id":46,"level":3,"created":"2025-01-13 06:49:28"},
        {"id":47,"level":3,"created":"2025-01-13 08:29:06"},
        {"id":48,"level":3,"created":"2025-01-13 09:01:13"},
        {"id":49,"level":3,"created":"2025-01-13 09:13:32"},
        {"id":50,"level":4,"created":"2025-01-13 10:16:51"},
        {"id":51,"level":4,"created":"2025-01-13 12:54:28"},
        {"id":52,"level":3,"created":"2025-01-13 14:47:55"},
        {"id":53,"level":3,"created":"2025-01-13 16:52:32"},
        {"id":54,"level":3,"created":"2025-01-13 18:11:20"},
        {"id":55,"level":3,"created":"2025-01-13 19:57:30"},
        {"id":56,"level":3,"created":"2025-01-13 19:57:31"},
        {"id":57,"level":3,"created":"2025-01-13 20:57:31"},
        {"id":58,"level":3,"created":"2025-01-13 21:34:23"},
        {"id":59,"level":3,"created":"2025-01-14 06:43:36"},
        {"id":60,"level":3,"created":"2025-01-14 07:41:00"},
        {"id":61,"level":3,"created":"2025-01-14 09:00:34"},
        {"id":62,"level":3,"created":"2025-01-14 14:21:59"},
        {"id":63,"level":4,"created":"2025-01-14 18:57:15"},
        {"id":64,"level":4,"created":"2025-01-14 20:15:25"},
        {"id":65,"level":4,"created":"2025-01-14 22:34:22"},
        {"id":66,"level":4,"created":"2025-01-15 00:21:47"},
        {"id":67,"level":5,"created":"2025-01-15 08:05:51"},
        {"id":68,"level":3,"created":"2025-01-15 12:22:47"},
        {"id":69,"level":2,"created":"2025-01-15 14:05:27"},
        {"id":70,"level":4,"created":"2025-01-15 17:31:41"}
      ];
      
      jsonData.forEach(async ({ level, created }) => {
        await db.runAsync(
          'INSERT INTO thoughts (level, created) VALUES (?, ?)',
          [level, created]
        );
      });
       
    } catch (error) {
      console.error('Error inserting rows:', error);
      Alert.alert('Error', 'Failed to insert rows into the database.');
    }
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
                  Insert json
              </Text>
              <TouchableOpacity onPress={insertRows}>
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