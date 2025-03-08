/* ss/screens/BookCall.js */
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

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
      const response = await axios.post('http://192.168.43.42:8000/book-call', {
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
      </LinearGradient>
    </>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },
  white: {
    backgroundColor: '#ECEDFF',
    height: '90%',
    width: '100%',
    marginTop: '8%',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    color: 'white',
    fontWeight: '900',
    marginTop: 35,
    marginLeft: 30
  },
  title1: {
    fontSize: 30,
    color: 'white',
    fontWeight: '900',
    marginLeft: 82,
    marginTop: 30,
  },
  iconback: {
    flexDirection: 'row',
  },
  inputGroup: {
    width: '100%',
    marginBottom: 10,
  },
  inputWrapper: {
    backgroundColor: 'white',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    padding: 15,
  },
  inputLabel: {
    color: '#0a1172',
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 5,
    marginLeft: 20,
  },
  input: {
    padding: 0,
    fontSize: 16,
    color: "#0a1172",
    marginLeft: 20,
  },
  input1: {
    padding: 0,
    fontSize: 15,
    marginLeft: 55,
    color: "#0a1172",
  },
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  calendarIcon: {
    marginLeft: -100,
  },
  errorText: {
    color: 'red',
    marginBottom: -11,
    textAlign: 'center',
  },
  successText: {
    color: 'green',
    fontSize: 16,
    marginBottom: -11,
    textAlign: 'center',
},

  bookButton: {
    width: '100%',
    backgroundColor: '#0a1172',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  bookButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default BookCall;
