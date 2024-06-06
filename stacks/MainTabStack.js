import * as React from 'react';
import { Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/Wholesaler/IncomingOrders';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome5, MaterialIcons, Foundation, Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { color_scheme } from '../colorscheme';
import { OfficeStack } from './WholesalerStack/OfficeStack';
import IncomingDeliveriesScreen from '../screens/Dispatch/IncomingDeliveries';
import { DispatchOfficeStack } from './DispatchStack/OfficeStack';
import { RetailerOfficeStack } from './RetailerStack/OfficeStack';
import { RetailerHomeStack } from './RetailerStack/HomeStack';
import { useState } from 'react';
import CartScreen from '../screens/Retailer/Cart';
import RetailerPendingOrdersScreen from '../screens/Retailer/PendingOrders';



console.log("Whatup")
function SettingsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>byuth</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();

export default function TabNavigator(props) {
  const [station_type, setStation_type] = useState(props.route.params.station_type)

  React.useEffect(() => {
    console.log(props.route)
  }, [])
  if (station_type == "wholesaler") {
    return (
      //Wholesaler Tab navigator
      <Tab.Navigator

        screenOptions={{
          tabBarActiveTintColor: color_scheme.primary,
          tabBarInactiveTintColor: color_scheme.lightpurple,
          tabBarLabelStyle: { fontFamily: 'reg', backgroundColor: "red" },
          tabBarIconStyle: {
            width: 60,
            height: 60,
            borderRadius: 30,
            justifyContent: "center",
            alignItems: "center",

          }
        }}>
        <Tab.Screen name="Home" component={HomeScreen}
          options={{
            headerShown: false,
            tabBarLabel: 'Home',
            tabBarShowLabel: false,
            tabBarIcon: ({ color, size }) => (
              <Feather name="home" color={color} size={size} />
            ),
          }}
        />

        <Tab.Screen name="Office" component={OfficeStack}
          options={{
            headerShown: false,
            tabBarLabel: 'Home',
            tabBarShowLabel: false,
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="office-building-cog" color={color} size={size} />

            ),
          }}
        />

      </Tab.Navigator>
    );
  } else if (station_type == "retailer") {

    return (
      //Wholesaler Tab navigator
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: color_scheme.primary,
          tabBarInactiveTintColor: color_scheme.lightpurple,
          tabBarLabelStyle: { fontFamily: 'reg', backgroundColor: "red" },
          tabBarIconStyle: {
            width: 60,
            height: 60,
            borderRadius: 30,
            justifyContent: "center",
            alignItems: "center",

          }
        }}>


        <Tab.Screen name="Home" component={RetailerHomeStack}
          options={{
            headerShown: false,
            tabBarLabel: 'Home',
            tabBarShowLabel: false,
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="home" color={color} size={size} />

            ),
          }}
        />
        <Tab.Screen name="Cart" component={CartScreen}
          options={{
            headerShown: false,
            tabBarLabel: 'Home',
            tabBarShowLabel: false,
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="cart" color={color} size={size} />

            ),
          }}
        />
        <Tab.Screen name="PendingOrders" component={RetailerPendingOrdersScreen}
          options={{
            headerShown: false,
            tabBarLabel: 'Home',
            tabBarShowLabel: false,
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="truck-fast" color={color} size={size} />

            ),
          }}
        />
        <Tab.Screen name="Office" component={RetailerOfficeStack}
          options={{
            headerShown: false,
            tabBarLabel: 'Home',
            tabBarShowLabel: false,
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="office-building-cog" color={color} size={size} />

            ),
          }}
        />


      </Tab.Navigator>
    );
  } else {
    return (
      //Wholesaler Tab navigator
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: color_scheme.primary,
          tabBarInactiveTintColor: color_scheme.lightpurple,
          tabBarLabelStyle: { fontFamily: 'reg', backgroundColor: "red" },
          tabBarIconStyle: {
            width: 60,
            height: 60,
            borderRadius: 30,
            justifyContent: "center",
            alignItems: "center",

          }
        }}>

        <Tab.Screen name="Home" component={IncomingDeliveriesScreen}
          options={{
            headerShown: false,
            tabBarLabel: 'Home',
            tabBarShowLabel: false,
            tabBarIcon: ({ color, size }) => (
              <Feather name="home" color={color} size={size} />
            ),
          }}
        />

        <Tab.Screen name="Office" component={DispatchOfficeStack}
          options={{
            headerShown: false,
            tabBarLabel: 'Home',
            tabBarShowLabel: false,
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="office-building-cog" color={color} size={size} />

            ),
          }}
        />
      </Tab.Navigator>
    );

  }



}