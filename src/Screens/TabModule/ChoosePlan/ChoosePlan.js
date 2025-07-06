import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { Container } from '../../../Components/Container/Container';
import { AllColors } from '../../../Constants/COLORS';
import { CustomHeader } from '../../../Components/CustomHeader/CutsomHeader';
import { Images } from '../../../Assets/Images';
import { Fonts } from '../../../Constants/Fonts';
import { Instance } from '../../../Api/Instance';
import { useAuthContext } from '../../../context/AuthContext';
import RazorpayCheckout from 'react-native-razorpay';

export default function ChoosePlan({ navigation }) {
  const { options } = useAuthContext();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [plans, setPlans] = useState([]);

  const getAllSubscriptions = async () => {
    try {
      const response = await Instance.get(`/v1/subscriptions/users/subscriptionList`);
      setPlans(response.data.result);
      setLoading(false);
    } catch (error) {
      console.log("error on getAllSubscriptions: ", error);
      setLoading(false);
    }
  };

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
  };

  const handleRazorpayPayment = async () => {
    if (!selectedPlan) {
      Alert.alert('Please select a plan');
      return;
    }

    if (selectedPlan.amount === 0) {
      handleFreeSubscription();
      return;
    }

    setIsProcessing(true);
    
    try {
      const options = {
        description: `${selectedPlan.name} Subscription`,
        image: 'https://your-app-logo.png', // Add your app logo
        currency: 'INR',
        key: 'rzp_test_cEnvzyHa9o3Izi', // Replace with your Razorpay key
        amount: selectedPlan.amount * 100, // Amount in paise
        name: 'Your App Name',
        prefill: {
          email: 'user@example.com', // You can get this from user context
          contact: '9999999999', // You can get this from user context
          name: 'User Name' // You can get this from user context
        },
        theme: { color: AllColors.primary900 }
      };

      RazorpayCheckout.open(options).then((data) => {
        // Handle success
        console.log(`Payment success: ${data.razorpay_payment_id}`);
        handlePaidSubscription();
      }).catch((error) => {
        // Handle failure
        console.log(`Payment error: ${error.code} | ${error.description}`);
        Alert.alert('Payment Failed', error.description || 'Payment was not completed');
      }).finally(() => {
        setIsProcessing(false);
      });

    } catch (error) {
      console.log('Razorpay error:', error);
      setIsProcessing(false);
      Alert.alert('Error', 'Failed to initialize payment');
    }
  };

  const handleFreeSubscription = async () => {
    setIsProcessing(true);
    try {
      const response = await Instance.post(
        `/v1/subscriptions/apply/subscrition/${selectedPlan._id}`, 
        {}, 
        { headers: options }
      );
      
      Alert.alert(
        'Subscription Successful', 
        response?.data?.msg || 'You have successfully subscribed!', 
        [{ text: 'OK', onPress: () => navigation.navigate('TabNavigator') }]
      );
    } catch (error) {
      console.log("error on handleSubscription: ", error);
      Alert.alert('Subscription Failed', error?.response?.data?.msg || 'There was an issue with your subscription.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaidSubscription = async () => {
    try {
      const response = await Instance.post(
        `/v1/subscriptions/apply/subscrition/${selectedPlan._id}`, 
        {}, 
        { headers: options }
      );
      
      Alert.alert(
        'Payment & Subscription Successful', 
        response?.data?.msg || 'Your payment and subscription were successful!', 
        [{ text: 'OK', onPress: () => navigation.navigate('TabNavigator') }]
      );
    } catch (error) {
      console.log("error on handlePaidSubscription: ", error);
      Alert.alert('Subscription Failed', 'Payment was successful but there was an issue with your subscription. Please contact support.');
    }
  };

  useEffect(() => {
    getAllSubscriptions();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={AllColors.primary900} />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Container 
        statusBarStyle={'dark-content'} 
        statusBarBackgroundColor={AllColors.white} 
        backgroundColor={AllColors.white}
      >
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Image source={Images.BackButton} resizeMode="contain" style={styles.backButtonImage} />
          </TouchableOpacity>
          <Text style={styles.headerText}>Choose Your Plan</Text>
          <Text style={styles.subHeaderText}>Select the perfect plan for your needs</Text>
        </View>

        <View style={styles.plansContainer}>
          {plans.map((plan, index) => (
            <TouchableOpacity 
              key={plan._id} 
              style={[
                styles.planCard, 
                selectedPlan?._id === plan._id && styles.selectedPlanCard,
                index === 0 && styles.firstPlanCard // Special style for first plan
              ]} 
              onPress={() => handlePlanSelect(plan)}
            >
              {index === 0 && (
                <View style={styles.popularBadge}>
                  <Text style={styles.popularBadgeText}>POPULAR</Text>
                </View>
              )}
              <Text style={[
                styles.planName,
                selectedPlan?._id === plan._id && styles.selectedPlanText
              ]}>
                {plan.name}
              </Text>
              <Text style={[
                styles.planPrice,
                selectedPlan?._id === plan._id && styles.selectedPlanText
              ]}>
                ₹{plan.amount}
              </Text>
              <Text style={[
                styles.planDuration,
                selectedPlan?._id === plan._id && styles.selectedPlanText
              ]}>
                {plan.duration} Months
              </Text>
              {plan.features && (
                <View style={styles.featuresContainer}>
                  {plan.features.map((feature, i) => (
                    <View key={i} style={styles.featureItem}>
                      <Image 
                        source={selectedPlan?._id === plan._id ? Images.WhiteCheck : Images.GreenCheck} 
                        style={styles.checkIcon} 
                      />
                      <Text style={[
                        styles.featureText,
                        selectedPlan?._id === plan._id && styles.selectedPlanText
                      ]}>
                        {feature}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.infoIconContainer}>
            <Image source={Images.InfoIcon} style={styles.infoIcon} />
          </View>
          <Text style={styles.infoText}>
            Choose the best plan according to your needs! You can always upgrade later.
          </Text>
        </View>
        <TouchableOpacity 
          style={[
            styles.continueButton,
            !selectedPlan && styles.disabledButton
          ]} 
          onPress={handleRazorpayPayment}
          disabled={!selectedPlan || isProcessing}
        >
          {isProcessing ? (
            <ActivityIndicator color={AllColors.white} />
          ) : (
            <Text style={styles.continueButtonText}>
              {selectedPlan?.amount === 0 ? 'Start Free Trial' : 'Continue to Payment'}
            </Text>
          )}
        </TouchableOpacity>
      </Container>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AllColors.white
  },
  headerContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 15,
  },
  backButtonImage: {
    height: 35,
    width: 35,
  },
  headerText: {
    fontSize: 32,
    fontFamily: Fonts.AfacadBold,
    color: AllColors.primary900,
    marginBottom: 8,
  },
  subHeaderText: {
    fontSize: 16,
    fontFamily: Fonts.AfacadRegular,
    color: AllColors.darkGray,
    marginBottom: 20,
  },
  plansContainer: {
    paddingHorizontal: 15,
    marginTop: 10,
  },
  planCard: {
    backgroundColor: AllColors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: AllColors.lightGray,
    position: 'relative',
  },
  firstPlanCard: {
    borderColor: AllColors.primary,
  },
  selectedPlanCard: {
    backgroundColor: AllColors.primary900,
    borderColor: AllColors.primary900,
  },
  popularBadge: {
    position: 'absolute',
    top: -10,
    right: 20,
    backgroundColor: AllColors.secondary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  popularBadgeText: {
    color: AllColors.white,
    fontFamily: Fonts.AfacadBold,
    fontSize: 12,
  },
  planName: {
    fontSize: 20,
    fontFamily: Fonts.AfacadBold,
    color: AllColors.primary,
    marginBottom: 5,
  },
  planPrice: {
    fontSize: 28,
    fontFamily: Fonts.AfacadBold,
    color: AllColors.primary,
    marginBottom: 5,
  },
  planDuration: {
    fontSize: 16,
    fontFamily: Fonts.AfacadRegular,
    color: AllColors.secondary,
    marginBottom: 15,
  },
  selectedPlanText: {
    color: AllColors.white,
  },
  featuresContainer: {
    marginTop: 10,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  checkIcon: {
    width: 18,
    height: 18,
    marginRight: 10,
  },
  featureText: {
    fontSize: 14,
    fontFamily: Fonts.AfacadRegular,
    color: AllColors.darkGray,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AllColors.lightGray,
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 20,
    marginTop: 20,
  },
  infoIconContainer: {
    backgroundColor: AllColors.primary,
    borderRadius: 20,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoIcon: {
    width: 18,
    height: 18,
    tintColor: AllColors.white,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    fontFamily: Fonts.AfacadRegular,
    color: AllColors.darkGray,
    lineHeight: 20,
  },
  continueButton: {
    backgroundColor: AllColors.primary900,
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 20,
    marginTop: 30,
    marginBottom: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: AllColors.primary900,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  disabledButton: {
    backgroundColor: AllColors.lightGray,
  },
  continueButtonText: {
    fontSize: 18,
    fontFamily: Fonts.AfacadBold,
    color: AllColors.white,
  },
});