import { NavigationProp, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  Image,
  ImageBackground,
  Keyboard,
  Platform,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Images } from "../../../Assets/Images";
import { styles } from "./styles";
import { AllColors } from "../../../Constants/COLORS";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Fonts, fontSize } from "../../../Constants/Fonts";
import { AllRegexss } from "../../../Constants/AllRegexss";
import Animated from "react-native-reanimated";
import { Container } from "../../../Components/Container/Container";
import ToastMessage from "../../../Components/ToastMessage/ToastMessage";
import { requestUserPermission } from "../../utils/PushNotification";
import messaging from '@react-native-firebase/messaging';
interface LoginScreenProps {
  // route: { params: { changeSignInStatus: (flag: boolean) => void } }
  navigation: NavigationProp<any, any>;
}

const LoginScreen = (props: LoginScreenProps) => {
  const navigation = useNavigation<any>()
  const [number, onChangeNumber] = useState("");
  const [isSelected, setIsSelected] = useState(Boolean);
  const [fcmToken, setFcmToken] = useState<any>('');
  const [userMobileNumber, setuserMobileNumber] = useState<string>(
    __DEV__ ? "" : ""
  );
  const [userMobileNumberHasError, setuserMobileNumberHasError] =
    useState<boolean>(false);
  const [userMobileNumberErrorString, setuserMobileNumberErrorString] =
    useState<string>("");

  const getFCMToken = async () => {
    let token = await messaging().getToken();
    setFcmToken(token);
    console.log(token, 'my token');
  };

  function onChageMobileNumber(text: string) {
    if (text) {
      setuserMobileNumber(text);
      AllRegexss.mobileFormate.test(text) ? (setuserMobileNumberHasError(false),
        setuserMobileNumberErrorString(""), Keyboard.dismiss()) : (setuserMobileNumberHasError(true),
          setuserMobileNumberErrorString("Please enter valid mobile number"));
    } else {
      setuserMobileNumber(text);
      text.length < 11 && text.length != 0 ? (setuserMobileNumberHasError(true),
        setuserMobileNumberErrorString("Please enter valid mobile number")) : (setuserMobileNumberHasError(false),
          setuserMobileNumberErrorString(""));
    }
  }

  function SendOTP(Type: string) {
    navigation.navigate("LoginDetails", { Type: Type == 'Email' ? 'Email' : "OTP" });
  }

  useEffect(() => {
    requestUserPermission();
    getFCMToken();
  }, []);

  return (
    <Container statusBarStyle={'dark-content'} statusBarBackgroundColor={AllColors.white} backgroundColor={AllColors.white}>

      <KeyboardAwareScrollView style={styles.marginView} enableOnAndroid={true} extraScrollHeight={Platform.OS == "ios" ? 0 : 40} enableAutomaticScroll={true} keyboardShouldPersistTaps="handled">

        <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss(); }}>
          <View>
            <Animated.Image style={styles.logoImage} resizeMode="contain" sharedTransitionTag="Tag" source={Images.Logo} />
            <Text style={styles.phoneText}>{"Login With E-mail"}</Text>
            <Animated.Image style={styles.mailImage} resizeMode="contain" source={Images.tick} />
            <Text style={styles.phoneSubText}>{"Select your Login"}</Text>
            <View style={styles.InputView}></View>

            <TouchableOpacity onPress={() => { SendOTP("Email") }} style={styles.touchView}>
              <Text style={[styles.buttonInsideText,]}>Login with E-mail</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => { SendOTP("OTP") }} style={[styles.touchView, { backgroundColor: AllColors.primary300, },]}>
              <Text style={[styles.buttonInsideText, { color: AllColors.black, },]}>Login with OTP</Text>
            </TouchableOpacity>
            <Text style={styles.DontTxt}>Don't have an Account? <Text style={styles.siguptxt} onPress={(() => props.navigation.navigate('AboutProfileScreen'))}>Singup</Text></Text>
          </View>

        </TouchableWithoutFeedback>
      </KeyboardAwareScrollView>
    </Container>
  );
};

export default LoginScreen;
