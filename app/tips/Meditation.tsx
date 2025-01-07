import React from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { WebView } from 'react-native-webview';

const Meditations = () => {
  const navigation = useNavigation();

  const handleNavigation = (page) => {
    navigation.navigate(page);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <SafeAreaView style={styles.safeAreaView}>
        <Text style={styles.title}>Meditation</Text>
      <View style={styles.bodyContainer}>
        {/* Video Section */}
        <View style={styles.tipContainer}>
          <View style={styles.videoContainer}>
            <WebView
              style={styles.webView}
              source={{ uri: 'https://www.youtube.com/embed/OxJXSjBenFs?si=Fl7decfrbd-_MVnP' }}
              allowsFullscreenVideo
            />
          </View>
          <Text style={styles.tipText}>
            This is a general music that can be used in all meditations. It consists of sounds at 528 Hz,
            which is considered a stress-relieving frequency. But each of us is different. Search until
            you find the music that will help you meditate. Or maybe you need to be in silence? Whatever
            helps you is good!
          </Text>
        </View>

        {/* General Tips */}
        <View style={styles.tipContainer}>
          <Text style={styles.tipTitle}>General Tips for Good Meditation</Text>
          <Text style={styles.tipText}>
            <Text style={styles.boldText}>Breathing:</Text> Try techniques like Circular Breathing: inhale for 4 seconds, hold for 4 seconds,
            exhale for 4 seconds, and hold for 4 seconds. Repeat 7 times. Another method is Dr. Joe Dispenza's
            technique, which involves contracting core muscles while holding your breath.
          </Text>
          <Text style={styles.tipText}>
            <Text style={styles.boldText}>Posture:</Text> Avoid leaning back too much to prevent falling asleep. Find a posture that is slightly
            uncomfortable but not distracting.
          </Text>
          <Text style={styles.tipText}>
            <Text style={styles.boldText}>The Environment:</Text> Ensure no distractions from screens or noise. Make this your personal time!
          </Text>
          <Text style={styles.tipText}>
            <Text style={styles.boldText}>When to Meditate:</Text> Ideal times are early morning (3-4 AM) or before bedtime, when brain waves
            are in alpha or theta states.
          </Text>
        </View>

        {/* Meditation Sections */}
        {[
          { title: 'Sea Meditation', content: 'Imagine standing on a seashore... The distressing thought comes from the sea like a wave...' },
          { title: 'Candle Meditation', content: 'Light a candle and focus on its flame for 15 minutes. Let your thoughts drift like clouds...' },
          {
            title: 'Chakra Cleaning',
            content: 'Visualize light entering your feet and moving through the energy centers: perineum, below the navel, diaphragm, heart, throat, between the eyebrows, and crown.',
          },
          {
            title: 'Ball of Light',
            content: 'Imagine yourself surrounded by a ball of light that protects you from all thoughts and cares for your needs.',
          },
          {
            title: 'Spiritual Help',
            content: 'Ask a higher power to take your disturbing thoughts away. This practice can significantly improve your mental peace.',
          },
        ].map((meditation, index) => (
          <View key={index} style={styles.tipContainer}>
            <Text style={styles.tipTitle}>{meditation.title}</Text>
            <Text style={styles.tipText}>{meditation.content}</Text>
          </View>
        ))}

        {/* Back to Tips */}
        <TouchableOpacity onPress={() => handleNavigation('TipsMain')} style={styles.backButton}>
          <Text style={styles.backButtonText}>Back to Tips</Text>
        </TouchableOpacity>
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
  heading: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#6F5D6A',
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
  boldText: {
    fontWeight: 'bold',
  },
  videoContainer: {
    height: 200,
    marginBottom: 10,
  },
  webView: {
    flex: 1,
  },
  backButton: {
    marginTop: 20,
    alignSelf: 'center',
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#bf4da2',
  },
  backButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#6F5D6A',
    textAlign: 'center',
  },
});

export default Meditations;
