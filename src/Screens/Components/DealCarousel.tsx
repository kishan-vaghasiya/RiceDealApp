import React from "react";
import { View, Image, TouchableOpacity, Text, StyleSheet } from "react-native";
// import Carousel from "react-native-snap-carousel";

/* const data = [
    {
        _id: "67b5b95359fba365e09ca5ba",
        name: "Ggg",
        price: 55,
        user: "67b2c38a872c1907bb9d3f7c",
        createdAt: "2025-02-19T10:58:27.428Z",
        updatedAt: "2025-02-19T10:58:27.428Z",
        image: "https://via.placeholder.com/300", // Replace with actual image URL
    },
    // Add more deals here
]; */

const DealCarousel = ({ navigation, data }: any) => {
    const renderItem = ({ item }: any) => (
        <TouchableOpacity onPress={() => navigation.navigate("DealPostList", { dealId: item._id })} style={styles.itemContainer}>
            <Image source={{ uri: item.image }} style={styles.banner} />
            <Text style={styles.dealName}>{item.name}</Text>
            <Text style={styles.dealPrice}> RS{item.price}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {/* <Carousel
                data={data}
                renderItem={renderItem}
                sliderWidth={300}
                itemWidth={250}
                layout="default"
            /> */}
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
