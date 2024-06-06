//this is where the user creates the station
import React, { useEffect, useRef, useState } from "react";
import { View, Text, Animated, TouchableOpacity, TextInput, StatusBar, Image, FlatList, ActivityIndicator, Modal, Pressable } from "react-native";
import generateColorScheme, { color_scheme, } from "../../colorscheme";
import Message, { addMessage } from "../../components/messagetoast";
import * as SplashScreen from 'expo-splash-screen'
import _loadMyFonts from "../../fontloader";
import { Feather, MaterialIcons, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import Endpoints from "../../backend";

let counter = 0
let backend = new Endpoints()



const CategoriesList = [
    { label: 'All', value: 'All' },
    { label: 'Medical Supplies', value: 'Medical Supplies' },
    { label: 'Edibles', value: 'Edibles' },
    { label: 'Phone Accessories', value: 'Phone Accessories' },
    { label: 'Phone Parts', value: 'Phone Parts' },
];




// define a component to render the screen
export default function CartScreen({ navigation }) {

    const [messages, setmessages] = useState([])
    const [items, setItems] = useState([])
    const [showIndicator, setShowIndicator] = useState(false)
    const [showModalIndicator, setShowModalIndicator] = useState(false)
    const [currentCategory, setCurrentCategory] = useState("All")
    const [modalVisible, setModalVisible] = useState(false)
    const [totalPrice, setTotalPrice] = useState(0)
    const [address, setDeliveryAddress] = useState("")





    useEffect(() => {
        async function setScreen() {
            await backend.Retailer_Cart(setItems, addMessage, setmessages, setShowIndicator, setTotalPrice)
        }
        setScreen()
    }, [currentCategory])


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
                            <TextInput
                                placeholder="delivery address..."
                                style={styles.input}
                                onChangeText={(txt) => {
                                    setDeliveryAddress(txt)
                                }}
                                onSubmitEditing={() => {
                                    //  console.log("submitting")
                                    //navigation.navigate("RetailerSearch", {
                                    //  query: searchQuery
                                    //})
                                }}
                            />
                        </View>




                        <Pressable style={[styles.modalCloseBtn, { backgroundColor: color_scheme.lightpurple }]}
                            onPress={async () => {
                                if (address.length > 4) {
                                    await backend.Retailer_Checkout({ address }, addMessage, setmessages, setShowModalIndicator)
                                    setModalVisible(false)
                                    await backend.Retailer_Cart(setItems, addMessage, setmessages, setShowIndicator, setTotalPrice)


                                }



                            }}
                        >
                            {showModalIndicator ?
                                <ActivityIndicator size={32} color={"#fff"} />
                                :
                                <Feather name="send" color={color_scheme.primary} size={24} />


                            }
                        </Pressable>
                    </View>
                </View>
            </Modal>

            <Animated.View style={{ justifyContent: 'center', alignItems: "center", marginTop: 10 }}>
                <Text style={styles.heading}>Cart</Text>
            </Animated.View>


            <FlatList
                data={items}
                contentContainerStyle={{ alignItems: "center", marginTop: 10, flex: items.length == 0 ? 1 : null }}
                showsVerticalScrollIndicator={false}
                refreshing={showIndicator}
                onRefresh={async () => {
                    await backend.Retailer_Cart(setItems, addMessage, setmessages, setShowIndicator, setTotalPrice)

                }}

                renderItem={({ item, index }) => {
                    return (
                        <View style={[styles.listStyle]}>

                            <Image
                                source={{ uri: item.item.image }}
                                style={{ height: 170, width: 160, borderRadius: 15, flex: 1 }}
                            />

                            <View style={{ flex: 2, marginLeft: 10 }}>
                                <Text style={{ fontFamily: "bold", color: color_scheme.primary, fontSize: 16, }}>
                                    {item.item.title}
                                </Text>

                                <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 20 }}>
                                    <TouchableOpacity onPress={async () => {
                                        await backend.decreaseFromCart({ quantity: item.quantity }, item.item._id, addMessage, setmessages, setShowIndicator)

                                        await backend.Retailer_Cart(setItems, addMessage, setmessages, setShowIndicator, setTotalPrice)

                                    }} style={styles.quantityBtn}>
                                        <Text>-</Text>
                                    </TouchableOpacity>
                                    <Text style={{ fontFamily: "reg", fontSize: 15, marginHorizontal: 10 }}>{item.quantity}</Text>

                                    <TouchableOpacity onPress={async () => {
                                        await backend.addToCart({ quantity: item.quantity }, item.item._id, addMessage, setmessages, setShowIndicator)
                                        await backend.Retailer_Cart(setItems, addMessage, setmessages, setShowIndicator, setTotalPrice)

                                    }} style={styles.quantityBtn}>
                                        <Text>+</Text>

                                    </TouchableOpacity>
                                </View>
                                <View style={{ position: "absolute", bottom: 0, right: 5 }}>
                                    <Text style={{ fontFamily: "reg", fontSize: 17, marginHorizontal: 10, color: color_scheme.primary }}>₦{item.total_price}</Text>


                                </View>
                            </View>




                        </View>
                    )
                }}

            />
            <View style={{ position: "absolute", bottom: 0, width: "100%", paddingHorizontal: 16 }}>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>

                    <Text style={{ fontFamily: "bold", color: color_scheme.primary, fontSize: 20, }}>
                        Total price
                    </Text><Text style={{ fontFamily: "bold", color: color_scheme.primary, fontSize: 20, }}>
                        {totalPrice}
                    </Text>
                </View>

                <View style={{ alignItems: "center", justifyContent: "center" }}>
                    <TouchableOpacity onPress={() => { setModalVisible(true) }} style={{ backgroundColor: color_scheme.primary, width: 150, height: 50, alignItems: "center", justifyContent: "center", borderRadius: 10 }}>
                        <Text style={{ fontFamily: "reg", fontSize: 17, marginHorizontal: 10, color: "#fff" }}>Checkout</Text>

                    </TouchableOpacity>
                </View>

            </View>
        </View >
    );
}



