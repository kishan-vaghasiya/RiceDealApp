import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios'; // Import axios for API requests
import {AllColors} from '../../../Constants/COLORS';
import {Fonts} from '../../../Constants/Fonts';
import OtpInput from '../../../Components/otpInput/OtpInput';
import {Container} from '../../../Components/Container/Container';
import ToastMessage from '../../../Components/ToastMessage/ToastMessage';
import {Instance} from '../../../Api/Instance';

export default function ForgotPassword({navigation}) {
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1);
  const [sessionId, setSessionId] = useState('');
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState('');

  const showToast = (message, type) => {
    setToastMessage(message);
    setToastType(type);
  };

  const sendOtp = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        'https://ricedeal.onrender.com/api/v1/users/loginWithMobile',
        {
          mobile: mobile,
        },
      );

      setLoading(false);
      if (response.data.success) {
        showToast(response.data.msg, 'success');
        setSessionId(response.data.result.Details);
        setStep(2);
      } else {
        showToast('Failed to send OTP', 'danger');
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
      showToast('An error occurred. Please try again later.', 'danger');
    }
  };

  const resetPassword = async () => {
    try {
      if (newPassword) {
        setLoading(true);

        console.log('Sending request with data:', {
          mobile,
          otp,
          sessionId,
          newPassword,
        });

        const response = await Instance.post('/v1/users/resetPassword', {
          mobile,
          otp: otp.join(''),
          sessionId,
          password: newPassword,
        });
        setLoading(false);
        console.log('Server Response:', response.data);
        if (response.data.success) {
          showToast('Password updated successfully', 'success');
          navigation.navigate('LoginDetails');
        } else {
          showToast('Failed to update password', 'danger');
        }
      } else {
        showToast('Please enter a new password', 'warning');
      }
    } catch (error) {
      setLoading(false);
      console.error('Error during password reset:', error);
      if (error.response) {
        console.error('Server responded with error:', error.response.data);
        showToast(
          `Server Error: ${error.response.data.message || 'Unknown error'}`,
          'danger',
        );
      } else if (error.request) {
        console.error('No response from server:', error.request);
        showToast('No response from server. Please try again later.', 'danger');
      } else {
        console.error('Error during request setup:', error.message);
        showToast(
          'Error during request setup. Please try again later.',
          'danger',
        );
      }
    }
  };

  const handleNext = () => {
    if (step === 1) {
      if (mobile) {
        sendOtp();
      } else {
        showToast('Please enter a valid mobile number', 'warning');
      }
    } else if (step === 2) {
      if (otp) {
        setStep(3);
      } else {
        showToast('Please enter the OTP', 'warning');
      }
    } else if (step === 3) {
      resetPassword();
    }
  };

  return (
    <Container
      statusBarStyle={'dark-content'}
      statusBarBackgroundColor={AllColors.primary200}
      backgroundColor={AllColors.white}>
      <View style={styles.header}>
        <Image
          source={{
            uri: 'https://static.vecteezy.com/system/resources/previews/004/112/232/non_2x/forgot-password-and-account-login-for-web-page-protection-security-key-access-system-in-smartphone-or-computer-flat-illustration-vector.jpg',
          }}
          style={styles.logo}
        />
        <Text style={styles.title}>
          {step === 1
            ? 'Forgot Password'
            : step === 2
            ? 'Enter OTP'
            : 'Update Password'}
        </Text>
      </View>

      {step === 1 && (
        <>
          <Text style={styles.infoText}>
            Please enter your mobile number. We'll send you an OTP to verify.
          </Text>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Mobile No</Text>
            <TextInput
              placeholder="Enter your mobile no"
              value={mobile}
              onChangeText={setMobile}
              keyboardType="number-pad"
              style={styles.textInput}
            />
          </View>
        </>
      )}

      {step === 2 && (
        <>
          <Text style={styles.infoText}>
            Enter the OTP sent to your mobile number. Please check your Whatsapp
          </Text>
          <View style={{marginTop: 15, marginBottom: 35}}>
            <OtpInput otp={otp} setOtp={setOtp} />
          </View>
        </>
      )}

      {step === 3 && (
        <>
          <Text style={styles.infoText}>Please enter your new password.</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              placeholder="Enter new password"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry={true}
              style={styles.textInput}
            />
          </View>
        </>
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={handleNext}
        disabled={loading}>
        {loading ? (
          <ActivityIndicator size="small" color={AllColors.white} />
        ) : (
          <Text style={styles.buttonText}>
            {step === 1 ? 'Next' : step === 2 ? 'Submit' : 'Update Password'}
          </Text>
        )}
      </TouchableOpacity>
      {toastMessage && <ToastMessage type={toastType} message={toastMessage} />}
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AllColors.white,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 30,
    backgroundColor: AllColors.primary200,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  label: {
    fontFamily: Fonts.AfacadBold,
    fontSize: 18,
    marginBottom: 10,
  },
  logo: {
    width: 135,
    height: 135,
    marginBottom: 15,
    marginTop: 20,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 22,
    color: AllColors.black,
    fontFamily: Fonts.AfacadBold,
  },
  inputContainer: {
    flexDirection: 'column',
    marginBottom: 15,
    marginHorizontal: 15,
    marginTop: 10,
  },
  textInput: {
    height: 50,
    borderColor: AllColors.primary200,
    borderWidth: 2,
    borderRadius: 8,
    marginBottom: 10,
    fontSize: 16,
    fontFamily: Fonts.AfacadRegular,
    paddingLeft: 15,
  },
  button: {
    backgroundColor: AllColors.primary900,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
    elevation: 3,
    marginHorizontal: 15,
  },
  buttonText: {
    color: AllColors.white,
    fontSize: 16,
    fontFamily: Fonts.AfacadMedium,
  },
  infoText: {
    fontSize: 18,
    color: AllColors.black,
    textAlign: 'center',
    marginHorizontal: 15,
    marginBottom: 15,
    fontFamily: Fonts.AfacadRegular,
  },
});
