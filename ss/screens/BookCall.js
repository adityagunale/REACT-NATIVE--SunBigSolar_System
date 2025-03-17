/* ss/screens/BookCall.js */
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar, Platform, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import config from '../config';
import { horizontalScale, verticalScale, moderateScale, responsiveSpacing } from '../utils/responsive';

const BookCall = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [solarSystemSize, setSolarSystemSize] = useState('');
  const [scheduleDate, setScheduleDate] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState(new Date());

  const handleBookCall = async () => {
    setErrorMessage(''); // Clear previous error messages
    setSuccessMessage(''); // Clear previous success messages

    if (!name || !phone || !email || !address || !landmark || !solarSystemSize || !scheduleDate) {
      setErrorMessage('All fields are required.');
      return;
    }

    try {
      const response = await axios.post(`${config.getApiUrl()}/book-call`, {
        name,
        phone,
        email,
        address,
        landmark,
        solarSystemSize,
        scheduleDate
      });

      if (response.status === 200) {
        setSuccessMessage('Call booked successfully!');
        // Optionally, reset form fields here
        setName('');
        setPhone('');
        setEmail('');
        setAddress('');
        setLandmark('');
        setSolarSystemSize('');
        setScheduleDate('');
      }
    } catch (error) {
      console.error('Error booking call:', error);
      setErrorMessage('Failed to book call. Please try again.');
    }
  };


  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios'); // Keep picker open on iOS
    setDate(currentDate);
    setScheduleDate(currentDate.toLocaleDateString());

    if (Platform.OS === 'android') {
      setShowDatePicker(false); // Hide picker after selection on Android
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
          <Text style={styles.title1}>Book a Call</Text>
        </View>

        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContent}
        >
          <View style={styles.white}>
            <View style={styles.inputGroup}>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Name</Text>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter Name"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Mobile Number</Text>
                <TextInput
                  style={styles.input}
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="Enter Phone Number"
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Email ID</Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter Email ID"
                  keyboardType="email-address"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Address</Text>
                <TextInput
                  style={styles.input}
                  value={address}
                  onChangeText={setAddress}
                  placeholder="Enter Address"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Nearest Landmark</Text>
                <TextInput
                  style={styles.input}
                  value={landmark}
                  onChangeText={setLandmark}
                  placeholder="Enter Nearest Landmark"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Proposed Rooftop Solar System Size</Text>
                <TextInput
                  style={styles.input}
                  value={solarSystemSize}
                  onChangeText={setSolarSystemSize}
                  placeholder="Enter System Size (e.g., 5 kW)"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Date to Schedule Site Visit</Text>
                <View style={styles.dateInputContainer}>
                  <TextInput
                    style={styles.input1}
                    value={scheduleDate}
                    placeholder="Enter Date"
                    onFocus={() => setShowDatePicker(true)}
                  />
                  <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                    <Icon name="calendar" size={20} color="#0a1172" style={styles.calendarIcon} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date" // Set mode to 'date' for date-only picker
                display="default"
                onChange={onChange}
              />
            )}

            {errorMessage ? (
              <Text style={styles.errorText}>{errorMessage}</Text>
            ) : null}
            {successMessage ? (
              <Text style={styles.successText}>{successMessage}</Text>
            ) : null}

            <TouchableOpacity style={styles.bookButton} onPress={() => handleBookCall()}>
              <Text style={styles.bookButtonText}>SUBMIT</Text>
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
    marginTop: verticalScale(30),
    borderTopLeftRadius: moderateScale(25),
    borderTopRightRadius: moderateScale(25),
    padding: responsiveSpacing(15),
    alignItems: 'center',
    paddingBottom: verticalScale(50),
  },
  title: {
    fontSize: moderateScale(30),
    color: 'white',
    fontWeight: '900',
    marginTop: verticalScale(35),
    marginLeft: horizontalScale(30)
  },
  title1: {
    fontSize: moderateScale(30),
    color: 'white',
    fontWeight: '900',
    marginLeft: horizontalScale(60),
    marginTop: verticalScale(30),
  },
  iconback: {
    flexDirection: 'row',
  },
  inputGroup: {
    width: '100%',
    marginBottom: verticalScale(10),
  },
  inputWrapper: {
    backgroundColor: 'white',
    borderRadius: moderateScale(15),
    borderWidth: 1,
    borderColor: '#e0e0e0',
    padding: responsiveSpacing(10),
  },
  inputLabel: {
    color: '#0a1172',
    fontSize: moderateScale(18),
    fontWeight: '900',
    marginBottom: verticalScale(5),
    marginLeft: horizontalScale(20),
  },
  input: {
    padding: 0,
    fontSize: moderateScale(16),
    color: "#0a1172",
    marginLeft: horizontalScale(20),
  },
  input1: {
    padding: 0,
    fontSize: moderateScale(15),
    marginLeft: horizontalScale(55),
    color: "#0a1172",
  },
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  calendarIcon: {
    marginLeft: horizontalScale(-100),
  },
  errorText: {
    color: 'red',
    marginBottom: verticalScale(-11),
    textAlign: 'center',
    fontSize: moderateScale(14),
  },
  successText: {
    color: 'green',
    fontSize: moderateScale(16),
    marginBottom: verticalScale(-11),
    textAlign: 'center',
  },
  bookButton: {
    width: '100%',
    backgroundColor: '#0a1172',
    padding: responsiveSpacing(14),
    borderRadius: moderateScale(12),
    alignItems: 'center',
    marginTop: verticalScale(20),
  },
  bookButtonText: {
    color: 'white',
    fontSize: moderateScale(16),
    fontWeight: '600',
  },
});

export default BookCall;
