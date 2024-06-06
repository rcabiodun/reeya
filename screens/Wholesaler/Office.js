import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, Animated } from 'react-native';
import { FontAwesome5, MaterialIcons, Ionicons, Feather } from '@expo/vector-icons';
import { hideAsync } from 'expo-splash-screen';
import Message, { addMessage } from "../../components/messagetoast";
import AsyncStorage from '@react-native-async-storage/async-storage';

import { color_scheme } from '../../colorscheme';
import OfficeList from '../../components/OfficeList';
//add message toast to display messages
export default function OfficeScreen(props) {
    const opacity = useRef(new Animated.Value(0)).current



    async function removeToken() {
        try {
            let keys = await AsyncStorage.getAllKeys()
            console.log(keys)
            await AsyncStorage.multiRemove(keys)
            //addMessage("Logging out")
            //await AsyncStorage.removeItem('token')
            props.navigation.replace('OnboardingStack')
            //console.log("removed token")
        } catch (err) {
            console.error(err)
        }
    }

    const [messages, setmessages] = useState([])
    let pages = [
        { icon: 'home', name: "Your Items", page: "ItemList" },
        { icon: 'users', name: "Workers", page: "WorkersList" },

        { icon: "log-out", name: "Logout", page: removeToken },
    ]
    let counter = 0

    function err(err) {
        console.log(err)
    }



    useEffect(() => {
        //if('username' in props.route.params){
        //addMessage(`${props.route.params.username} created`)
        Animated.sequence([
            Animated.delay(50),
            Animated.spring(opacity, { toValue: 1, useNativeDriver: true, })
        ]).start()
        //}
    }, [])








    //for skipping to homepage when logged in 

    return (
        <View style={styles.container}>
            <View style={{ position: 'absolute', top: 25, left: 0, right: 0, paddingHorizontal: 20 }}>
                {messages.map(m => {
                    return (
                        <Message
                            //sending a message 
                            key={counter + 1}
                            message={m}
                            onHide={() => {
                                setmessages((messages) => messages.filter((currentMessage) => {
                                    currentMessage !== m

                                }
                                ))
                            }}
                        />

                    )
                })}
            </View>
            <View style={[styles.header, { paddingHorizontal: 16, justifyContent: "center", }]}>
                <Text style={[{ fontFamily: 'bold', fontSize: 28, marginTop: 5 }]}> Office</Text>


            </View>
            <View style={{ height: 30 }}></View>
            <View style={{justifyContent:"center",alignItems:"center"}}>

                {
                    pages.map((v, i) => {
                        return (
                            <OfficeList key={i} removeToken={removeToken} v={v} i={i} navigation={props.navigation} />
                        )
                    })
                }
            </View>

            <Animated.View style={{
                transform: [{
                    translateY: opacity.interpolate({
                        inputRange: [0, 1],
                        outputRange: [50, 0],
                    }),

                }],

                transform: [{
                    translateX: opacity.interpolate({
                        inputRange: [0, 1],
                        outputRange: [65, 0],
                    }),

                }],



                opacity,
                position: 'absolute',
                bottom: 0
            }}>
                <Text style={styles.DescriptionTxt}>
                    <Feather name="info" size={16} color={color_scheme.grey} /> Tips: To widthraw th amount seen in the previous page kindly send an mail to the platforms email ,which is rcabiodun@gmail.com
                </Text>
            </Animated.View>


        </View>

    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: StatusBar.currentHeight + 5,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    DescriptionTxt: {
        fontFamily: 'reg',
        fontWeight: "500",
        fontSize: 10,
        color: color_scheme.grey,
        textAlign: 'center',
        paddingHorizontal: 40,

    },

});
