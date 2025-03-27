import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet, Text, View, Image, TouchableOpacity, ActivityIndicator, } from 'react-native';
import { Container } from '../../../Components/Container/Container';
import { AllColors } from '../../../Constants/COLORS';
import { CustomHeader } from '../../../Components/CustomHeader/CutsomHeader';
import { Fonts } from '../../../Constants/Fonts';
import moment from 'moment';
import { Instance } from '../../../Api/Instance';
import { GET_PRODUCT } from '../../../Api/Api_End_Points';

export default function DealPostList({ navigation }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Instance.get(GET_PRODUCT.url);
        setData(response.data.result);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChatNavigation = (senderId, item) => {
    // socketServices.emit('seenMessages', { userId: authUser._id, senderId });
    navigation.navigate('ChatScreen', { userId: senderId, user: item })
  }

  if (loading) {
    return (
      <Container statusBarStyle={'dark-content'} statusBarBackgroundColor={AllColors.white} backgroundColor={AllColors.white}>
        <CustomHeader type="back" screenName="Deals For Today" onPressBack={() => { navigation.goBack(); }} />
        <ActivityIndicator size="large" color={AllColors.primary900} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} />
      </Container>
    );
  }

  return (
    <Container statusBarStyle={'dark-content'} statusBarBackgroundColor={AllColors.white} backgroundColor={AllColors.white}>
      <CustomHeader type="back" screenName="Deals For Today" onPressBack={() => { navigation.goBack(); }} />
      <FlatList
        data={data}
        keyExtractor={item => item._id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={{ marginTop: 13, bottom: 3 }}>
            {/* <TouchableOpacity style={styles.itemContainer} onPress={() => navigation.navigate('DealChat', { userData: item })}> */}
            <TouchableOpacity style={styles.itemContainer} onPress={() => handleChatNavigation(item?.user?._id, item?.user)}>
              <Image source={{ uri: item.image }} resizeMode="contain" style={styles.image} />
              <View style={styles.contentContainer}>
                <View style={styles.textContainer}>
                  <Text style={styles.title}>{item.name}</Text>
                  <Text style={styles.amount}>{moment(item.createdAt).format('MMM D, YYYY, h:mm A')}</Text>
                </View>
                <Text style={styles.amountText}>₹ {item.price}</Text>
              </View>
            </TouchableOpacity>
          </View>
        )
        }
      />
    </Container >
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: AllColors.white,
    elevation: 5,
    marginHorizontal: 15,
    borderRadius: 8,
    padding: 15,
  },
  image: {
    width: 325,
    alignSelf: 'center',
    height: 150,
    borderRadius: 8,
    marginBottom: 5,
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontFamily: Fonts.AfacadMedium,
    color: AllColors.black,
  },
  amount: {
    fontSize: 16,
    color: AllColors.gray,
    fontFamily: Fonts.AfacadRegular,
    marginTop: 5,
  },
  amountText: {
    fontSize: 20,
    fontFamily: Fonts.AfacadBold,
    color: AllColors.black,
    textAlign: 'right',
  },
});
