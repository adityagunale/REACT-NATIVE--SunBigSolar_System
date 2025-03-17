/* ss/screens/ApplySolarLoan.js */
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar, ScrollView, Image, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import DocumentPicker from 'react-native-document-picker';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../config';
import { horizontalScale, verticalScale, moderateScale, responsiveSpacing } from '../utils/responsive';

const ApplySolarLoan = () => {
    const navigation = useNavigation();
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [landmark, setLandmark] = useState('');
    const [solarSystemSize, setSolarSystemSize] = useState('');
    const [occupation, setOccupation] = useState('');
    const [annualincome, setAnnualIncome] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [documents, setDocuments] = useState({
        Pancard: null,
        Aadhar: null,
        income: null,
        itr: null,
    });
    const [activeTab, setActiveTab] = useState('home');

    const pickDocument = async (documentType) => {
        try {
            const result = await DocumentPicker.pick({
                type: [DocumentPicker.types.images, DocumentPicker.types.pdf],
                allowMultiple: false,
            });

            const file = result[0];
            setDocuments(prev => ({
                ...prev,
                [documentType]: file
            }));
        } catch (error) {
            if (!DocumentPicker.isCancel(error)) {
                Alert.alert('Error', error.message);
            }
        }
    };

    const uploadDocument = async (documentType, file) => {
        if (!file) return null;

        const formData = new FormData();
        formData.append('files', {
            uri: file.uri,
            type: file.type || 'application/pdf',
            name: file.name || 'document.pdf',
        });

        try {
            const token = await AsyncStorage.getItem('userToken');
            if (!token) {
                throw new Error('Authentication token not found. Please log in again.');
            }

            console.log(`Uploading ${documentType} with token: ${token}`);

            const response = await axios.post(`${config.getApiUrl()}/uploadLoanDeatails`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                },
            });

            console.log(`Upload response for ${documentType}:`, response.data);
            return response.data.files[0].url;
        } catch (error) {
            console.error(`Upload error for ${documentType}:`,
                error.response ? {
                    status: error.response.status,
                    data: error.response.data
                } : error.message
            );
            throw new Error(`Failed to upload ${documentType}: ${error.response ? error.response.data.message || error.response.status : error.message}`);
        }
    };

    const occupationTypes = [
        'Select Occupation',
        'Business Owner',
        'Employee',
        'Self Employed',
        'Student',
        'Retired',
        'Other'
    ];

    const AnnualIncome = [
        'Select Annual Income',
        'Less than 5 Lakh',
        '5-10 Lakh',
        'More than 10 Lakh',
    ];

    const handleSubmit = async () => {
        setErrorMessage('');
        setSuccessMessage('');
    
        if (!name || !phone || !email || !address || !landmark || !solarSystemSize || !occupation || occupation === 'Select Occupation' || !annualincome || annualincome === 'Select Annual Income') {
            setErrorMessage('All fields are required.');
            return;
        }
    
        try {
            const token = await AsyncStorage.getItem('userToken');
            if (!token) {
                throw new Error('Authentication token not found. Please log in again.');
            }
    
            // Check for missing documents
            const missingDocs = Object.entries(documents)
                .filter(([_, value]) => !value)
                .map(([key]) => key);
    
            if (missingDocs.length > 0) {
                setErrorMessage(`Please upload all required documents. Missing: ${missingDocs.join(', ')}`);
                return;
            }
    
            // First submit the loan application
            const response = await axios.post(`${config.getApiUrl()}/loan`, {
                name,
                phone,
                email,
                address,
                landmark,
                solarSystemSize,
                occupation,
                annualincome
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
    
            if (response.status === 200) {
                // Now upload all documents
                const uploadPromises = Object.entries(documents).map(async ([type, file]) => {
                    const url = await uploadDocument(type, file);
                    return { type, url };
                });
    
                await Promise.all(uploadPromises);
    
                setSuccessMessage('Loan application submitted successfully!');
                setName('');
                setPhone('');
                setEmail('');
                setAddress('');
                setLandmark('');
                setSolarSystemSize('');
                setOccupation('Select Occupation');
                setAnnualIncome('Select Annual Income');
            }
        } catch (error) {
            console.error('Error submitting loan application:', error);
            setErrorMessage(`Failed to submit loan application: ${error.message}`);
        }
    };
    

    const DocumentUploadSection = ({ title, documentType }) => (
        <View style={styles.inputGroup}>
            <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>{title}</Text>
                <View style={styles.pan}>
                    <Icon name="cloud-upload" size={30} color={'#0a1172'} />
                    <TouchableOpacity onPress={() => pickDocument(documentType)}>
                        <Text style={styles.UP}>Upload File</Text>
                    </TouchableOpacity>
                </View>
                {documents[documentType] && (
                    <View style={styles.filePreview}>
                        {documents[documentType].type.startsWith('image/') ? (
                            <Image
                                source={{ uri: documents[documentType].uri }}
                                style={styles.previewImage}
                            />
                        ) : (
                            <View style={styles.pdfPreview}>
                                <Icon name="file-pdf-o" size={40} color={'#0a1172'} />
                                <Text style={styles.fileName}>{documents[documentType].name}</Text>
                            </View>
                        )}
                    </View>
                )}
            </View>
        </View>
    );

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
                    <Text style={styles.title1}>Apply For Solar Loan</Text>
                </View>

                <ScrollView contentContainerStyle={styles.scrollViewContent}>
                    <View style={styles.white}>
                        <Text style={styles.sectionTitle}>Basic Details</Text>
                        <View style={styles.inputGroup}>
                            <View style={styles.inputWrapper}>
                                <Text style={styles.inputLabel}>Name</Text>
                                <TextInput
                                    style={styles.input}
                                    value={name}
                                    onChangeText={setName}
                                    placeholder="Enter Name"
                                    placeholderTextColor={'#0a1172'}
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
                                    placeholderTextColor={'#0a1172'}
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
                                    placeholderTextColor={'#0a1172'}
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
                                    placeholderTextColor={'#0a1172'}
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
                                    placeholderTextColor={'#0a1172'}
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
                                    placeholderTextColor={'#0a1172'}
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <View style={styles.inputWrapper}>
                                <Text style={styles.inputLabel}>Occupation Type</Text>
                                <View style={styles.pickerContainer}>
                                    <Picker
                                        selectedValue={occupation}
                                        onValueChange={(itemValue) => setOccupation(itemValue)}
                                        style={styles.picker}
                                        dropdownIconColor="#0a1172"
                                    >
                                        {occupationTypes.map((type, index) => (
                                            <Picker.Item
                                                key={index}
                                                label={type}
                                                value={type}
                                                color="black"
                                                style={styles.pickerItem}
                                            />
                                        ))}
                                    </Picker>
                                </View>
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <View style={styles.inputWrapper}>
                                <Text style={styles.inputLabel}>Annual Income</Text>
                                <View style={styles.pickerContainer}>
                                    <Picker
                                        selectedValue={annualincome}
                                        onValueChange={(itemValue) => setAnnualIncome(itemValue)}
                                        style={styles.picker}
                                        dropdownIconColor="#0a1172"
                                    >
                                        {AnnualIncome.map((type, index) => (
                                            <Picker.Item
                                                key={index}
                                                label={type}
                                                value={type}
                                                color="black"
                                                style={styles.pickerItem}
                                            />
                                        ))}
                                    </Picker>
                                </View>
                            </View>
                        </View>
                        <Text style={styles.sectionTitle}>Documents Details</Text>

                        <DocumentUploadSection title="Pan Card" documentType="Pancard" />
                        <DocumentUploadSection title="Aadhar Card" documentType="Aadhar" />
                        <DocumentUploadSection title="Income Proof" documentType="income" />
                        <DocumentUploadSection title="Last Three Year ITR" documentType="itr" />

                        {errorMessage ? (
                            <Text style={styles.errorText}>{errorMessage}</Text>
                        ) : null}
                        {successMessage ? (
                            <Text style={styles.successText}>{successMessage}</Text>
                        ) : null}

                        <TouchableOpacity style={styles.loanButton} onPress={handleSubmit}>
                            <Text style={styles.ButtonText}>SUBMIT</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </LinearGradient>
            <View style={styles.bottomNav}>
                {bottomNavItems.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[styles.navItem, activeTab === item.key && styles.activeNavItem]}
                        onPress={() => {
                            if (item.key === 'profile') {
                                navigation.navigate('Profile');
                            } 
                            if (item.key === 'documents') {
                                navigation.navigate('Loan Details');
                            } 
                            if (item.key === 'home') {
                                navigation.navigate('Main');
                            } 
                            else {
                                setActiveTab(item.key);
                            }
                        }}
                    >
                        <Icon name={item.icon} size={25} color={activeTab === item.key ? '#002F7A' : 'black'} />
                    </TouchableOpacity>
                ))}
            </View>
        </>
    );
};

