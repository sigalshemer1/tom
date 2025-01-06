import React, { useEffect, useState } from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TouchableOpacity, FlatList, TextInput, ScrollView, View, Text, StyleSheet, Linking, Platform } from 'react-native';

const Home = () => {
  interface Thought {
    id: number;
    level: number;
    created: Date;
  }

  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [level, setLevel] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);

  const db = useSQLiteContext();

  useEffect(() => {
    const fetchThoughts = async () => {
      if (selectedDate) {
        const startDate = new Date(selectedDate);
        const endDate = new Date(selectedDate);

        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);

        try {
          const result = await db.getAllAsync('SELECT * FROM thoughts');
          setThoughts(result);
        } catch (error) {
          console.error('Error fetching thoughts:', error);
          setThoughts([]);
        }
      }
    };

    fetchThoughts();
  }, [selectedDate, db]);

  const insertThought = async () => {
    try {
      const formattedDate = selectedDate.toISOString();
      const result = await db.runAsync('INSERT INTO thoughts (level,created) VALUES (?,?)', level, formattedDate);
      setLevel('');
      setSelectedDate(new Date());
    } catch (error) {
      console.error('Error in insertThought:', error);
    }
  };

  const handleDateChange = (event, date) => {
    setDatePickerVisibility(false);
    if (date) setSelectedDate(date);
  };

  const handleTimeChange = (event, date) => {
    setTimePickerVisibility(false);
    if (date) setSelectedDate(date);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <View>
        {/* Date Picker */}
        <TouchableOpacity onPress={() => setDatePickerVisibility(true)} style={styles.customButton}>
          <Text style={styles.buttonText}>
            Select Date: {selectedDate.toDateString()}
          </Text>
        </TouchableOpacity>
        {isDatePickerVisible && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDateChange}
          />
        )}

        {/* Time Picker */}
        <TouchableOpacity onPress={() => setTimePickerVisibility(true)} style={styles.customButton}>
          <Text style={styles.buttonText}>
            Select Time: {selectedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </TouchableOpacity>
        {isTimePickerVisible && (
          <DateTimePicker
            value={selectedDate}
            mode="time"
            is24Hour={true}
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleTimeChange}
          />
        )}

        {/* Input for Level */}
        <View>
          <TextInput
            value={level}
            onChangeText={setLevel}
            placeholder="Level"
            style={styles.inputWrap}
          />
          <TouchableOpacity onPress={insertThought} style={styles.customButton}>
            <Text style={styles.buttonText}>Save Thought</Text>
          </TouchableOpacity>
        </View>

        <Text>Thoughts Table (Debug)</Text>
        {thoughts.map((item, index) => (
          <View key={index}>
            <Text>Level: {item.level} - {new Date(item.created).toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</Text>
          </View>
        ))}
      </View>

      <View style={styles.bodyContainer}>
        <Text style={styles.heading}>Welcome</Text>
        <View style={styles.textContainer}>
          <Text style={styles.normalText}>
            Welcome to <Text style={styles.boldText}>ThinkOmeter</Text>, where you will learn your thought’s patterns.
          </Text>
          <Text style={styles.normalText}>
            Most of our thinking (some say 90% of them, by the age of 35) are habitual old circuits running, uncontrolled, in and out of our consciousness.
          </Text>
          <Text style={styles.normalText}>
            Since our thoughts can make us extremely miserable (as most of us know), measuring and understanding our thought patterns can provide a good tool to begin to control the impact of our thoughts on our quality of life.
          </Text>
          <Text style={styles.normalText}>
            So <Text style={styles.boldText}>let's shake them off our brain!</Text> Here is a short introduction video that will explain how to use this app.
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.customButton}
            onPress={() => Linking.openURL('https://www.youtube.com/embed/yaahVCL9Cdw?si=8mWHmYz4JyOufMrh')}
          >
            <Text style={styles.buttonText}>Watch Introduction Video</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    padding: 16,
    backgroundColor: '#F3EFF0',
  },
  bodyContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F3EFF0',
  },
  heading: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#6F5D6A',
  },
  textContainer: {
    marginBottom: 20,
  },
  normalText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 10,
    color: '#6F5D6A',
  },
  boldText: {
    fontWeight: 'bold',
    color: '#6F5D6A',
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  customButton: {
    backgroundColor: '#bf4da2',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  inputWrap: {
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 7,
    backgroundColor: '#FFFBFC',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    marginTop: 6,
    padding: 10,
  },
});

export default Home;
