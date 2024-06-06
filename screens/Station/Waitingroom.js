//this is where the user waits to be added to a station
import React, { useEffect, useRef, useState } from "react";
import { View, Text, Animated, TouchableOpacity, TextInput, StatusBar } from "react-native";
import generateColorScheme, { color_scheme, dispatch_color_scheme, retailer_color_scheme, wholesaler_color_scheme } from "../../colorscheme";
import Message, { addMessage } from "../../components/messagetoast";
import * as SplashScreen from 'expo-splash-screen'
import _loadMyFonts from "../../fontloader";
import * as Animatable from 'react-native-animatable'
import Endpoints from "../../backend";
import { Feather, MaterialIcons, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
const backend = new Endpoints()
// define a component to render the screen
let counter = 0
export default function WaitingRoom(props) {
    const curveRadius = useRef(new Animated.Value(0)).current
    const [profile, setProfile] = useState({})
    const [messages, setmessages] = useState([])

    function AnimateCurveRadius() {
        // reset the value if it's already reached the target
        // start the animation
        Animated.sequence([

            Animated.delay(900),
            Animated.spring(curveRadius, {

                toValue: 70, // final value
                friction: 3,
                // lower means more bouncy
                useNativeDriver: false, // required for borderRadius animation

            })]).start();

    }
    // start the animations when the component mounts
    useEffect(() => {
        //saving categories to state
        async function SetScreen() {
            await backend.getProfile(setProfile, addMessage, setmessages)

        }
        SetScreen()
        AnimateCurveRadius()
    }, [])
    async function removeToken() {
        try {
            let keys = await AsyncStorage.getAllKeys()
            console.log(keys)
            await AsyncStorage.multiRemove(keys)
            props.navigation.replace('OnboardingStack')
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <View style={styles.body} onLayout={async () => { await SplashScreen.hideAsync() }}>
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




            <Animatable.View
                animation="slideInUp"
                iterationCount={1}
                duration={1000}>
                <Animated.View
                    style={{
                        width: 350,
                        height: 380,
                        alignItems: "center",
                        backgroundColor: color_scheme.primary,
                        borderWidth: 1,
                        borderRadius: curveRadius,
                        borderColor: color_scheme.accent,
                        elevation: 3
                    }}

                >
                    <Animatable.View
                        animation="zoomInUp"
                        iterationCount={1}
                        duration={1500}
                        delay={900}>
                        <Text style={[styles.heading, { fontSize: 14 }]}>Send the code below to your Employer to add you to their organization.</Text>


                    </Animatable.View>


                    <Animatable.View
                        animation={"slideInUp"}
                        iterationCount={1}
                        duration={1000}
                        style={styles.codeBtn} >
                        <Text style={styles.codeTxt}>{profile._id}</Text>
                    </Animatable.View>

                </Animated.View>

            </Animatable.View>
            <TouchableOpacity style={{
                width: 60,
                height: 60,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 30,
                backgroundColor: color_scheme.lightpurple,
                position: "absolute",
                bottom: 10
            }} onPress={async()=>{ await removeToken()}}>
                <Feather name='log-out' size={25} color={color_scheme.primary} />
            </TouchableOpacity>
        </View>
    );
}



const styles = {
    body: {
        flex: 1,
        backgroundColor: color_scheme.secondary,
        paddingTop: StatusBar.currentHeight,
        alignItems: "center",
        justifyContent: 'center'
    },
    heading: {
        fontFamily: "bold",

        color: color_scheme.secondary,
        fontSize: 15,
        textAlign: "center"

    },
    subHeading: {
        fontFamily: "reg",
        color: color_scheme.primary
    },
    codeBtn: {
        backgroundColor: color_scheme.accent,
        padding: 7
    },
    input: {
        width: 260,
        fontFamily: "reg",
        height: 55,
        backgroundColor: color_scheme.secondary,
        borderRadius: 10,
        padding: 10,
        margin: 8,
        color: color_scheme.accent
    },
    codeTxt: {
        fontFamily: "reg",
        color: color_scheme.secondary
    },
    NextBtn: {
        backgroundColor: color_scheme.accent,
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
        borderColor: color_scheme.accent,
        borderWidth: 2
    }
}