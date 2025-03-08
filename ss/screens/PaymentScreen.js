import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from "react-native-vector-icons/Ionicons";
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import Svg, { Circle, Path, Text as SvgText, G, Rect } from "react-native-svg";

const PaymentProcessScreen = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('home');
  const [activeStep, setActiveStep] = useState(null);

  const handleStepClick = (step) => {
    if (activeStep === step) {
      setActiveStep(null); // Close the card if clicking the same step again
    } else {
      setActiveStep(step); // Show the card for the clicked step
    }
  };

  // Render step content with custom styling for each step
  const renderStepContent = () => {
    if (!activeStep) return null;
    
    switch (activeStep) {
      case 1:
        return (
          <View style={styles.stepCard1}>
            <Text style={styles.stepNumber1}>1</Text>
            <Text style={styles.stepTitle1}>Scan & Pay -</Text>
            <View style={styles.contentContainer1}>
              <Text style={styles.contentText1}>Scan the QR code. Check the name</Text>
              <Text style={styles.companyName1}>Sunbig Solar Private Limited.</Text>
              <Text style={styles.contentText1}>Complete the payment.</Text>
            </View>
          </View>
        );
      
      case 2:
        return (
          <View style={styles.stepCard1}>
            <Text style={styles.stepNumber1}>2</Text>
            <Text style={styles.stepTitle1}>Save Details</Text>
            <View style={styles.contentContainer2}>
              <Text style={styles.contentText1}> Write down the <Text style={styles.companyName1}>Transaction ID.</Text></Text>
              <Text style={styles.contentText1}>Take a<Text style={styles.companyName1}> screenshot.</Text></Text> 
            </View>
          </View>
        );
      
      case 3:
        return (
          <View style={styles.stepCard1}>
            <Text style={styles.stepNumber1}>3</Text>
            <Text style={styles.stepTitle1}>Submit Details</Text>
            <View style={styles.contentContainer2}>
              <Text style={styles.contentText1}> Send the <Text style={styles.companyName1}>screenshot</Text> and</Text>
             <Text style={styles.companyName1}> Transaction ID</Text>
            </View>
          </View>
        );
      
      case 4:
        return (
          <View style={styles.stepCard1}>
            <Text style={styles.stepNumber1}>4</Text>
            <Text style={styles.stepTitle1}>Check Status</Text>
            <View style={styles.contentContainer2}>
              <Text style={styles.contentText1}> Payment will be verified. Stautus will</Text>
              <Text style={styles.contentText1}>be updated in<Text style={styles.companyName1}> 48 hours.</Text></Text> 
            </View>
          </View>
        );
      
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={['#003F7D', '#00AEEF']} style={styles.header}>
        <View style={styles.headerContent}>
          <Ionicons name="person-circle-outline" size={45} color="white" />
          <Text style={styles.headerText}>Hello ! User Name</Text>
          <MaterialCommunityIcons name="menu" size={24} color="white" />
        </View>
      </LinearGradient>

      {/* Payment Details */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>Process As Follows</Text>

        {/* Step content - shows when a step is clicked */}
        {renderStepContent()}

        {/* Diagram - only show when no step is selected */}
        {!activeStep && (
          <View style={styles.diagramContainer}>
            <Svg height="450" width="450" viewBox="0 0 360 360">
              {/* Circle Path */}
              <Circle cx="180" cy="180" r="120" stroke="#001F5C" strokeWidth="1" fill="none" />

              {/* Arrows */}
              <Path d="M250 105 L270 125" stroke="#001F5C" strokeWidth="2.5" />
              <Path d="M270 125 L260 120" stroke="#001F5C" strokeWidth="2.5" />
              <Path d="M270 125 L265 115" stroke="#001F5C" strokeWidth="2.5" />

              <Path d="M275 230 L255 250" stroke="#001F5C" strokeWidth="2.5" />
              <Path d="M255 250 L265 245" stroke="#001F5C" strokeWidth="2.5" />
              <Path d="M255 250 L260 240" stroke="#001F5C" strokeWidth="2.5" />

              <Path d="M115 265 L95 245" stroke="#001F5C" strokeWidth="2.5" />
              <Path d="M95 245 L100 255" stroke="#001F5C" strokeWidth="2.5" />
              <Path d="M95 245 L105 250" stroke="#001F5C" strokeWidth="2.5" />

              <Path d="M85 125 L105 105" stroke="#001F5C" strokeWidth="2.5" />
              <Path d="M105 105 L95 110" stroke="#001F5C" strokeWidth="2.5" />
              <Path d="M105 105 L100 115" stroke="#001F5C" strokeWidth="2.5" />

              {/* Clickable Step Circles */}
              <G onPress={() => handleStepClick(1)}>
                <Circle cx="180" cy="60" r="35" fill="white" stroke="#001F5C" strokeWidth="2" />
                <SvgText x="180" y="80" textAnchor="middle" fill="#001F5C" fontWeight="bold" fontSize="50">1</SvgText>
              </G>

              <G onPress={() => handleStepClick(2)}>
                <Circle cx="300" cy="180" r="35" fill="white" stroke="#001F5C" strokeWidth="2" />
                <SvgText x="300" y="197" textAnchor="middle" fill="#001F5C" fontWeight="bold" fontSize="50">2</SvgText>
              </G>

              <G onPress={() => handleStepClick(3)}>
                <Circle cx="180" cy="300" r="35" fill="white" stroke="#001F5C" strokeWidth="2" />
                <SvgText x="180" y="319" textAnchor="middle" fill="#001F5C" fontWeight="bold" fontSize="50">3</SvgText>
              </G>

              <G onPress={() => handleStepClick(4)}>
                <Circle cx="60" cy="180" r="35" fill="white" stroke="#001F5C" strokeWidth="2" />
                <SvgText x="59" y="200" textAnchor="middle" fill="#001F5C" fontWeight="bold" fontSize="50">4</SvgText>
              </G>

              {/* Step Labels with backgrounds */}
              <G>
                <Rect x="132" y="85" width="94" height="30" rx="10" ry="10" fill="white" />
                <SvgText x="180" y="105" textAnchor="middle" fill="black" fontSize="15">Scan & Pay</SvgText>
              </G>

              <G>
                <Rect x="196" y="165" width="90" height="30" rx="10" ry="10" fill="white" />
                <SvgText x="245" y="185" textAnchor="middle" fill="black" fontSize="15">Save Details</SvgText>
              </G>

              <G>
                <Rect x="122" y="247" width="113" height="30" rx="10" ry="10" fill="white" />
                <SvgText x="180" y="267" textAnchor="middle" fill="black" fontSize="15">Submit Details</SvgText>
              </G>

              <G>
                <Rect x="75" y="165" width="104" height="30" rx="10" ry="10" fill="white" />
                <SvgText x="126" y="185" textAnchor="middle" fill="black" fontSize="15">Check Status</SvgText>
              </G>
            </Svg>
          </View>
        )}

        <View style={styles.container3}>
          {/* Help Box */}
          <View style={styles.helpBox}>
            <Text style={styles.helpText}>
              Need help? Contact us at{' '}
              accounts@sunbigsolar.com
            </Text>
          </View>

          {/* Add Payment Button */}
          <TouchableOpacity style={styles.button} activeOpacity={0.7}>
            <Icon name="add" size={30} color="white" />
            <Text style={styles.buttonText}>Add Payment Details</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={[styles.navItem, activeTab === 'home' && styles.activeNavItem]}
          onPress={() => {
            navigation.navigate('Main');
            setActiveTab('home');
          }}
        >
          <FontAwesome name="home" size={25} color={activeTab === 'home' ? '#002F7A' : 'black'} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.navItem, activeTab === 'monitor' && styles.activeNavItem]}
          onPress={() => setActiveTab('monitor')}
        >
          <FontAwesome name="line-chart" size={25} color={activeTab === 'monitor' ? '#002F7A' : 'black'} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.navItem, activeTab === 'documents' && styles.activeNavItem]}
          onPress={() => {
            navigation.navigate('Payment');
            setActiveTab('documents');
          }}
        >
          <FontAwesome name="file-text" size={25} color={activeTab === 'documents' ? '#002F7A' : 'black'} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.navItem, activeTab === 'refer' && styles.activeNavItem]}
          onPress={() => setActiveTab('refer')}
        >
          <FontAwesome name="users" size={25} color={activeTab === 'refer' ? '#002F7A' : 'black'} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.navItem, activeTab === 'profile' && styles.activeNavItem]}
          onPress={() => {
            navigation.navigate('Profile');
            setActiveTab('profile');
          }}
        >
          <FontAwesome name="user-circle" size={25} color={activeTab === 'profile' ? '#002F7A' : 'black'} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ECEDFF',
  },
  header: {
    padding: 20,
    paddingTop: 50,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 30
  },
  headerText: {
    color: 'white',
    fontSize: 19,
    marginLeft: -150
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20
  },
  sectionTitle: {
    marginLeft: 15,
    fontSize: 18,
    fontWeight: '900',
    color: "#001F5C",
    marginTop: 20,
    marginBottom: 10
  },
  diagramContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    width: '100%',
    height: 350
  },
  
  // Step 1 Styles - Scan & Pay
  stepCard1: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 15,
    padding: 20,
    height:400,
    alignItems: 'center',
  },
  stepNumber1: {
    fontSize: 70,
    marginTop:10,
    fontWeight: 'bold',
    color: '#001F5C', 
    marginBottom: 5,
  },
  stepTitle1: {
    fontSize: 26,
    marginTop:14,
    fontFamily: 'Poppins-Bold',
    color: '#001F5C',
    marginBottom: 35,
  },
  contentContainer1: {
    width: '100%',
    alignItems: 'center',
  },
  contentText1: {
    fontSize: 19,
    color: '#001F5C',
    textAlign: 'center',
  },
  companyName1: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#001F5C',
    textAlign: 'center',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    marginHorizontal: 20,
    marginBottom: 10,
    borderRadius: 10
  },
  navItem: {
    padding: 10
  },
  activeNavItem: {
    backgroundColor: '#C6EAFF',
    borderRadius: 20,
    padding: 10
  },
  container3: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  helpBox: {
    backgroundColor: 'white',
    padding: 15,
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 15,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  helpText: {
    color: "#0a1172",
    fontFamily: 'Poppins-Bold',
    fontSize: 19,
    textAlign: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#001F6D',
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 25,
    fontWeight: 'bold',
    marginLeft: 8,
  }
});

export default PaymentProcessScreen;