import {NavigationProp} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  FlatList,
  Image,
  ImageBackground,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Images} from '../../../Assets/Images';
import {styles} from './styles';
import {CustomHeader} from '../../../Components/CustomHeader/CutsomHeader';

interface InvestScreenProps {
  // route: { params: { changeSignInStatus: (flag: boolean) => void } }
  navigation: NavigationProp<any, any>;
}

const data = [
  {
    id: '1',
    title: 'Tap to Chat',
    image:
      'https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg',
  },
  {
    id: '2',
    title: 'Tap to Chat',
    image:
      'https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg',
  },
];

const InvestScreen = (props: InvestScreenProps) => {
  const renderItem = ({item, index}: any) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        props.navigation.navigate('ChatScreen');
      }}>
      <Image source={Images.Logo} style={styles.image}resizeMode='contain' />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subtitle}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView></SafeAreaView>
      <CustomHeader
        type="back"
        screenName="Chat"
        onPressBack={() => {
          props.navigation.navigate('Home');
        }}
      />
      <FlatList
        data={data}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

export default InvestScreen;
