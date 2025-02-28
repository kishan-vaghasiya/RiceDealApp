import { FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { useAuthContext } from '../../../context/AuthContext';
import { Instance } from '../../../Api/Instance';
import { Container } from '../../../Components/Container/Container';
import { AllColors } from '../../../Constants/COLORS';
import { Images } from '../../../Assets/Images';
import { Fonts } from '../../../Constants/Fonts';
import moment from 'moment';


const SubscribedView = ({ item }: any) => {
    // console.log("item: ", item);

    return (
        <View style={styles.mainView}>
            <View>
                <Text style={styles.textTitle}>{item?.subscriptionId?.name}</Text>
                <Text style={styles.textTitle}>₹ {item?.amount}</Text>
                <Text style={styles.textTitle}>{item?.duration} Month{item?.duration > 1 && "s"}</Text>
            </View>
            <View>
                <Text style={styles.textTitle}>{moment(item?.startDate).format('LL')}</Text>
                <Text style={styles.textTitle}>{moment(item?.endDate).format('LL')}</Text>
                <Text style={[styles.textTitle, { textTransform: 'capitalize' }]}>{item?.status}</Text>
            </View>
        </View>
    )
}

const Subscribed = () => {
    const navigation = useNavigation<any>();
    const { options } = useAuthContext()

    const [subscriptionHistory, setSubscriptionHistory] = useState<any>([])
    const [loading, setLoading] = useState<boolean>(true)


    const getAllSubscribedLists = async () => {
        try {
            const response = await Instance.get(`/v1/subscriptions/history/user/subscription`, { headers: options });
            if (response.data && response.data.success) {
                // console.log('Subscribed Lists:', response.data);
                setSubscriptionHistory(response?.data?.result)
                setLoading(false)
            } else {
                console.log('Error fetching subscribed lists:', response.data.message);
                setLoading(false)
            }
        } catch (error) {
            console.error('Error fetching subscribed lists:', error);
            setLoading(false)
        }
    }

    useEffect(() => {
        getAllSubscribedLists()
    }, [loading])


    return (
        <Container statusBarStyle={'dark-content'} statusBarBackgroundColor={AllColors.white} backgroundColor={AllColors.white}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Image source={Images.BackButton} resizeMode="contain" style={styles.backButtonImage} />
            </TouchableOpacity>
            <View style={styles.headingContainer}>
                <Text style={styles.headingText}>Subscribed Lists</Text>
            </View>

            <ScrollView >
                <FlatList data={subscriptionHistory} keyExtractor={(_, index) => index.toString()} renderItem={({ item }) => <SubscribedView item={item} />} />
            </ScrollView>


        </Container >
    )
}

export default Subscribed

const styles = StyleSheet.create({
    backButton: {
        marginLeft: 15,
    },
    backButtonImage: {
        height: 35,
        width: 35,
    },
    headingContainer: {
        marginBottom: 20,
        marginLeft: 20,
        marginTop: 20,
    },
    headingText: {
        fontSize: 24,
        fontFamily: Fonts.AfacadBold,
        color: AllColors.black,
    },
    mainView: {
        width: '90%',
        backgroundColor: AllColors.white,
        marginBottom: 10,
        padding: 10,
        borderRadius: 10,
        shadowColor: '#000',
        alignSelf: 'center',
        borderWidth: 1,
        elevation: 3,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    textTitle: {
        color: AllColors.black,
        fontSize: 15
    }
})