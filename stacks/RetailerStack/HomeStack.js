//this is for dispacthers
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import CartScreen from '../../screens/Retailer/Cart';
import RetailerHomeScreen from '../../screens/Retailer/Home';
import ItembyWholeSalerScreen from '../../screens/Retailer/ItembyWholesaler';
import RetailerSearchScreen from '../../screens/Retailer/Search';
import SearchWholesalerScreen from '../../screens/Retailer/Search';
import Payment from '../../screens/Retailer/Payment';

const Stack = createNativeStackNavigator();

export function RetailerHomeStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen options={{ headerShown: false }} name='RetailerHome' component={RetailerHomeScreen} />
            <Stack.Screen options={{ headerShown: false }} name='ItemByWholesaler' component={ItembyWholeSalerScreen} />
            <Stack.Screen options={{ headerShown: false }} name='RetailerSearch' component={RetailerSearchScreen} />
            <Stack.Screen options={{ headerShown: false }} name='Payment' component={Payment} />

        </Stack.Navigator>
    )

}