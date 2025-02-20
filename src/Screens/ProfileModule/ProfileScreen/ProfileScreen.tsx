import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
  Alert,
  ImageBackground,
} from "react-native";
import { NavigationProp } from "@react-navigation/native";
import Animated from "react-native-reanimated";
import { Images } from "../../../Assets/Images";
import { styles } from "./style";
import MenuItem from "./MenuItem";
import { CustomHeader } from "../../../Components/CustomHeader/CutsomHeader";
import metrics from "../../../Constants/Metrics";
import { Container } from "../../../Components/Container/Container";
import { AllColors } from "../../../Constants/COLORS";

interface ProfileScreenProps {
  navigation: NavigationProp<any, any>;
}
const ProfileScreen = (props: ProfileScreenProps) => {
  const menuItems = [
    {
      title: "Add broker account",
      subtitle: "Start your investment journey",
      iconName: Images.addBroker,
      onPress: () => console.log("Add broker account"),
    },
    {
      title: "My rewards",
      subtitle: "Get cashback & coins",
      iconName: Images.reward,
      onPress: () => console.log("My rewards"),
    },
    {
      title: "Invite friends",
      subtitle: "Invite friends & earn rewards",
      iconName: Images.invite,
      onPress: () => console.log("Invite friends"),
    },
  ];
  const stokItems = [
    {
      title: "Price alerts",
      subtitle: "Set stock price alerts",
      iconName: Images.inr,
      onPress: () => console.log("Price alert"),
    },
    {
      title: "All orders",
      subtitle: "Track order & get details",
      iconName: Images.order,
      onPress: () => Alert.alert("All Order"),
    },
  ];
  return (
    <Container  statusBarStyle={'dark-content'}
          statusBarBackgroundColor={AllColors.white}
          backgroundColor={AllColors.white}>

  
      {/* Header */}
      <CustomHeader
        type="back"
        screenName="Profile"
        onPressBack={() => {
          props.navigation.goBack();
        }}
        showSearch
        customImage={Images.BackButton}
      />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Section */}

        <View style={styles.sepratorSection}>
          <Text style={styles.title}>My Profile</Text>
        </View>
        <ImageBackground
          source={Images.profileBackground} // Update with your uploaded image path
          style={styles.profileSection}
          resizeMode="cover"
        >
          {/* <View style={styles.profileSection}> */}
          <Animated.View>
            <Image
              style={{ width: metrics.hp10, height: metrics.hp10 }}
              resizeMode="contain"
              source={Images.userAvatar}
            />
          </Animated.View>
          <View style={styles.userInfo}>
            <Text style={styles.name}>Smit Patel</Text>
            <Text style={styles.contact}>+91 1234 567890</Text>
            <Text style={styles.email}>smitpatel@gamil.com</Text>
          </View>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => props.navigation.navigate("EditProfile")}
          >
            <View style={styles.editContent}>
              <Animated.View style={styles.editIconWrapper}>
                <Image
                  resizeMode="contain"
                  source={Images.edit} // Replace with your icon path
                  style={styles.editIcon}
                />
              </Animated.View>
              <Text style={styles.editText}>Edit</Text>
            </View>
          </TouchableOpacity>
          {/* </View> */}
        </ImageBackground>
        {/* Info Section */}
        <View style={styles.sepratorSection}>
          <Text style={styles.title}>Your Info</Text>
        </View>
        <View style={styles.section}>
          {menuItems.map((item) => {
            return (
              <MenuItem
                title={item.title}
                subtitle={item.subtitle}
                iconName={item.iconName}
                onPress={item.onPress}
              />
            );
          })}
        </View>
        {/* Stocks Section */}
        <View style={styles.sepratorSection}>
          <Text style={styles.title}>Stocks</Text>
        </View>
        <View style={styles.section}>
          {stokItems.map((item) => {
            return (
              <MenuItem
                title={item.title}
                subtitle={item.subtitle}
                iconName={item.iconName}
                onPress={item.onPress}
              />
            );
          })}
        </View>
      </ScrollView>
      </Container>  );
};

export default ProfileScreen;
