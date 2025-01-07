import React from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Tips = () => {
  const navigation = useNavigation();

  const handleNavigation = (page: string) => {
    navigation.navigate(page);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <SafeAreaView style={styles.safeAreaView}>
        <Text style={styles.title}>Tips</Text>
      <View style={styles.bodyContainer}>
        {/* Meditation Section */}
        <View style={styles.tipContainer}>
          <Text 
            style={styles.tipTitle}
            onPress={() => handleNavigation('Meditation')}
          >
            Meditation
          </Text>
          <Text style={styles.tipText}>
            Meditation is the oldest tool for achieving peace of mind.{"\n"}
            We all know how difficult it is to stay present in silence when your thoughts are racing, but hey - that's why we're here, right?{"\n"}
            Here's the{" "}
            <Text
              style={styles.linkText}
              onPress={() => handleNavigation('Meditation')}
            >
              meditation page
            </Text>.
          </Text>
          <Text style={styles.tipText}>
            Even if you've never succeeded - don't despair! You might find a new idea that's exactly what you've been looking for...
          </Text>
        </View>

        {/* Sport Section */}
        <View style={styles.tipContainer}>
          <Text 
          style={styles.tipTitle}
          onPress={() => handleNavigation('Sport')}
          >
            Sport and Dance
          </Text>
          <Text style={styles.tipText}>
            Moving our body back to balance and health can do the trick.{"\n"}
            Here's the{" "}
            <Text
              style={styles.linkText}
              onPress={() => handleNavigation('Sport')}
            >
              sport page
            </Text>.
          </Text>
          <Text style={styles.tipText}>
            There is the right sport for everybody. Hope you will get some new ideas on how to help yourself overcome your thoughts.
          </Text>
        </View>

        {/* Healing Section */}
        <View style={styles.tipContainer}>
          <Text 
            style={styles.tipTitle}
            onPress={() => handleNavigation('Healing')}
          >
            Healing
          </Text>
          <Text style={styles.tipText}>
          The torture we feel when our thoughts overwhelm us is not necessary. 
          There are many ways to relieve tension and release blockages. 
          Therapy can calm us down and give us a chance to resolve our disturbing thoughts..{"\n"}
            Here's the{" "}
            <Text
              style={styles.linkText}
              onPress={() => handleNavigation('Healing')}
            >
              healing page
            </Text>.
          </Text>
          <Text style={styles.tipText}>
            Find your healing method in this page.
          </Text>
        </View>
      </View>
      </SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    padding: 5,
    flexGrow: 1,
    backgroundColor: '#F3EFF0',
  },
  bodyContainer: {
    flex: 1,
    paddingTop: 0,
    paddingHorizontal:20,
  },
  safeAreaView: {
    flex: 1,
    backgroundColor: '#F3EFF0',
    overflow: 'visible',
  },
  tipContainer: {
    marginBottom: 20,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tipTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#bf4da2',
  },
  tipText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#6F5D6A',
    marginBottom: 10,
  },
  linkText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#bf4da2',
    textDecorationLine: 'underline',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#6F5D6A',
    textAlign: 'center',
  },
});

export default Tips;
