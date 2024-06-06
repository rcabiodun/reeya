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
let imgHeight = 0
let backend = new Endpoints()



const CategoriesList = [
    { label: 'All', value: 'All' },
    { label: 'Medical Supplies', value: 'Medical Supplies' },
    { label: 'Edibles', value: 'Edibles' },
    { label: 'Phone Accessories', value: 'Phone Accessories' },
    { label: 'Phone Parts', value: 'Phone Parts' },
];




// define a component to render the screen
export default function ItembyWholeSalerScreen({ route, navigation }) {

    const [messages, setmessages] = useState([])
    const [items, setItems] = useState([])
    const [showIndicator, setShowIndicator] = useState(false)
    const [showModalIndicator, setShowModalIndicator] = useState(false)
    const [currentCategory, setCurrentCategory] = useState("All")
    const [modalVisible, setModalVisible] = useState(false)
    const [quantity, setQuantity] = useState(1)
    const [currentItem, setCurrentItem] = useState({})
    const [searchQuery, setSearchQuery] = useState("")
    const [searchResults, setSearchResults] = useState([])



    useEffect(() => {
        async function setScreen() {
            await backend.Retailer_Item_by_wholesaler(setItems, route.params.wholesaler._id, addMessage, setmessages, setShowIndicator)

        }
        setScreen()
    }, [currentCategory])


    useEffect(() => {
        let results=items.filter((v,i)=>{
            if (v.title.toLowerCase().includes(searchQuery.toLowerCase())){
                return v
            }
        })
        setSearchResults(results)

    }, [searchQuery])

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
                            <TouchableOpacity onPress={() => { setQuantity(prev => prev - 1) }} style={styles.quantityBtn}>
                                <Text>-</Text>
                            </TouchableOpacity>
                            <Text style={{ fontFamily: "reg", fontSize: 15, marginHorizontal: 10 }}>{quantity}</Text>

                            <TouchableOpacity onPress={() => { setQuantity(prev => prev + 1) }} style={styles.quantityBtn}>
                                <Text>+</Text>

                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity
                            onPress={async () => {
                                await backend.addToCart({ quantity }, currentItem._id, addMessage, setmessages, setShowModalIndicator)
                                //setShowModalIndicator(true)

                            }}
                        >
                            <Text style={{ fontFamily: "reg", fontSize: 15, marginTop: 10, color: color_scheme.primary }}>add to cart</Text>

                        </TouchableOpacity>



                        <Pressable style={styles.modalCloseBtn}
                            onPress={() => { setModalVisible(false) }}
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

            <Animated.View style={{ justifyContent: 'center', alignItems: "center", marginTop: 10 }}>
                <Text style={styles.heading}>{route.params.wholesaler.title}</Text>
            </Animated.View>

            <TextInput
                placeholder="search"
                style={styles.input}
                onChangeText={(txt) => {
                    setSearchQuery(txt)
                }}

                onSubmitEditing={() => {
                    console.log("submitting")
                }}
            />



            <FlatList
                data={searchQuery.length>0?searchResults:items}
                contentContainerStyle={{ width: "100%" }}
                showsVerticalScrollIndicator={false}
                refreshing={showIndicator}
                onRefresh={async () => {
                    await backend.Retailer_homepage_Item(setItems, { category: currentCategory }, addMessage, setmessages, setShowIndicator)
                }}
                numColumns={2}

                renderItem={({ item, index }) => {
                    {
                        (index % 2 == 0) ? imgHeight = 180 : imgHeight = 220
                    }
                    return (
                        <View style={[styles.listStyle]}>
                            <TouchableOpacity onPress={() => {
                                setCurrentItem(item)
                                setModalVisible(true)



                            }}>

                                <Image
                                    source={{ uri: item.image }}
                                    style={{ height: imgHeight, width: 170, borderRadius: 15 }}
                                />
                            </TouchableOpacity>

                            <Text style={{ fontFamily: "reg", color: color_scheme.primary, fontSize: 17, }}>
                                {item.title}
                            </Text>
                            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                <Text style={{ fontFamily: "reg", color: color_scheme.primary, fontSize: 14, }}>
                                    ₦ {item.price}
                                </Text>
                                <View style={{ justifyContent: "center", alignItems: "center", backgroundColor: color_scheme.lightpurple, borderRadius: 6, width: 50 }}>
                                    <Text style={{ fontFamily: "reg", color: color_scheme.primary, fontSize: 12, textAlign: "center" }} >
                                        {item.batch}
                                    </Text>
                                </View>
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
        backgroundColor: "#fff",
        paddingTop: StatusBar.currentHeight + 5,
        alignItems: "center"
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
        width: 343,
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
        width: "50%",
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

        borderColor: color_scheme.lightpurple,
        margin: 5,
        width: 170
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