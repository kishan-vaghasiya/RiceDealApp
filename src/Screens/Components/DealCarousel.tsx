/* import React from "react";
import { View, Image, TouchableOpacity, Text, StyleSheet } from "react-native";
import Carousel from "react-native-snap-carousel";
import { Dimensions } from 'react-native';
const { width } = Dimensions.get('window');


const DealCarousel = ({ navigation, data }: any) => {
    const renderItem = ({ item }: any) => (
        <TouchableOpacity onPress={() => navigation.navigate("DealPostList", { dealId: item._id })} style={styles.itemContainer}>
            <Image source={{ uri: item.image }} style={styles.banner} />
            <Text style={styles.dealName}>{item.name}</Text>
            <Text style={styles.dealPrice}> {item.price}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Carousel
                data={data}
                renderItem={renderItem}
                sliderWidth={width}
                itemWidth={width * 0.75}
                layout="default"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        marginTop: 20,
    },
    itemContainer: {
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    banner: {
        width: 200,
        height: 120,
        borderRadius: 10,
    },
    dealName: {
        fontSize: 16,
        fontWeight: "bold",
        marginTop: 5,
    },
    dealPrice: {
        fontSize: 14,
        color: "green",
    },
});

export default DealCarousel;
 */
// DealCarousel.tsx

// DealCarousel.tsx
import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import Swiper from 'react-native-swiper';

const { width } = Dimensions.get('window');

const DealCarousel = ({ data, navigation, type }: any) => {
    return (
        <View style={styles.container}>
            <Swiper
                autoplay
                showsPagination
                dotColor="#ccc"
                activeDotColor="#007AFF"
                height={230}
            >
                {data.map((item: any, index: number) => (
                    <TouchableOpacity key={index} style={styles.slide} onPress={() => navigation.navigate("DealPostList", { dealId: item._id })}>
                        <Image source={{ uri: item.image }} style={styles.image} />
                        <Text style={styles.name}>{item.name}</Text>
                        {type == "product" && <Text style={styles.price}>₹ {item.price}</Text>}
                        {/* <Text style={styles.price}>${item.price}</Text> */}
                    </TouchableOpacity>
                ))}
            </Swiper>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        height: 250,
    },
    slide: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        marginHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
    },
    image: {
        width: width * 0.7,
        height: 130,
        borderRadius: 10,
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
        marginTop: 10,
    },
    price: {
        fontSize: 14,
        color: 'green',
    },
});

export default DealCarousel;