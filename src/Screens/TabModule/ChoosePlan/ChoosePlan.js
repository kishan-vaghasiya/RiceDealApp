import React, {useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View,Alert} from 'react-native';
import {Container} from '../../../Components/Container/Container';
import {AllColors} from '../../../Constants/COLORS';
import {CustomHeader} from '../../../Components/CustomHeader/CutsomHeader';
import {Images} from '../../../Assets/Images';
import {Fonts} from '../../../Constants/Fonts';
import usePhonePePayment from '../../../Components/PhonePay/usePhonePePayment';

export default function ChoosePlan({navigation}) {
  const [selectedPlanIndex, setSelectedPlanIndex] = useState(0);
  const {submitHandler} = usePhonePePayment(); 
  const plans = [
    {price: 'Free', duration: '7 days', amount: 0},
    {price: '₹ 3000', duration: '3 Months', amount: 3000},
    {price: '₹ 6000', duration: '6 Months', amount: 6000},
    {price: '₹ 12000', duration: '1 year', amount: 12000},
  ];

  const handlePlanSelect = index => {
    setSelectedPlanIndex(index);
  };

  const handleContinue = async () => {
    const selectedPlan = plans[selectedPlanIndex];
    if (selectedPlan.amount === 0) {
      navigation.navigate('TabNavigator');
    } else {
      const result = await submitHandler(selectedPlan.amount);
      console.log(result);
      if (result.status === 'SUCCESS') {
        Alert.alert('Payment Successful', 'You have successfully made the payment!', [
          {
            text: 'OK', 
            onPress: () => {
              setTimeout(() => {
                navigation.navigate('TabNavigator');  
              }, 500); 
            }
          }
        ]);
      } else {
        Alert.alert('Payment Failed', 'There was an issue with your payment. Please try again.');
      }
    }
  };
  

  return (
    <Container
      statusBarStyle={'dark-content'}
      statusBarBackgroundColor={AllColors.white}
      backgroundColor={AllColors.white}>
      <TouchableOpacity style={styles.backButton} onPress={()=>navigation.goBack()}>
        <Image
          source={Images.BackButton}
          resizeMode="contain"
          style={styles.backButtonImage}
        />
      </TouchableOpacity>
      <View>
        <Text style={styles.headerText}>Choose{'\n'}Your Plan</Text>
      </View>

      <View style={styles.plansContainer}>
        {plans.map((plan, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.planCard,
              selectedPlanIndex === index && styles.selectedPlanCard,
            ]}
            onPress={() => handlePlanSelect(index)}>
            <Text
              style={[
                styles.planPrice,
                selectedPlanIndex === index && styles.selectedPlanPrice,
              ]}>
              {plan.price}
            </Text>
            <Text
              style={[
                styles.planDuration,
                selectedPlanIndex === index && styles.selectedPlanDuration,
              ]}>
              {plan.duration}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          Choose the best plan according to your needs! You can always upgrade
          later.
        </Text>
      </View>

      <TouchableOpacity
        style={styles.continueButton}
        onPress={handleContinue}>
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>
    </Container>
  );
}

const styles = StyleSheet.create({
  backButton: {
    marginLeft: 15,
  },
  backButtonImage: {
    height: 35,
    width: 35,
  },
  headerText: {
    textAlign: 'center',
    fontSize: 40,
    fontFamily: Fonts.AfacadBold,
    lineHeight: 40,
    marginTop: 30,
  },
  plansContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    marginTop: 30,
  },
  planCard: {
    backgroundColor: AllColors.white,
    width: 160,
    height: 130,
    margin: 10,
    borderRadius: 8,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3.5,
  },
  selectedPlanCard: {
    backgroundColor: AllColors.primary900,
  },
  planPrice: {
    fontSize: 28,
    fontFamily: Fonts.AfacadBold,
    color: AllColors.primary,
  },
  selectedPlanPrice: {
    color: AllColors.white,
  },
  planDuration: {
    fontSize: 18,
    fontFamily: Fonts.AfacadRegular,
    color: AllColors.secondary,
  },
  selectedPlanDuration: {
    color: AllColors.white,
  },
  infoContainer: {
    marginTop: 20,
    marginHorizontal: 20,
    padding: 10,
    backgroundColor: AllColors.lightGray,
    borderRadius: 8,
    alignItems: 'center',
  },
  infoText: {
    fontSize: 16,
    fontFamily: Fonts.AfacadRegular,
    color: AllColors.darkGray,
    textAlign: 'center',
  },
  continueButton: {
    backgroundColor: AllColors.primary900,
    padding: 15,
    borderRadius: 10,
    marginTop: 190,
    justifyContent: 'center',
    marginHorizontal: 20,
  },
  continueButtonText: {
    fontSize: 18,
    fontFamily: Fonts.AfacadBold,
    color: AllColors.white,
    textAlign: 'center',
  },
});