const bottomNavItems = [
  { key: 'home', icon: 'home' },
  { key: 'monitor', icon: 'line-chart' },
  { key: 'documents', icon: 'file-text' },
  { key: 'refer', icon: 'users' },
  { key: 'profile', icon: 'user-circle' }
];

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
        marginTop: verticalScale(15),
        borderTopLeftRadius: moderateScale(25),
        borderTopRightRadius: moderateScale(25),
        padding: responsiveSpacing(15),
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: moderateScale(20),
        fontWeight: "bold",
        marginLeft: horizontalScale(-150),
        marginBottom: verticalScale(20),
        marginTop: verticalScale(20),
        color: "#0a1172",
        fontFamily: 'Poppins-Bold',
    },
    title: {
        fontSize: moderateScale(30),
        color: 'white',
        fontWeight: '900',
        marginTop: verticalScale(32),
        marginLeft: horizontalScale(30)
    },
    title1: {
        fontSize: moderateScale(25),
        color: 'white',
        marginLeft: horizontalScale(22),
        marginTop: verticalScale(30),
        fontFamily: 'Poppins-Bold',
    },
    iconback: {
        flexDirection: 'row',
    },
    inputGroup: {
        width: '100%',
        marginBottom: verticalScale(8),
    },
    inputWrapper: {
        backgroundColor: 'white',
        borderRadius: moderateScale(15),
        borderWidth: 1,
        borderColor: '#e0e0e0',
        padding: responsiveSpacing(9),
    },
    inputLabel: {
        color: '#0a1172',
        fontSize: moderateScale(16),
        marginBottom: verticalScale(5),
        marginLeft: horizontalScale(20),
        fontFamily: 'Poppins-Bold',
    },
    input: {
        padding: 0,
        fontSize: moderateScale(14),
        color: "#0a1172",
        marginLeft: horizontalScale(20),
        fontFamily: 'Poppins-Regular',
    },
    pickerContainer: {
        marginLeft: horizontalScale(20),
        marginRight: horizontalScale(20),
        color: 'white'
    },
    picker: {
        color: '#0a1172',
        marginLeft: horizontalScale(-8),
        marginTop: verticalScale(-15),
        height: verticalScale(50),
        placeholder: 'Select',
    },
    pickerItem: {
        fontSize: moderateScale(16),
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
    loanButton: {
        backgroundColor: '#0a1172',
        padding: responsiveSpacing(14),
        borderRadius: moderateScale(12),
        alignItems: 'center',
        marginTop: verticalScale(50),
        marginBottom: verticalScale(1),
        width: '100%'
    },
    ButtonText: {
        color: 'white',
        fontSize: moderateScale(18),
        fontWeight: '600',
    },
    uploadDocuments1: {
        backgroundColor: '#ECEDFF',
        minHeight: '100%',
        width: '100%',
        borderTopLeftRadius: moderateScale(25),
        borderTopRightRadius: moderateScale(25),
        padding: responsiveSpacing(30),
        alignItems: 'center',
    },
    UP: {
        fontFamily: 'Poppins-Regular',
        marginLeft: horizontalScale(10),
        marginTop: verticalScale(5),
        fontSize: moderateScale(16),
        color: '#0a1172'
    },
    previewImage: {
        width: '100%',
        height: verticalScale(200),
        marginTop: verticalScale(10),
        borderRadius: moderateScale(8),
        resizeMode: 'cover',
    },
    pdfPreview: {
        backgroundColor: '#f5f5f5',
        padding: responsiveSpacing(20),
        borderRadius: moderateScale(8),
        alignItems: 'center',
        justifyContent: 'center',
    },
    fileName: {
        marginTop: verticalScale(10),
        color: '#0a1172',
        fontSize: moderateScale(14),
        textAlign: 'center',
        fontFamily: 'Poppins-Regular',
    },
    pan: {
        flexDirection: 'row',
        marginLeft: horizontalScale(15)
    },
    bottomNav: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: responsiveSpacing(10),
        backgroundColor: 'white',
        borderTopLeftRadius: moderateScale(20),
        borderTopRightRadius: moderateScale(20),
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: moderateScale(10),
        elevation: 5,
        marginHorizontal: horizontalScale(20),
        marginBottom: verticalScale(10),
        borderRadius: moderateScale(10)
    },
    navItem: {
        padding: responsiveSpacing(10)
    },
    activeNavItem: {
        backgroundColor: '#C6EAFF',
        borderRadius: moderateScale(20),
        padding: responsiveSpacing(10)
    },
});

export default ApplySolarLoan;
