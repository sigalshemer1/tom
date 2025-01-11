import React, { useEffect, useState } from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import { TouchableOpacity, FlatList, SafeAreaView, Image, ScrollView, View, Text, StyleSheet, Linking } from 'react-native';

const Home = () => {
  const [level, setLevel] = useState('');
  const db = useSQLiteContext();

  const insertThought = async (level) => {
    try {
      await db.runAsync('INSERT INTO thoughts (level) VALUES (?)', level);
      setLevel(level); 

    } catch (error) {
      console.error('Error in insertThought:', error);
    }
  };

  const fetchThoughts = async () => {
    try {
      const result = await db.getAllAsync('SELECT * FROM thoughts');
    } catch (error) {
      console.error('Error fetching thoughts:', error);
    }
  };

  useEffect(() => {
    fetchThoughts();  // Call the function to fetch thoughts when the component mounts
  }, [level]);

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <SafeAreaView style={styles.safeAreaView}>
      <Text style={styles.titleOfLevels}>Choose a level</Text>
      <Text style={styles.normalText}>
        How intense is your thought right now? 
      </Text>
      <View style={styles.circleButtons}>
        <TouchableOpacity onPress={() => insertThought(1)} >
            <Image
              source={require('../assets/images/btn1.png')} 
              style={styles.icon}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => insertThought(2)} >
            <Image
              source={require('../assets/images/btn2.png')} 
              style={styles.icon}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => insertThought(3)} >
            <Image
              source={require('../assets/images/btn3.png')}  
              style={styles.icon}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => insertThought(4)} >
            <Image
              source={require('../assets/images/btn4.png')} 
              style={styles.icon}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => insertThought(5)} >
            <Image
              source={require('../assets/images/btn5.png')}  
              style={styles.icon}
            />
          </TouchableOpacity>
      </View>
      <View style={styles.bodyContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.normalText}>
            Welcome to <Text style={styles.boldText}>ThinkOmeter</Text>, where you will learn your thought’s patterns.
          </Text>
          <Text style={styles.normalText}>
            Knowing your thought patterns can help prevent negative thought waves by giving you early warning when one 
            is coming. 
          </Text>
          <Text style={styles.normalText}>
          Gradually, you will be able to recognize when a wave is approaching and learn what helps you stop it.
          </Text>
        </View>
      </View>
      </SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    paddingHorizontal: 16,
    backgroundColor: '#F3EFF0',
  },
  bodyContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F3EFF0',
  },
  safeAreaView: {
    flex: 1,
    backgroundColor: '#F3EFF0',
    overflow: 'visible',
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
  titleOfLevels:{
    fontSize: 28,
    fontWeight: 'bold',
    color: '#bf4da2',
    textAlign: 'center',
    width:'100%',

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
  icon: {
    width: 60,  // Set the size of the icon
    height: 60,
    marginLeft: 5,  // Space between the text and icon
  },
  circleButtons:{
    flexDirection: 'row', 
    justifyContent: 'space-between',  
    width: '100%', 
    marginBottom: 20,
  },
});

export default Home;
