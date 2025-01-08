import React, { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, Linking , SafeAreaView} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Sport = () => {
  const navigation = useNavigation();
  const [activeSection, setActiveSection] = useState(null);

  const handleSectionToggle = (section) => {
    setActiveSection(activeSection === section ? null : section);
  };

  const handleNavigation = (page) => {
    navigation.navigate(page);
  };

  const openYouTubeLink = (url) => {
    Linking.openURL(url);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <SafeAreaView style={styles.safeAreaView}>
        <Text style={styles.title}>Sport and dance</Text>
      <View style={styles.bodyContainer}>
        <View style={styles.tipContainer}>
          <Text style={styles.tipText}>
            Thoughts are, after all, connections in the brain—synapses.{"\n"}
            The current information says that by the age of 35, more than 90% of our thoughts are old circuits, very, very used circuits!{"\n"}
            Only a few new thoughts manage to make their way through the noisy and well-established crowd of old synapses.{"\n"}
            The challenge is to understand that most of our thoughts are... well, let's face it—they are garbage!{"\n"}
            There's something comforting about knowing that{" "}
            <Text style={styles.boldText}>WE ARE NOT OUR THOUGHTS</Text>
            , so we can release our identification with them and treat them as a physical matter that needs to be addressed.{"\n"}
            A good support for the process will be to use sport for calming and balancing the body and mind.{"\n"}
            Below is a list of activities that can help you, along with a video that shows the benefits of sport for our mental health.
          </Text>
          <TouchableOpacity
            style={styles.videoLink}
            onPress={() => openYouTubeLink('https://www.youtube.com/embed/rkZl2gsLUp4?si=2uxn6sEynCc2Hx0o')}
          >
            <Text style={styles.videoLinkText}>Watch Video</Text>
          </TouchableOpacity>
        </View>

        {/* Swimming Section */}
        <View style={styles.tipContainer}>
          <TouchableOpacity onPress={() => handleSectionToggle('swimming')}>
            <Text style={styles.tipTitle}>Swimming {activeSection === 'swimming' ? '▼' : '▶'}</Text>
          </TouchableOpacity>
          {activeSection === 'swimming' && (
            <View>
                <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.customButton}
                  onPress={() => openYouTubeLink('https://www.youtube.com/embed/Bnv4Ti11pgk?si=DqBmHaeKKSygalFY')}
                >
                  <Text style={styles.buttonText}>Watch Video</Text>
                </TouchableOpacity>
                <Text style={styles.tipText}>
                  Just being in water lowers the level of brain waves within about 20 minutes (the head should be at least as deep as the cheeks).{"\n"}
                  Add to this physical exertion, breath-holding (which has a strong effect on the brain), and the tactile sensation that the water provides—full coverage and hydrostatic pressure on all parts of the body.{"\n"}
                  The video explains in detail the benefits of swimming for mental health.
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Dancing Section */}
        <View style={styles.tipContainer}>
          <TouchableOpacity onPress={() => handleSectionToggle('dancing')}>
            <Text style={styles.tipTitle}>Dancing {activeSection === 'dancing' ? '▼' : '▶'}</Text>
          </TouchableOpacity>
          {activeSection === 'dancing' && (
            <View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.customButton}
                  onPress={() => openYouTubeLink('https://www.youtube.com/embed/_0R_0n41y90?si=95ha11fvzI1NQFSU')}
                >
                  <Text style={styles.buttonText}>Watch Video</Text>
                </TouchableOpacity>
                <Text style={styles.tipText}>
                  Dance has many different facets of benefit—social, emotional, and physical.{"\n"}
                  Music and movement together bring us into the present moment almost effortlessly, leaving out the disturbing thoughts.
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Yoga Section */}
        <View style={styles.tipContainer}>
          <TouchableOpacity onPress={() => handleSectionToggle('yoga')}>
            <Text style={styles.tipTitle}>Yoga {activeSection === 'yoga' ? '▼' : '▶'}</Text>
          </TouchableOpacity>
          {activeSection === 'yoga' && (
            <View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.customButton}
                  onPress={() => openYouTubeLink('https://www.youtube.com/embed/_8kV4FHSdNA?si=rvYTU3WO6ZzAMGCh')}
                >
                  <Text style={styles.buttonText}>Watch Video</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.tipText}>
                The concentration required in most yoga postures—balance and stillness—keeps the mind focused on physical action instead of idle thoughts.{"\n"}
                Many postures cross the midline (from right to left and back), which connects the right and left brain and improves their function.{"\n"}
                Here is a brief explanation of yoga's benefits.
              </Text>
            </View>
          )}
        </View>

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
    color: '#bf4da2',
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
  buttonContainer: {
    marginTop: 20,
    alignItems: 'center',
    width:'100%',
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#6F5D6A',
    paddingHorizontal: 25,
  },
});

export default Sport;
