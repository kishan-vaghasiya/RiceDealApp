import { View, Text, Platform, Keyboard, TouchableWithoutFeedback, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { NavigationProp } from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';
import { Instance } from '../../../Api/Instance';
import { LOGIN } from '../../../Api/Api_End_Points';
import { Container } from '../../../Components/Container/Container';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { AllColors } from '../../../Constants/COLORS';
import Animated from 'react-native-reanimated';
import { Images } from '../../../Assets/Images';
import InputField from '../../../Components/CustomInput/InputField';
import ToastMessage from '../../../Components/ToastMessage/ToastMessage';
import { styles } from './styles';
import metrics from '../../../Constants/Metrics';
import AsyncStorage from '@react-native-async-storage/async-storage';


interface LoginDetailsProps {
    route: { params: { Type: string } };
    navigation: NavigationProp<any, any>;
}

const MobileLogin = (props: LoginDetailsProps) => {

    const [userEmail, setuserEmail] = useState<string>('');
    const [userPass, setuserPass] = useState<string>('');
    const [fcmToken, setFcmToken] = useState<any>('');

    const [loading, setLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [toastMessage, setToastMessage] = useState<string>('');
    const [toastType, setToastType] = useState<'success' | 'error'>('error');


    const getFCMToken = async () => {
        let token = await messaging().getToken();
        setFcmToken(token);
        // console.log(token, 'my token');
    };


    useEffect(() => {
        getFCMToken()
    }, [])


    const handleSignin = async () => {
        if (!userEmail || !userPass) {
            setErrorMessage("Please enter both email and password");
            return;
        }
        setLoading(true);
        try {
            const response = await Instance.post(LOGIN.url, { email: userEmail, password: userPass, fcmToken: fcmToken });

            if (response.data.success) {

                const userToken = response.data.token;
                console.log("userToken: ", userToken);

                await AsyncStorage.setItem('userToken', userToken);

                setLoading(false);
                setToastMessage('Login successful');
                setToastType('success');
                props.navigation.navigate('TabNavigator');
            } else {
                setLoading(false);
                setErrorMessage(response.data.msg || 'Login failed');
                setToastMessage('Login failed. Please try again.');
                setToastType('error');
            }
        } catch (error) {
            setLoading(false);
            setErrorMessage('An error occurred. Please try again later.');
            setToastMessage('An error occurred. Please try again later.');
            setToastType('error');
        }
    };


    return (
        <Container statusBarStyle={'dark-content'} statusBarBackgroundColor={AllColors.white} backgroundColor={AllColors.white}>
            <KeyboardAwareScrollView style={styles.marginView} enableOnAndroid={true} extraScrollHeight={Platform.OS == 'ios' ? 0 : 40} showsVerticalScrollIndicator={false} enableAutomaticScroll={true} keyboardShouldPersistTaps="handled">
                <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                    <View>
                        <Animated.Image style={styles.logoImage} resizeMode="contain" sharedTransitionTag="Tag" source={Images.Logo} />

                        <Text style={styles.phoneText}>Verify With Email</Text>
                        <Animated.Image style={styles.mailImage} resizeMode="contain" source={Images.tick} />

                        <Text style={styles.phoneSubText}>E-mail</Text>
                        <View style={[styles.InputView, { flexDirection: 'column' }]}>
                            <InputField placeholder="Please enter your moblie number" value={userEmail} onChangeText={setuserEmail} autoCapitalize='none' />
                            {/* <InputField placeholder="Please enter password" secureTextEntry value={userPass} onChangeText={setuserPass} /> */}
                        </View>
                        <TouchableOpacity onPress={() => props.navigation.navigate("ForgotPassword")}>
                            <Text style={styles.ForogotTxt}>Forgot Password</Text>
                        </TouchableOpacity>

                        <View style={{ marginHorizontal: 15 }}>
                            <TouchableOpacity onPress={handleSignin} style={[styles.touchView, { marginTop: metrics.hp5 }]} disabled={loading} >
                                {loading ? (<ActivityIndicator size="small" color={AllColors.white} />) : (<Text style={[styles.buttonInsideText]}>Sign In</Text>)}
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => props.navigation.navigate('MobileOTP')} style={[styles.touchView, { backgroundColor: AllColors.primary300 }]}>
                                {/* <TouchableOpacity onPress={() => props.navigation.navigate('LoginOTP')} style={[styles.touchView, { backgroundColor: AllColors.primary300 }]}> */}
                                <Text style={[styles.buttonInsideText, { color: AllColors.black }]}>Sign in with Number</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAwareScrollView>
            <ToastMessage type={toastType} message={toastMessage} />
        </Container>
    )
}

export default MobileLogin