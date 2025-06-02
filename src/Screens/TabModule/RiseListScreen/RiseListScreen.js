import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, View, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { AllColors } from '../../../Constants/COLORS';
import metrics from '../../../Constants/Metrics';
import { Fonts } from '../../../Constants/Fonts';
import { Container } from '../../../Components/Container/Container';
import { Instance } from '../../../Api/Instance';
import { CustomHeader } from '../../../Components/CustomHeader/CutsomHeader';

export default function RiseListScreen({ navigation, route }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { categoryId } = route.params;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Instance.get(`/v1/users/trade/${categoryId}`);
        if (response.data.result.length === 0) {
          setError('No data available in this category');
        } else {
          setData(response.data.result);
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch data');
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryId]);

  if (loading) {
    return (
      <Container backgroundColor={AllColors.white} statusBarBackgroundColor={AllColors.white} statusBarStyle="dark-content">
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={AllColors.primary900} />
        </View>
      </Container>
    );
  }

  if (error) {
    return (
      <Container backgroundColor={AllColors.white} statusBarBackgroundColor={AllColors.white} statusBarStyle="dark-content">
        <View style={styles.loaderContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </Container>
    );
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('RiseListChat', { itemData: item })}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.city}>{item.trade.name}</Text>
        <Text style={styles.city}>{item.city}</Text>
        <Text style={{ fontFamily: Fonts.AfacadRegular }}>Tap to chat</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <Container backgroundColor={AllColors.white} statusBarBackgroundColor={AllColors.white} statusBarStyle="dark-content">
      <CustomHeader type="back" screenName="Rise List" onPressBack={() => { navigation.goBack(); }} />
      <TextInput style={styles.textInputView} cursorColor={AllColors.black} placeholder="City Name" />
      <FlatList data={data} renderItem={renderItem} keyExtractor={(item) => item._id} contentContainerStyle={styles.flatlistContainer} />
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AllColors.white,
  },
  textInputView: {
    height: metrics.hp6,
    borderRadius: metrics.hp1,
    paddingLeft: 11,
    fontSize: 14,
    color: AllColors.black,
    fontFamily: Fonts.AfacadBold,
    marginHorizontal: 15,
    marginVertical: 10,
    borderWidth: 1,
  },
  flatlistContainer: {
    paddingHorizontal: 15,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: AllColors.white,
    elevation: 5,
    borderRadius: 10,
    marginVertical: 10,
    padding: 10,
    shadowColor: AllColors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 50,
    marginRight: 15,
    alignSelf: 'center',
  },
  textContainer: {
    justifyContent: 'flex-start',
  },
  name: {
    fontSize: 18,
    fontFamily: Fonts.AfacadBold,
    color: AllColors.black,
  },
  city: {
    fontSize: 15,
    color: AllColors.grey,
    fontFamily: Fonts.AfacadMedium,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    fontFamily: Fonts.AfacadRegular,
    color: AllColors.red,
    textAlign: 'center',
  },
});
