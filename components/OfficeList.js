import React, { useCallback, useEffect, useState, useRef } from 'react';
import { StyleSheet, View, Text, SafeAreaView, StatusBar, TouchableOpacity, Animated, ScrollView, Image, RefreshControl, TextInput, FlatList, } from 'react-native';
import { FontAwesome5, MaterialIcons, Ionicons, Feather } from '@expo/vector-icons';
import Endpoints from '../backend';
import { color_scheme } from '../colorscheme';

export default function MoreInfoList(props) {
    const scale = useRef(new Animated.Value(0)).current
    const opacity = useRef(new Animated.Value(0)).current
    const curveRadius = useRef(new Animated.Value(0)).current

    function AnimateCurveRadius() {
        // reset the value if it's already reached the target
        // start the animation
        Animated.sequence([

            Animated.delay(290 * props.i),
            Animated.spring(curveRadius, {

                toValue: 40, // final value
                bounciness: 10,
                // lower means more bouncy
                // required for borderRadius animation
                useNativeDriver: true
            })]).start();

    }


    //pull to refresh function
    useEffect(() => {
        //console.log(props)
        Animated.sequence([
            Animated.delay(220 * props.i),
            Animated.sequence([

                Animated.spring(opacity, { toValue: 29, useNativeDriver: true, friction: 3 }),
                Animated.loop(
                    Animated.spring(curveRadius, {

                        toValue: 40, // final value
                        friction: 3,
                        // lower means more bouncy
                        // required for borderRadius animation
                        useNativeDriver: true
                    }),
                )

            ])
        ]).start()


    }, [])





    return (
        <Animated.View key={props.i} style={{

            transform: [{
                translateY: opacity.interpolate({
                    inputRange: [0, 30],
                    outputRange: [50, 0],
                }),

            }],

            transform: [{
                translateX: opacity.interpolate({
                    inputRange: [0, 30],
                    outputRange: [65, 0],
                }),

            }],
            borderRadius: curveRadius,
            backgroundColor: '#fff',
            borderWidth: 1,
            borderColor: color_scheme.lightpurple,
            opacity,
            width: 370,
            justifyContent: "center",
            marginBottom: 10,
        }}>


            <TouchableOpacity onPress={async () => {
                props.v.name == 'Logout' ?
                    await props.v.page() :
                    props.navigation.push(props.v.page)
            }} style={{ height: 90, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 15, }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
                    <View style={{ width: 53, height: 53, borderRadius: 30, backgroundColor: color_scheme.lightpurple, justifyContent: 'center', alignItems: 'center' }}>
                        <Feather name={props.v.icon} size={24} color={'#4A4B4D'} />

                    </View>
                    <Text style={[{ fontSize: 16, fontFamily: 'reg', marginLeft: 18, color: color_scheme.primary }]}>{props.v.name}</Text>
                </View>

                <Feather name='chevron-right' size={25} color={color_scheme.primary} />


            </TouchableOpacity>

        </Animated.View>

    )
}







const styles = StyleSheet.create({
    root: {
        flex: 1,

        paddingTop: StatusBar.currentHeight + 10,
        backgroundColor: "#fff"
    },
    banner: {
        width: 235,
        height: 111,
        borderRadius: 11,
        resizeMode: 'cover'
    },


})
