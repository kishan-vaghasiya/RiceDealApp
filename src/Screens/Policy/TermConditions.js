import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';

export default function TermConditions() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Terms and Conditions</Text>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        <Text style={styles.text}>
          Welcome to DealFor Rice Application. By using this app, you agree to comply with and be bound by the following terms and conditions:
          {'\n\n'}
          1. **Use of the App**{'\n'}
          The app allows users to browse, buy, and sell rice and related products. All transactions are the responsibility of the users involved.
          {'\n\n'}
          2. **Product Listings**{'\n'}
          Sellers must provide accurate information regarding the rice quality, price, and availability. Misleading listings may result in account suspension.
          {'\n\n'}
          3. **Payments**{'\n'}
          Payments made through the app are processed securely. DealFor Rice is not liable for disputes between buyers and sellers regarding transactions.
          {'\n\n'}
          4. **Account Security**{'\n'}
          Users are responsible for maintaining the confidentiality of their account details and for all activities under their account.
          {'\n\n'}
          5. **Privacy Policy**{'\n'}
          We respect your privacy. Please refer to our Privacy Policy for details on how we handle your data.
          {'\n\n'}
          6. **Changes to Terms**{'\n'}
          DealFor Rice reserves the right to update these terms at any time. Continued use of the app signifies your acceptance of any changes.
          {'\n\n'}
          If you have any questions regarding these Terms and Conditions, please contact our support team.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 50,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2e3a59',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  text: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
});
