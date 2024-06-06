import * as React from 'react';
import { WebView } from 'react-native-webview';
import { View, Text, Animated, TouchableOpacity, TextInput, StatusBar, Image, FlatList, ActivityIndicator, Modal, Pressable, StyleSheet } from "react-native";
import { Feather, MaterialIcons, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { color_scheme } from '../../colorscheme';

import Constants from 'expo-constants';

export default function Payment(props) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={()=>{props.navigation.goBack()}} style={{padding:5}}>
        <Ionicons name="ios-close-outline" size={25} color={color_scheme.primary} />

      </TouchableOpacity>
      <WebView
        style={{ flex: 1 }}
        source={{ uri: props.route.params.url }}
      />
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight + 5,
    paddingHorizontal:10
  },
});
