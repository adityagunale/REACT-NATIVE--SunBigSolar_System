import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image,
  Alert,
  ScrollView,
  Platform
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../config';
import { horizontalScale, verticalScale, moderateScale, responsiveSpacing } from '../utils/responsive';


const Upload = () => {
  const navigation = useNavigation();
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [documents, setDocuments] = useState({
    ElectricityBill: null,
    Annexure: null,
    SignedAgreement1: null,
    SignedAgreement2: null,
    SignedWorkReport: null,
    CustomerPhotoWithSolarPanels: null
   
  });

  const pickDocument = async (documentType) => {
    try {
      // Allow both images and PDFs
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

  // In your React Native component (Upload.js)
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
  
      const response = await axios.post(`${config.getApiUrl()}/upload`, formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}` // Ensure there's a space after Bearer
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

  const handleSubmit = async () => {
    try {
      setErrorMessage('');
      setSuccessMessage('');

      const missingDocs = Object.entries(documents)
        .filter(([_, value]) => !value)
        .map(([key]) => key);

      if (missingDocs.length > 0) {
        setErrorMessage(`Please upload all required documents. Missing: ${missingDocs.join(', ')}`);
        return;
      }

      const uploadPromises = Object.entries(documents).map(async ([type, file]) => {
        const url = await uploadDocument(type, file);
        return { type, url };
      });

      await Promise.all(uploadPromises);
      
      setSuccessMessage('All documents uploaded successfully!');
      // navigation.navigate('Main');
    } catch (error) {
      setErrorMessage(error.message);
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
                 <Text style={styles.title1}>Upload Project Documents</Text>
               </View>

        <ScrollView style={styles.scrollContainer}>
          <View style={styles.white}>
            
            <DocumentUploadSection title="Electricity Bill" documentType="ElectricityBill" />
            <DocumentUploadSection title="Annexure 1 & Perform A" documentType="Annexure" />
            <DocumentUploadSection title="Signed Agreement 1" documentType="SignedAgreement1" />
             <Text style={styles.downloadText}>Download Sample format</Text>
            <DocumentUploadSection title="Signed Agreement 2" documentType="SignedAgreement2" />
             <Text style={styles.downloadText}>Download Sample format</Text>
            <DocumentUploadSection title="Signed Work Completion Report" documentType="SignedWorkReport" />
            <DocumentUploadSection title="Customer Photo with Solar Panels" documentType="CustomerPhotoWithSolarPanels" />

            {errorMessage ? (
              <Text style={styles.errorText}>{errorMessage}</Text>
            ) : null}
            {successMessage ? (
              <Text style={styles.successText}>{successMessage}</Text>
            ) : null}
          </View>
        </ScrollView>
      </LinearGradient>
      <View style={styles.btn}>
        <TouchableOpacity style={styles.loanButton} onPress={handleSubmit}>
          <Text style={styles.ButtonText}>SUBMIT</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};


const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
   
  },
  filePreview: {
    marginTop: verticalScale(10),
    width: '100%',
    borderRadius: moderateScale(8),
    overflow: 'hidden',
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

  btn:{
    backgroundColor:'#ECEDFF',
    opacity:1,
  
  },
  gradient: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },
  white: {
    backgroundColor: '#ECEDFF',
    minHeight: '100%',
    width: '100%',
    marginTop: verticalScale(30),
    borderTopLeftRadius: moderateScale(25),
    borderTopRightRadius: moderateScale(25),
    padding: responsiveSpacing(15),
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    height: verticalScale(150),
    marginTop: verticalScale(10),
    borderRadius: moderateScale(8),
    resizeMode: 'cover',
  },
  iconback: {
    flexDirection: 'row',
    marginBottom: verticalScale(20)
  },
  title: {
    fontSize: moderateScale(25),
    color: 'white',
    fontWeight: '900',
    marginTop: verticalScale(20),
    marginLeft: horizontalScale(15),
  },
  title1: {
    fontSize: moderateScale(25),
    color: 'white',
    fontWeight: '900',
    marginLeft: horizontalScale(20),
    marginTop: verticalScale(15),
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
    padding: responsiveSpacing(12),
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
    fontSize: moderateScale(16),
    color: "#0a1172",
    marginLeft: horizontalScale(20),
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
    padding: responsiveSpacing(13),
    borderRadius: moderateScale(12),
    alignItems: 'center',
    marginTop: verticalScale(20),
    marginBottom: verticalScale(15),
    marginHorizontal: horizontalScale(25),
    width: '90%',
  },
  ButtonText: {
    color: 'white',
    fontSize: moderateScale(18),
    fontWeight: '600',
  },
  htext: {
    fontFamily: 'Poppins-Bold',
    fontSize: moderateScale(18),
    color: '#0a1172'

  },
  pan: {
    flexDirection: 'row',
    marginLeft: horizontalScale(15)
  },
  UP: {
    fontFamily: 'Poppins-Regular',
    marginLeft: horizontalScale(10),
    marginTop: verticalScale(5),
    fontSize: moderateScale(16),
    color: '#0a1172'

  },
  maintext: {
    marginBottom: verticalScale(25)
  },
  downloadText: {
    color: '#0a1172',
    fontFamily: "Poppins-Regular",
    fontSize: moderateScale(17),
    marginTop: verticalScale(-5),
    marginBottom: verticalScale(4),
    marginLeft: horizontalScale(80)
  
  },

});
export default Upload;