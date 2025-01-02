
import React, { useEffect, useState } from 'react';
import { TouchableOpacity, ScrollView, View, Text, StyleSheet, Linking } from 'react-native';

const Home = () => {
  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
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
            onPress={() =>
              Linking.openURL('https://www.youtube.com/embed/yaahVCL9Cdw?si=8mWHmYz4JyOufMrh')
            }
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
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Home;
