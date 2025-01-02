import React, { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Healing = () => {
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
      <View style={styles.bodyContainer}>
        <Text style={styles.heading}>Treatments</Text>

        <View style={styles.tipContainer}>
          <Text style={styles.tipText}>
            We are currently inundated with a multitude of body, mind, and spirit treatment options designed to relieve overthinking.{"\n"}
            Here we will offer 3 treatments that combine the three—body, mind, and spirit—because we do need to address all of them when dealing with our thoughts...
          </Text>
        </View>

        {/* Hydrotherapy Section */}
        <View style={styles.tipContainer}>
          <TouchableOpacity onPress={() => handleSectionToggle('hydrotherapy')}>
            <Text style={styles.tipTitle}>
              Hydrotherapy {activeSection === 'hydrotherapy' ? '▼' : '▶'}
            </Text>
          </TouchableOpacity>
          {activeSection === 'hydrotherapy' && (
            <View>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.customButton}
                    onPress={() => openYouTubeLink('https://www.youtube.com/embed/ywiuWAmHFXM?si=b5qLgvBUMyGkuZTn')}
                  >
                    <Text style={styles.buttonText}>Watch Video</Text>
                  </TouchableOpacity>
                  <Text style={styles.tipText}>
                    The warm water treatment takes us back to the time when we were in our mother's womb—a time when we didn't have any bothersome thoughts.{"\n"}
                    Almost universally, this is a treatment that most people like very much. Liberating, relaxing, disconnecting for a while from disturbing thoughts...
                  </Text>
              </View>
            </View>
          )}
        </View>

        {/* Massage Section */}
        <View style={styles.tipContainer}>
          <TouchableOpacity onPress={() => handleSectionToggle('massage')}>
            <Text style={styles.tipTitle}>Massage {activeSection === 'massage' ? '▼' : '▶'}</Text>
          </TouchableOpacity>
          {activeSection === 'massage' && (
            <View>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.customButton}
                    onPress={() => openYouTubeLink('https://www.youtube.com/embed/-34tej5SgVg?si=xZ7Jhvc_H-Quum6t')}
                  >
                    <Text style={styles.buttonText}>Watch Video</Text>
                  </TouchableOpacity>
                  <Text style={styles.tipText}>
                    "The body affects the brain just as much as the brain affects the body."{"\n"}
                    An interesting article about a study conducted on the effects of massage on patients with chronic fatigue, anxiety, and depression.
                  </Text>
              </View>
            </View>
          )}
        </View>

        {/* Acupuncture Section */}
        <View style={styles.tipContainer}>
          <TouchableOpacity onPress={() => handleSectionToggle('acupuncture')}>
            <Text style={styles.tipTitle}>Acupuncture {activeSection === 'acupuncture' ? '▼' : '▶'}</Text>
          </TouchableOpacity>
          {activeSection === 'acupuncture' && (
            <View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.customButton}
                  onPress={() => openYouTubeLink('https://www.youtube.com/embed/FAw2s6KsWe4?si=3UK0r92PoPgjPlFX')}
                >
                  <Text style={styles.buttonText}>Watch Video</Text>
                </TouchableOpacity>
                <Text style={styles.tipText}>
                  A lecture on acupuncture and its overall effect on the body/mind.{"\n"}
                  It is a thousands-year-old method of success and high efficiency. You need to overcome the fear of the needles (which are almost imperceptible!).
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Back to Tips */}
        <TouchableOpacity onPress={() => handleNavigation('TipsMain')} style={styles.backButton}>
          <Text style={styles.backButtonText}>Back to Tips</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    padding: 16,
    flexGrow: 1,
    backgroundColor: '#F3EFF0',
  },
  bodyContainer: {
    flex: 1,
    padding: 20,
  },
  heading: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#6F5D6A',
  },
  tipContainer: {
    marginBottom: 30,
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
});

export default Healing;
