//this is where the wholesaler creates an item
import React, { useEffect, useRef, useState } from "react";
import { View, Text, Animated, TouchableOpacity, TextInput, StatusBar, FlatList } from "react-native";
import generateColorScheme, { color_scheme, dispatch_color_scheme, retailer_color_scheme, wholesaler_color_scheme } from "../../colorscheme";
import Message, { addMessage } from "../../components/messagetoast";
import * as SplashScreen from 'expo-splash-screen'
import _loadMyFonts from "../../fontloader";
import * as Animatable from 'react-native-animatable'
//import { AnimatedCircularProgress } from 'expo-progress'
import { MaterialIcons, Feather, Ionicons } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Endpoints from "../../backend";

let backend = new Endpoints()



// define a component to render the screen
export default function ItemListScreen(props) {
    const curveRadius = useRef(new Animated.Value(0)).current
    const [progress, setProgress] = useState(0)
    const [items, setItems] = useState([])
    const [message, setMessages] = useState([])
    const [showIndicator, setShowIndicator] = useState(false)

    function AnimateCurveRadius() {
        // reset the value if it's already reached the target
        // start the animation
        Animated.sequence([

            Animated.delay(900),
            Animated.loop(
            Animated.spring(curveRadius, {

                toValue: 70, // final value
                friction: 3,
                // lower means more bouncy
                useNativeDriver: false, // required for borderRadius animation

            }))]).start();

    }
    useEffect(() => {
        AnimateCurveRadius()
        async function setScreen() {
            await backend.all_Item(setItems, addMessage, setMessages, setShowIndicator)

        }
        setScreen()
    }, [])
    return (
        <View style={styles.body} onLayout={async () => { await SplashScreen.hideAsync() }}>
            <Animated.View style={{ justifyContent: 'center', alignItems: "center", marginVertical: 5 }}>
                <Text style={styles.heading}>Items</Text>
            </Animated.View>
            <View style={{ justifyContent: "center", alignItems: "center", marginVertical: 20 }}>


                <Animated.View style={{ width: 200, height: 200, alignItems: "center", borderRadius: curveRadius, justifyContent: "center", borderWidth: 1, borderColor: color_scheme.lightpurple }}>
                    <Text style={styles.orderCountTxt}>{items.length}</Text>
                </Animated.View>
            </View>

            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text style={[styles.heading, { fontSize: 24 }]}>
                    Items in storage
                </Text>
                <TouchableOpacity style={styles.addItemBtn} onPress={() => {
                    props.navigation.push("CreateItem")
                }}>
                    <Ionicons name="add-circle" size={20} color={color_scheme.primary} />

                </TouchableOpacity>


            </View>
            <FlatList
                data={items}
                contentContainerStyle={{ marginTop: 14, flex: 1, width: "100%" }}
                showsVerticalScrollIndicator={false}
                refreshing={showIndicator}
                onRefresh={async () => {
                    await backend.all_Item(setItems, addMessage, setMessages, setShowIndicator)

                }}
                renderItem={({ item }) => {

                    return (
                        <View style={styles.listStyle}>
                            <View style={{ flexDirection: "row" }}>
                                <View style={{ width: 16, height: 16, marginRight: 15, backgroundColor: color_scheme.lightpurple, borderRadius: 10 }} />
                                <Text style={[styles.orderCountTxt, { fontSize: 16 }]}>{item.title}</Text>
                            </View>
                            <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                                <TouchableOpacity style={[styles.ViewBtn, { marginRight: 15, backgroundColor: "#fff" }]}
                                    onPress={()=>{
                                        props.navigation.navigate("UpdateItem",{
                                            item:item
                                        })
                                    }}
                                >
                                    <Feather name="edit" size={20} color={color_scheme.primary} />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.ViewBtn}>
                                    <MaterialIcons name="delete-outline" size={20} color={color_scheme.primary} />
                                </TouchableOpacity>
                            </View>


                        </View>
                    )
                }}

            />
        </View >
    );
}



const styles = {
    body: {
        flex: 1,

        paddingTop: StatusBar.currentHeight,
        backgroundColor: '#fff',
        paddingHorizontal: 16
    },
    heading: {
        fontFamily: "bold",
        color: color_scheme.primary,
        fontSize: 30,

    },
    listStyle: {
        flexDirection: "row",
        justifyContent: "space-between",
        height: 50,
        borderBottomWidth: 1,
        borderColor: color_scheme.lightpurple,
        marginTop: 10,
        alignItems: "center"

    },

    orderCountTxt: {
        fontFamily: "reg",
        color: color_scheme.primary,
        fontSize: 50,

    },

    subHeading: {
        fontFamily: "reg",
        fontFamily: 20,
        color: color_scheme.primary
    },
    ViewBtn: {
        backgroundColor: color_scheme.lightpurple,
        justifyContent: "center",
        alignItems: "center",
        height: 30,
        borderRadius: 6,
        paddingHorizontal: 5
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
    loginTxt: {
        fontFamily: "reg",
        color: color_scheme.secondary
    },
    addItemBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: color_scheme.lightpurple,
        justifyContent: "center",
        alignItems: "center"
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