import React, { useEffect, useRef, useState } from "react";
import { View, Text, Animated, TouchableOpacity, TextInput } from "react-native";
import generateColorScheme, { color_scheme, dispatch_color_scheme, retailer_color_scheme, wholesaler_color_scheme } from "../../colorscheme";
import Message, { addMessage } from "../../components/messagetoast";
import * as SplashScreen from 'expo-splash-screen';
import _loadMyFonts from "../../fontloader";
import Endpoints from "../../backend";
import AsyncStorage from "@react-native-async-storage/async-storage";
// define a function to create a bubble like animation

const backend = new Endpoints()

const counter=0
// define a component to render the screen
export default function LoginScreen({navigation}) {
    // create three animated values for each view
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [messages, setmessages] = useState([])


    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: "center", backgroundColor: color_scheme.secondary }} onLayout={async () => { await SplashScreen.hideAsync() }}>
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
            <View style={{ flex: 1.2, justifyContent: "center", alignItems: "center" }}>
                <Text style={styles.heading}>Welcome</Text>
                <Text style={styles.subHeading}>
                    Login into your account
                </Text>
            </View>

            <View style={{ flex: 2 }}>
                <TextInput
                    style={styles.input}
                    placeholder="Username"
                    onChangeText={(txt) => { setUsername(txt) }}

                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    onChangeText={(txt) => { setPassword(txt) }}
                />
                <View style={{ justifyContent: "center", alignItems: "center", paddingTop: 30 }}>
                    <TouchableOpacity style={styles.loginBtn} onPress={async () => {
                      let station_type=await AsyncStorage.getItem("station_type")
                      console.log(station_type)
                      if(username=="Admin"&& password=="Admin"){
                        navigation.replace("Admin_StationRequest")
                      }
                      await backend.login({ username, password },addMessage,setmessages,navigation)
                    }}>
                        <Text style={styles.loginTxt}>Login</Text>
                    </TouchableOpacity>
                </View>
            </View>

        </View>
    );
}



const styles = {
    heading: {
        fontFamily: "bold",
        color: color_scheme.primary,
        fontSize: 26
    },
    subHeading: {
        fontFamily: "reg",
        color: color_scheme.primary
    },
    loginBtn: {
        backgroundColor: color_scheme.accent,
        width: 130,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5
    },
    input: {
        width: 280,
        fontFamily: "reg",
        height: 50,
        borderWidth: 1,
        borderColor: color_scheme.accent,
        borderRadius: 10,
        padding: 10,
        margin: 10,
        color: color_scheme.accent
    },
    loginTxt: {
        fontFamily: "reg",
        color: color_scheme.secondary
    }
}