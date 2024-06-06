//this is where the user creates the station
import React, { useEffect, useRef, useState } from "react";
import { View, Text, Animated, TouchableOpacity, TextInput, StatusBar, Button, Image, TouchableWithoutFeedback, ActivityIndicator } from "react-native";
import generateColorScheme, { color_scheme, dispatch_color_scheme, retailer_color_scheme, wholesaler_color_scheme } from "../../colorscheme";
import Message, { addMessage } from "../../components/messagetoast";
import * as SplashScreen from 'expo-splash-screen'
import _loadMyFonts from "../../fontloader";
import * as ImagePicker from 'expo-image-picker';
import * as Animatable from 'react-native-animatable'
import { Feather, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import { Picker } from '@react-native-picker/picker';
import Endpoints from "../../backend";
import AsyncStorage from "@react-native-async-storage/async-storage";

let counter = 0

let backend = new Endpoints()
const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dtbezcndz/upload";
const UPLOAD_PRESET = 'ml_default';

const locations = [
    { label: 'Medical Supplies', value: 'Medical Supplies' },
    { label: 'Edibles', value: 'Edibles' },
    { label: 'Phone Accessories', value: 'Phone Accessories' },
    { label: 'Phone Parts', value: 'Phone Parts' },
    { label: 'Magodo', value: 'Mgd' },
];

const batch = [
    { label: 'carton', value: 'carton' },
    { label: 'dozen', value: 'dozen' },
    { label: 'half dozen', value: 'half dozen', },
    { label: 'crate', value: 'crate' },
];


// define a component to render the screen
export default function UpdateItemScreen({ route, navigation }) {
    const curveRadius = useRef(new Animated.Value(0)).current
    const [image, setImage] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState('');
    const [selectedBatch, setSelectedBatch] = useState('');
    const [item, setItem] = useState({})
    const [ItemTitle, setItemTitle] = useState("")
    const [price, setprice] = useState(0)
    const [messages, setmessages] = useState([])
    const [showIndicator, setShowIndicator] = useState(false)

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
        (async () => {
            const imageStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (imageStatus.status !== 'granted') {
                alert('Sorry, we need camera roll permissions to make this work!');
            }
        })();
    }, []);

    const pickImage = async () => {
        console.log("opening image")

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.cancelled) {
            setImage(result.uri);
        }
    };

    useEffect(() => {
        async function setScreen() {
            //await backend.update_or_view_Item(setItem, route.params.itemId, "Get", addMessage, setmessages, setShowIndicator)

        }
        setScreen()
        AnimateCurveRadius()
        setItemTitle(route.params.item.title)
        setprice(route.params.item.price)

        setSelectedBatch(route.params.item.batch)
        setSelectedLocation(route.params.item.category)


    }, [])

    const uploadImage = async () => {
        setShowIndicator(true)

        let base64Img = `data:image/jpg;base64,${await FileSystem.readAsStringAsync(
            image,
            {
                encoding: FileSystem.EncodingType.Base64,
            }
        )}`;

        let data = {
            file: base64Img,
            upload_preset: UPLOAD_PRESET,
        };
        console.log("sending img")
        fetch(CLOUDINARY_URL, {
            body: JSON.stringify(data),
            headers: {
                'content-type': 'application/json',
            },
            method: 'POST',
        })
            .then(async (res) => {
                let data = await res.json();
                console.log(data)

                await backend.update_or_view_Item({ title: ItemTitle, category: selectedLocation, image: data.secure_url, price: price, batch: selectedBatch },
                    route.params.item._id,addMessage,setmessages,setShowIndicator
                    )

                setShowIndicator(false)
            })
            .catch((err) => {

                console.log(err);
                addMessage("Check internet connection", setmessages)
                setShowIndicator(false)

                console.log(err);
            });
    };


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
            <View style={{ justifyContent: 'center', alignItems: "center", paddingVertical: 50 }}>
                <Text style={styles.heading}>Update {ItemTitle}.</Text>

            </View>


            <Animatable.View
                animation="slideInUp"
                iterationCount={1}
                duration={1000}>

                <Animated.View
                    style={{
                        width: 350,
                        height: 420,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: color_scheme.accent,
                        borderWidth: 1,
                        borderRadius: curveRadius,
                        borderColor: color_scheme.accent,
                        elevation: 3
                    }}

                >
                    <Animatable.View
                        animation="slideInDown"
                        iterationCount={1}
                        duration={1500}
                        delay={900}>
                        <TextInput
                            style={styles.input}
                            placeholder={"New title"}
                            onChangeText={(v) => { setItemTitle(v) }}

                        />

                    </Animatable.View>

                    <Animatable.View
                        animation="slideInDown"
                        iterationCount={1}
                        duration={1700}
                        delay={1100}
                    >
                        <TextInput
                            style={styles.input}
                            placeholder={"New Price"}
                            onChangeText={(v) => { setprice(v) }}
                            keyboardType="numeric"

                        />


                    </Animatable.View>

                    <View style={{ backgroundColor: "#e5ddea", borderRadius: 22, marginTop: 8 }}>

                        <Picker
                            onMagicTap={() => {
                                console.log("ee")
                            }}

                            selectedValue={selectedLocation}
                            style={{ height: 50, width: 200, fontFamily: "reg" }}
                            onValueChange={(lc) => { setSelectedLocation(lc) }}
                        >
                            {locations.map((location) => (
                                <Picker.Item
                                    key={location.value}
                                    label={location.label}
                                    value={location.value}
                                />
                            ))}
                        </Picker>
                    </View>

                    <View style={{ backgroundColor: "#e5ddea", borderRadius: 22, marginTop: 8 }}>

                        <Picker
                            onMagicTap={() => {
                                console.log("ee")
                            }}

                            selectedValue={selectedBatch}
                            style={{ height: 50, width: 200, fontFamily: "reg" }}
                            onValueChange={(lc) => { setSelectedBatch(lc) }}
                        >
                            {batch.map((batch) => (
                                <Picker.Item
                                    key={batch.value}
                                    label={batch.label}
                                    value={batch.value}
                                />
                            ))}
                        </Picker>
                    </View>


                    <View style={{ flexDirection: "row", position: "absolute", justifyContent: "center", alignItems: "center", bottom: 8 }}>

                        <Image source={{ uri: route.params.item.image }} style={{ width: 60, height: 40, borderRadius: 20, marginRight: 10 }} />


                        {!image ? <TouchableOpacity style={styles.uploadBtn} onPress={pickImage} >
                            <MaterialCommunityIcons name="file-upload-outline" size={24} color={color_scheme.primary} />
                        </TouchableOpacity> : null}
                        {image && (
                            <>
                                <Animatable.View style={{
                                }}
                                    animation={"pulse"}
                                    iterationCount={"infinite"}
                                    duration={1000}
                                >
                                    <TouchableOpacity onPress={pickImage} >
                                        <Image source={{ uri: image }} style={{ width: 60, height: 60, borderRadius: 20, marginTop: 15 }} />

                                    </TouchableOpacity>

                                </Animatable.View>

                            </>
                        )}
                    </View>

                </Animated.View>

            </Animatable.View>

            <Animatable.View style={{
                position: "absolute",
                bottom: 10
            }}
                animation={"pulse"}
                iterationCount={"infinite"}
                duration={1000}
            >

                {
                    showIndicator ?
                        <ActivityIndicator color={color_scheme.primary} size={35} />
                        :
                        <TouchableOpacity style={styles.NextBtn} onPress={async () => {
                            uploadImage()
                        }}>
                            <MaterialIcons name="navigate-next" size={35} color={color_scheme.primary} />
                        </TouchableOpacity>
                }


            </Animatable.View>

            <Text style={{ fontFamily: "reg", color: color_scheme.grey, fontSize: 14, marginTop: 7 }}>Update the old image </Text>


        </View >
    );
}



const styles = {
    body: {
        flex: 1,
        backgroundColor: color_scheme.secondary,
        paddingTop: StatusBar.currentHeight + 40,
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
    },
    input: {
        color: "red",
        width: 260,
        fontFamily: "reg",
        height: 55,
        backgroundColor: color_scheme.secondary,
        borderRadius: 22,
        padding: 10,
        margin: 8,
        color: color_scheme.accent
    },
    uploadBtn: {
        backgroundColor: color_scheme.lightpurple,
        width: 55, height: 55,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',


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
    }
}