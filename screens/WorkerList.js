//this is where the wholesaler creates an item
import React, { useEffect, useRef, useState } from "react";
import { View, Text, Animated, TouchableOpacity, TextInput, StatusBar, FlatList, ActivityIndicator } from "react-native";
import generateColorScheme, { color_scheme, dispatch_color_scheme, retailer_color_scheme, wholesaler_color_scheme } from "../colorscheme";
import Message, { addMessage } from "../components/messagetoast";
import * as SplashScreen from 'expo-splash-screen'
import _loadMyFonts from "../fontloader";
import * as Animatable from 'react-native-animatable'
//import { AnimatedCircularProgress } from 'expo-progress'
import { MaterialIcons, Feather, Ionicons, Octicons, AntDesign } from '@expo/vector-icons';
import Endpoints from "../backend";


let backend = new Endpoints()
const items = [
    { id: 1, label: 'John Abiodun', value: 'Ikj' },

];

let counter = 0


// define a component to render the screen
export default function WorkersListScreen(props) {
    const positioning = useRef(new Animated.Value(-10)).current
    const [searchPlaceholder, setSearchPlaceHolder] = useState("")
    const [showIndicator, setShowIndicator] = useState(false)
    const [selectedWorker, setSelectedWorker] = useState("")
    const [messages, setmessages] = useState([])
    const opacity = useRef(new Animated.Value(-10)).current
    const searchBarWidth = useRef(new Animated.Value(0)).current
    const inputRange = [0, 1]
    const outputRange = [170, 350]
    const [workers, setWorkers] = useState([])
    const [item,setItem]=useState({})
    //paste the id of the person you want to add
    const [searchQuery, setSearchQuery] = useState("")

    const curveRadius = useRef(new Animated.Value(0)).current
    const [progress, setProgress] = useState(0)

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
        async function prepareScreen() {
            await backend.view_workers(setWorkers, addMessage, setmessages, setShowIndicator)
        }
        AnimateCurveRadius()
        prepareScreen()
    }, [])

    useEffect(() => {
        if (searchQuery.length > 0) {
            Animated.sequence([
                Animated.delay(50),
                Animated.spring(opacity, { toValue: 1, useNativeDriver: false })
            ]).start()
        } else {
            Animated.sequence([
                Animated.delay(50),
                Animated.spring(opacity, { toValue: 0, useNativeDriver: false })
            ]).start()
        }
    }, [searchQuery])



    function AnimatesearchBar() {
        Animated.sequence([
            Animated.delay(10),
            Animated.spring(searchBarWidth, { toValue: 1, useNativeDriver: false, duration: 700 })
        ]).start()
        setSearchPlaceHolder("add...")

    }

    function deanimateSearchBar() {
        Animated.sequence([
            Animated.delay(50),
            Animated.spring(searchBarWidth, { toValue: 0, useNativeDriver: false, duration: 1000 })
        ]).start()
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
            <Animated.View style={{ justifyContent: 'center', alignItems: "center", marginVertical: 5 }}>
                <Text style={styles.heading}>Workers</Text>
            </Animated.View>
            <View style={{ justifyContent: "center", alignItems: "center", marginVertical: 20 }}>


                <Animated.View style={{ width: 200, height: 200, alignItems: "center", borderRadius: curveRadius, justifyContent: "center", borderWidth: 1, borderColor: color_scheme.lightpurple }}>
                    <Text style={styles.orderCountTxt}>{workers.length}</Text>
                </Animated.View>
            </View>

            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Animated.View style={{
                    width: searchBarWidth.interpolate({
                        inputRange,
                        outputRange
                    }),
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>

                    <TextInput
                        onFocus={() => { AnimatesearchBar() }}
                        onBlur={() => { deanimateSearchBar() }}
                        placeholderTextColor={color_scheme.primary}
                        style={styles.search}
                        placeholder={"add worker"}
                        onChangeText={(txt) => { setSearchQuery(txt) }}>

                    </TextInput>
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
                        opacity

                    }}>

                        <TouchableOpacity style={{ marginTop: 15, marginLeft: 20 }} onPress={async () => {
                            //navigation.push("Search", { query: searchQuery })
                            await backend.add_worker(setWorkers, { workers_ids: [searchQuery] }, addMessage, setmessages, setShowIndicator)
                            //schedulePushNotification().then(res => console.log(res))

                        }}>
                            <AntDesign name="addusergroup" size={35} color={color_scheme.pink} />
                        </TouchableOpacity>

                    </Animated.View>


                </Animated.View>
                <>
                </>


            </View>
            <FlatList
                data={workers}
                contentContainerStyle={{ marginTop: 14, }}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => {

                    return (
                        <View style={styles.listStyle}>
                            <View style={{ flexDirection: "row" }}>
                                <View style={{ width: 16, height: 16, marginRight: 15, backgroundColor: color_scheme.lightpurple, borderRadius: 10 }} />
                                <Text style={[styles.orderCountTxt, { fontSize: 16 }]}>{item.first_name + " " + item.last_name}</Text>
                            </View>
                            <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>

                                <TouchableOpacity style={styles.ViewBtn} onPress={async () => {
                                    //setSelectedWorker(item._id)
                                    console.info(item._id)
                                    await backend.remove_worker(setWorkers, { workers_ids: item._id }, addMessage, setmessages, setShowIndicator)


                                }}>
                                    <MaterialIcons name="delete-outline" size={24} color="black" />
                                </TouchableOpacity>
                            </View>

                        </View>
                    )
                }}

            />
            {showIndicator ?
                <ActivityIndicator
                    size={32}
                    color={color_scheme.primary}
                />
                : null}

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
        fontSize: 20,

    },
    viewWholesalerBtn: {
        padding: 10,
        backgroundColor: color_scheme.primary,
        borderRadius: 25,
        position: "absolute",
        top: 4,
        right: 5
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
    NextBtn: {
        backgroundColor: color_scheme.accent,
        width: 60,
        height: 60,

        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
        borderColor: color_scheme.accent,
        borderWidth: 2
    },
    search: {
        height: 40,
        flex: 1,
        paddingLeft: 9,
        fontFamily: 'reg',
        fontSize: 16,
        backgroundColor: color_scheme.grey,
        marginTop: 15,
        borderRadius: 11

    },
}