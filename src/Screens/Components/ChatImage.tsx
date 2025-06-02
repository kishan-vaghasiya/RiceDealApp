import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const ChatImage = (item: any) => {
    return (
        <View style={styles.imageContainer}>
            {/* {uploading ? <>
                    <ActivityIndicator style={styles.loader} size="small" color="#007AFF" />
                  </> : <>
                  </>} */}
            {item?.image && <Image source={{ uri: item?.image }} style={styles.messageImage} onLoadStart={() => setImageLoading(true)} onLoadEnd={() => setImageLoading(false)} />}
            {imageLoading && (<ActivityIndicator style={styles.loader} size="small" color="#007AFF" />)}
        </View>
    )
}

export default ChatImage

const styles = StyleSheet.create({})