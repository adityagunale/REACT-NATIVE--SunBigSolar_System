import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, StyleSheet, StatusBar, Alert, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../config';
import { horizontalScale, verticalScale, moderateScale, responsiveSpacing } from '../utils/responsive';

const Getquote = () => {
  const navigation = useNavigation();
  const [connectionType, setConnectionType] = useState('Residential');
  const [contractLoad, setContractLoad] = useState('');
  const [monthlyUnits, setMonthlyUnits] = useState('');
  const [selectedCity, setSelectedCity] = useState('Mumbai City');
  const [roofArea, setRoofArea] = useState('');
  const [areaUnit, setAreaUnit] = useState('sq. m');
  const [loading, setLoading] = useState(false);
  const [quoteResult, setQuoteResult] = useState(null);

  // List of all 36 districts in Maharashtra
  const maharashtraDistricts = [
    'Ahmednagar', 'Akola', 'Amravati', 'Aurangabad', 'Beed', 'Bhandara', 
    'Buldhana', 'Chandrapur', 'Dhule', 'Gadchiroli', 'Gondia', 'Hingoli', 
    'Jalgaon', 'Jalna', 'Kolhapur', 'Latur', 'Mumbai City', 'Mumbai Suburban', 
    'Nagpur', 'Nanded', 'Nandurbar', 'Nashik', 'Osmanabad', 'Palghar', 
    'Parbhani', 'Pune', 'Raigad', 'Ratnagiri', 'Sangli', 'Satara', 
    'Sindhudurg', 'Solapur', 'Thane', 'Wardha', 'Washim', 'Yavatmal'
  ];

  const handleCheckSavings = async () => {
    try {
      setLoading(true);
      
      // Validate inputs
      if (!contractLoad || !monthlyUnits || !roofArea) {
        Alert.alert('Error', 'Please fill in all required fields');
        return;
      }

      // Get auth token
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        Alert.alert('Error', 'Please login to continue');
        navigation.navigate('Login');
        return;
      }

      // Make API call
      const response = await fetch(`${config.getApiUrl()}/calculate-solar-quote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          connectionType,
          contractLoad: parseFloat(contractLoad),
          monthlyUnits: parseFloat(monthlyUnits),
          selectedCity,
          roofArea: parseFloat(roofArea),
          areaUnit
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to calculate quote');
      }

      setQuoteResult(data.data);
      
      // Navigate to results screen with the quote data
      navigation.navigate('QuoteResult', { quoteData: data.data });

    } catch (error) {
      Alert.alert('Error', error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <LinearGradient
        colors={['#0D1A69', '#01C1EE']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      >
        <View style={styles.iconback}>
          <TouchableOpacity onPress={() => navigation.navigate('Main')}>
            <Icon name="arrow-left" size={24} color="white" style={styles.title} />
          </TouchableOpacity>
          <Text style={styles.title1}>Solculator</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.white}>
            {/* Connection Details */}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <View style={styles.numberCircle}>
                  <Text style={styles.numberText}>1</Text>
                </View>
                <Text style={styles.sectionTitle}>Connection Details</Text>
              </View>
              
              <View style={styles.sectionContent}>
                <View style={styles.inputGroup}>
                  <View style={styles.inputWrapper}>
                    <Text style={styles.inputLabel}>Connection Type</Text>
                    <View style={styles.buttonGroup}>
                      <TouchableOpacity 
                        style={[styles.button, styles.buttonActive]}
                      >
                        <Text style={styles.buttonTextActive}>
                          Residential
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <View style={styles.inputWrapper}>
                    <Text style={styles.inputLabel}>Contract Load</Text>
                    <View style={styles.inputContainer}>
                      <TextInput 
                        style={styles.input}
                        placeholder="Enter Contract Load" 
                        value={contractLoad}
                        onChangeText={setContractLoad}
                        keyboardType="numeric"
                        placeholderTextColor={'#0a1172'}
                      />
                      <View style={styles.unitSelector}>
                        <TouchableOpacity style={styles.unitButton}>
                          <Text style={styles.unitText}>kW</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.unitButton, styles.unitButtonInactive]}>
                          <Text style={styles.unitTextInactive}>KW</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            {/* Electricity Bill */}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <View style={styles.numberCircle}>
                  <Text style={styles.numberText}>2</Text>
                </View>
                <Text style={styles.sectionTitle}>Electricity Bill</Text>
              </View>
              
              <View style={styles.sectionContent}>
                <View style={styles.inputGroup}>
                  <View style={styles.inputWrapper}>
                    <Text style={styles.inputLabel}>Monthly Units</Text>
                    <TextInput 
                      style={styles.input}
                      placeholder="Enter Monthly Units" 
                      value={monthlyUnits}
                      onChangeText={setMonthlyUnits}
                      keyboardType="numeric"
                      placeholderTextColor={'#0a1172'}
                    />
                    <Text style={styles.unitLabel}>KW</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Location Details */}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <View style={styles.numberCircle}>
                  <Text style={styles.numberText}>3</Text>
                </View>
                <Text style={styles.sectionTitle}>Location Details</Text>
              </View>
              
              <View style={styles.sectionContent}>
                <View style={styles.inputGroup}>
                  <View style={styles.inputWrapper}>
                    <Text style={styles.inputLabel}>Select City</Text>
                    <View style={styles.pickerContainer}>
                      <Picker
                        selectedValue={selectedCity}
                        onValueChange={(itemValue) => setSelectedCity(itemValue)}
                        style={styles.picker}
                        dropdownIconColor="#0a1172"
                      >
                        {maharashtraDistricts.map((district) => (
                          <Picker.Item 
                            key={district} 
                            label={district} 
                            value={district} 
                            color="black" 
                          />
                        ))}
                      </Picker>
                    </View>
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <View style={styles.inputWrapper}>
                    <Text style={styles.inputLabel}>Roof Area</Text>
                    <View style={styles.inputContainer}>
                      <TextInput 
                        style={styles.input}
                        placeholder="Enter Roof Area" 
                        value={roofArea}
                        onChangeText={setRoofArea}
                        keyboardType="numeric"
                        placeholderTextColor={'#0a1172'}
                      />
                      <View style={styles.unitSelector}>
                        <TouchableOpacity 
                          style={[styles.unitButton, areaUnit === 'sq. m' ? styles.unitButtonActive : styles.unitButtonInactive]}
                          onPress={() => setAreaUnit('sq. m')}
                        >
                          <Text style={areaUnit === 'sq. m' ? styles.unitText : styles.unitTextInactive}>sq. m</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={[styles.unitButton, areaUnit === 'sq. ft' ? styles.unitButtonActive : styles.unitButtonInactive]}
                          onPress={() => setAreaUnit('sq. ft')}
                        >
                          <Text style={areaUnit === 'sq. ft' ? styles.unitText : styles.unitTextInactive}>sq. ft</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            {/* Check Savings Button */}
            <TouchableOpacity 
              style={[styles.loanButton, loading && styles.loanButtonDisabled]}
              onPress={handleCheckSavings}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.ButtonText}>Check my Savings</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  white: {
    backgroundColor: '#ECEDFF',
    width: '100%',
    marginTop: '4%',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
    alignItems: 'center',
  },
  iconback: {
    flexDirection: 'row',
  },
  title: {
    fontSize: moderateScale(30),
    color: 'white', 
    fontWeight: '900',
    marginTop: verticalScale(21),
    marginLeft: horizontalScale(20)
  },
  title1: {
    fontSize: moderateScale(25),
    color: 'white',
    marginTop: verticalScale(20),
    marginBottom: verticalScale(20),
    marginLeft: horizontalScale(-40),
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1
  },
  sectionContainer: {
    width: '100%',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#0a117233',
    borderRadius: 12,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#0a117233',
    backgroundColor: '#F5F7FF',
  },
  numberCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#0a1172',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  numberText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0a1172",
  },
  sectionContent: {
    padding: 15,
  },
  inputGroup: {
    width: '100%',
    marginBottom: 15,
  },
  inputWrapper: {
    width: '100%',
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 8,
    color: '#0a1172',
    fontWeight: '500',
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#0a1172',
    color: '#0a1172',
  },
  unitLabel: {
    position: 'absolute',
    right: 15,
    top: 45,
    color: '#0a1172',
    fontWeight: '500',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  buttonActive: {
    backgroundColor: '#0a1172',
  },
  buttonInactive: {
    backgroundColor: '#e0e0e0',
  },
  buttonTextActive: {
    color: 'white',
    fontWeight: '500',
  },
  buttonTextInactive: {
    color: '#0a1172',
    fontWeight: '500',
  },
  divider: {
    alignItems: 'center',
    marginVertical: 15,
  },
  dividerText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#0a1172',
  },
  dividerSubtext: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 5,
  },
  pickerContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#0a1172',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    color: '#0a1172',
  },
  inputContainer: {
    position: 'relative',
  },
  unitSelector: {
    flexDirection: 'row',
    position: 'absolute',
    right: 10,
    top: 8,
  },
  unitButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    marginLeft: 5,
  },
  unitButtonActive: {
    backgroundColor: '#0a1172',
  },
  unitButtonInactive: {
    backgroundColor: '#e0e0e0',
  },
  unitText: {
    color: 'white',
    fontWeight: '500',
  },
  unitTextInactive: {
    color: '#0a1172',
    fontWeight: '500',
  },
  loanButton: {
    backgroundColor: '#0a1172',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
    width: '100%'
  },
  loanButtonDisabled: {
    opacity: 0.7,
  },
  ButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default Getquote;