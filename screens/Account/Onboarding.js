import React, { useEffect, useRef, useState } from "react";
import { View, Text, Animated, TouchableOpacity } from "react-native";
import generateColorScheme, { dispatch_color_scheme, retailer_color_scheme, wholesaler_color_scheme } from "../../colorscheme";
import Message, { addMessage } from "../../components/messagetoast";
import * as SplashScreen from 'expo-splash-screen'
import _loadMyFonts from "../../fontloader";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Endpoints from "../../backend";

let backend = new Endpoints()
// define a function to create a bubble like animation

const createBubbleAnimation = (animatedValue) => {
  // return an animated timing function
  return Animated.loop(
    // alternate between two values
    Animated.sequence([
      // animate from 1 to 1.2
      Animated.timing(animatedValue, {
        toValue: 1.2,
        duration: 1000,
        useNativeDriver: true,
      }),
      // animate from 1.2 to 1
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ])
  );
};

// define a component to render the screen
export default function Onboarding(props) {
  // create three animated values for each view#
  const animatedValue1 = useRef(new Animated.Value(1)).current;
  const animatedValue2 = useRef(new Animated.Value(1)).current;
  const animatedValue3 = useRef(new Animated.Value(1)).current;
  const [appIsReady, setAppIsReady] = useState(false);

  // start the animations when the component mounts
  useEffect(() => {
    console.log("dddddd")
  }, [])
  async function loginapi() {

    const requestOptions = {
      method: 'Post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: "Er9io", password: "peaklane" })
    }
    try {
      console.log("Trying to log you in")
      let response = await fetch(`http://192.168.143.202:3000/api/account/login`.trim(), requestOptions)
      let result = await response.json()
      console.log(result)

    } catch (err) {
      console.log(err)
      console.log("here bitch")


    }


  }
  useEffect(() => {
    createBubbleAnimation(animatedValue1).start();
    createBubbleAnimation(animatedValue2).start();
    createBubbleAnimation(animatedValue3).start();
  }, []);


  return (
    <View style={{ flex: 1, justifyContent: 'center' }} onLayout={async () => {
      await backend.handleScreenNavigationBasedOnRole(props.navigation)

      await SplashScreen.hideAsync()
    }}>
      {/* first view */}
      <View style={{ height: 550, justifyContent: 'space-between', alignItems: 'center' }}>

        <TouchableOpacity onPress={async () => {
          await AsyncStorage.setItem("station_type", "wholesaler")
          //props.navigation.replace('MainTab')

          await props.navigation.navigate("Registration")

        }}>

          <Animated.View
            style={{
              width: 150,
              height: 150,
              borderRadius: 50,
              backgroundColor: wholesaler_color_scheme.secondary,
              justifyContent: "center",
              alignItems: "center",
              transform: [{ scale: animatedValue1 }],
            }}
          >
            <Text style={{ color: wholesaler_color_scheme.accent }}>Wholesaler</Text>
          </Animated.View>
        </TouchableOpacity>
        {/* second view */}
        <TouchableOpacity onPress={async () => {
          await AsyncStorage.setItem("station_type", "retailer")
          //props.navigation.replace('MainTab')

          //await props.navigation.navigate("StationCreation")
          props.navigation.navigate("Registration")
        }}>

          <Animated.View
            style={{
              width: 150,
              height: 150,
              borderRadius: 50,
              backgroundColor: retailer_color_scheme.secondary,
              justifyContent: "center",
              alignItems: "center",
              transform: [{ scale: animatedValue2 }],
            }}
          >
            <Text style={{ color: retailer_color_scheme.accent }}>Retailer</Text>
          </Animated.View>
        </TouchableOpacity>
        {/* third view */}
        <TouchableOpacity onPress={async () => {
          await AsyncStorage.setItem("station_type", "dispatch")
          //props.navigation.replace('MainTab')
          //await props.navigation.navigate("StationCreation")
          props.navigation.navigate("Registration")
        }}>

          <Animated.View
            style={{
              width: 150,
              height: 150,
              borderRadius: 50,
              backgroundColor: dispatch_color_scheme.secondary,
              justifyContent: "center",
              alignItems: "center",
              transform: [{ scale: animatedValue3 }],
            }}
          >
            <Text style={{ color: dispatch_color_scheme.accent, fontFamily: "reg" }}>Dispatch</Text>
          </Animated.View>
        </TouchableOpacity>

      </View>

    </View>
  );
}