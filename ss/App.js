// App.js
import React from 'react';
// import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './screens/LoginScreen';

import RegisterScreen from './screens/RegisterScreen';
import ForgotPassword from './screens/ForgotPassword';
import MainScreen from './screens/MainScreen';
import OtpLoginScreen from './screens/OtpLoginScreen';
import ReferAndEarnScreen from './screens/ReferAndEarnScreen';
import ProfileScreen from './screens/ProfileScreen';
import BookCall from './screens/BookCall';
import UploadScreen from './screens/UploadDocuments';
import Upload from './screens/upload';
import ShowDocuments from './screens/ShowUploadedDocuments';
import ApplySolarLoan from './screens/ApplySolarLoan';
import LoanDetailsScreen from './screens/ShowLoanDeatails';
import PaymentProcessScreen from './screens/PaymentScreen';
import TrackProjectScreen from './screens/TrackProject';
import GetQuote from './screens/Getquote';




const Stack = createNativeStackNavigator();

const App = () => {
  return (
   
     <NavigationContainer>
     <Stack.Navigator>
      <Stack.Screen name='Login' component={LoginScreen} options={{headerShown:false}}/>
      <Stack.Screen name='OtpLogin' component={OtpLoginScreen} options={{headerShown:false}}/>
      <Stack.Screen name='SignUp' component={RegisterScreen} options={{headerShown:false}}/>
      <Stack.Screen name='Forgot Password' component={ForgotPassword} options={{headerShown:false}}/>
      <Stack.Screen name='Main' component={MainScreen} options={{headerShown:false}}/>
      <Stack.Screen name='ReferAndEarn' component={ReferAndEarnScreen} options={{headerShown:false}}/>
      <Stack.Screen name='Profile' component={ProfileScreen} options={{headerShown:false}}/>
      <Stack.Screen name='Book A Call' component={BookCall} options={{headerShown:false}}/>
      {/* <Stack.Screen name='Upload Documents' component={UploadScreen} options={{headerShown:false}}/> */}
      <Stack.Screen name='Upload Documents' component={Upload} options={{headerShown:false}}/>
      <Stack.Screen name='Show Documents' component={ShowDocuments} options={{headerShown:false}}/>
      <Stack.Screen name='Solar Loan' component={ApplySolarLoan} options={{headerShown:false}}/>
      <Stack.Screen name='Loan Details' component={LoanDetailsScreen} options={{headerShown:false}}/>
      <Stack.Screen name='Payment' component={PaymentProcessScreen} options={{headerShown:false}}/>
      <Stack.Screen name='Track Project' component={TrackProjectScreen} options={{headerShown:false}}/>
      <Stack.Screen name='Quote' component={GetQuote} options={{headerShown:false}}/>
     </Stack.Navigator>
     </NavigationContainer>
   
  );
};

export default App;