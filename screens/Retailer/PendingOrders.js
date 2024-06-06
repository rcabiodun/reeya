//this is where the wholesaler creates an item
import React, { useEffect, useRef, useState } from "react";
import { View, Text, Animated, TouchableOpacity, TextInput, StatusBar, FlatList, ActivityIndicator, Pressable, Modal, } from "react-native";
import generateColorScheme, { color_scheme, dispatch_color_scheme, retailer_color_scheme, wholesaler_color_scheme } from "../../colorscheme";
import Message, { addMessage } from "../../components/messagetoast";
import * as SplashScreen from 'expo-splash-screen'
import _loadMyFonts from "../../fontloader";
import * as Animatable from 'react-native-animatable'
//import { AnimatedCircularProgress } from 'expo-progress'
import Endpoints from "../../backend";
let counter = 0
import { Feather, MaterialIcons, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

let backend = new Endpoints()



// define a component to render the screen
export default function RetailerPendingOrdersScreen(props) {
    const curveRadius = useRef(new Animated.Value(0)).current
    const [progress, setProgress] = useState(0)

    const [showModalIndicator, setShowModalIndicator] = useState(false)
    const [currentItemId, setCurrentItemId] = useState("")
    const [modalVisible, setModalVisible] = useState(false)
    const [items, setItems] = useState([])
    const [messages, setmessages] = useState([])
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
        async function setScreen() {
            await backend.Retailer_pending_orders(setItems, addMessage, setmessages, setShowIndicator)

        }
        setScreen()
        AnimateCurveRadius()
    }, [])
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

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {

                    setModalVisible(!modalVisible);
                    setShowModalIndicator(false)
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>

                        <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>

                            <TouchableOpacity

                            >

                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={async () => {

                                   await backend.initiate_payment("ddd",currentItemId,addMessage,setmessages,setShowModalIndicator,props.navigation) 
                                 
                                   

                                }}
                            >
                                <Text style={{ fontFamily: "reg", fontSize: 17, color: color_scheme.primary, }}>Pay</Text>

                            </TouchableOpacity>
                        </View>
                        <Text style={{ fontFamily: "reg", fontSize: 11, color: color_scheme.primary,textAlign:"center",marginTop:15 }}>
                                ONLY PAY WHEN GOODS HAVE ARRIVED.By paying this item you also accept all other items made to the same wholesaler and  
                            </Text>




                        <Pressable style={styles.modalCloseBtn}
                            onPress={() => {
                                setModalVisible(false)

                            }}
                        >
                            {showModalIndicator ?
                                <ActivityIndicator size={32} color={"#fff"} />
                                :
                                <Ionicons name="ios-close-outline" size={24} color={"#fff"} />

                            }
                        </Pressable>
                    </View>
                </View>
            </Modal>
            <Animated.View style={{ justifyContent: 'center', alignItems: "center", marginVertical: 5 }}>
                <Text style={styles.heading}>Orders</Text>
            </Animated.View>
            <View style={{ justifyContent: "center", alignItems: "center", marginVertical: 20 }}>


                <Animated.View style={{ width: 200, height: 200, alignItems: "center", borderRadius: curveRadius, justifyContent: "center", borderWidth: 1, borderColor: color_scheme.lightpurple }}>
                    <Text style={styles.orderCountTxt}>{items.length}</Text>
                </Animated.View>
            </View>

            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={[styles.heading, { fontSize: 24 }]}>
                    Pending Orders
                </Text>
                <>
                </>


            </View>
            <FlatList
                data={items}
                contentContainerStyle={{ marginTop: 14, width: "100%" }}
                showsVerticalScrollIndicator={false}
                refreshing={showIndicator}
                onRefresh={async () => {
                    await backend.Retailer_pending_orders(setItems, addMessage, setmessages, setShowIndicator)


                }}
                renderItem={({ item }) => {

                    return (
                        <View style={styles.listStyle}>
                            <View style={{ flexDirection: "row" }}>
                                <View style={{ width: 16, height: 16, marginRight: 15, backgroundColor: color_scheme.lightpurple, borderRadius: 10 }} />
                                <Text style={[styles.orderCountTxt, { fontSize: 16 }]}>{item.item.title}</Text>
                            </View>
                            <TouchableOpacity style={styles.ViewBtn} onPress={()=>{
                                setCurrentItemId(item._id)
                                
                                item.status=="in transit" ?setModalVisible(true):null

                            }}>
                                <Text style={[styles.orderCountTxt, { fontSize: 16 }]}>
                                    {item.status}
                                </Text>
                            </TouchableOpacity>

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
        fontSize: 28,

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
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: "80%",
        height: "30%"
    },
    orderCountTxt: {
        fontFamily: "reg",
        color: color_scheme.primary,
        fontSize: 30,

    },
    modalCloseBtn: {
        padding: 10,
        backgroundColor: color_scheme.primary,
        borderRadius: 25,
        position: "absolute",
        bottom: -22
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
    }
}