const styles = {
    body: {
        flex: 1,
        backgroundColor: "#fff",
        paddingTop: StatusBar.currentHeight + 5,
    },
    heading: {
        fontFamily: "bold",
        color: color_scheme.accent,
        fontSize: 26,

    },
    subHeading: {
        fontFamily: "reg",
        fontFamily: 20,
        color: color_scheme.accent
    },
    loginBtn: {
        backgroundColor: color_scheme.accent,
        width: 60,
        height: 25
    }, ViewBtn: {
        backgroundColor: color_scheme.lightpurple,
        justifyContent: "center",
        alignItems: "center",
        height: 30,
        borderRadius: 6,
        paddingHorizontal: 5
    },
    input: {
        color: "red",
        width: "85%",
        fontFamily: "reg",
        height: 50,
        backgroundColor: color_scheme.lightpurple,
        borderRadius: 20,
        padding: 10,
        marginTop: 15,
        color: color_scheme.accent
    },
    uploadBtn: {
        position: "absolute",
        backgroundColor: color_scheme.lightpurple,
        width: 50, height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        bottom: 5

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
        width: "70%",
        height: "30%"
    },
    orderCountTxt: {
        fontFamily: "reg",
        color: color_scheme.primary,
        fontSize: 20,

    },
    loginTxt: {
        fontFamily: "reg",
        color: color_scheme.secondary
    },
    NextBtn: {
        backgroundColor: color_scheme.lightpurple,
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: color_scheme.primary
    },
    listStyle: {
        flexDirection: "row",
        borderColor: color_scheme.lightpurple,
        margin: 5,
        width: "82%",
        borderWidth: 1,
        padding: 5,
        borderRadius: 10
    },
    categoryStyle: {
        backgroundColor: color_scheme.lightpurple,
        borderColor: color_scheme.lightpurple,
        height: 35,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 9,
        borderRadius: 10
    },
    quantityBtn: {
        width: 40,
        height: 40,
        backgroundColor: color_scheme.lightpurple,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 20
    },
    modalCloseBtn: {
        padding: 10,
        backgroundColor: color_scheme.primary,
        borderRadius: 25,
        position: "absolute",
        bottom: -22
    },
    viewWholesalerBtn: {
        padding: 10,
        backgroundColor: color_scheme.primary,
        borderRadius: 25,
        position: "absolute",
        top: 4,
        right: 5
    }

}