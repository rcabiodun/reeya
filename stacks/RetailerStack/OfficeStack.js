//this is for dispacthers
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import RetailerOfficeScreen from '../../screens/Retailer/Office';
import WorkersListScreen from '../../screens/WorkerList';

const Stack = createNativeStackNavigator();

export function RetailerOfficeStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen options={{ headerShown: false }} name='OfficeHome' component={RetailerOfficeScreen} />
            <Stack.Screen options={{ headerShown: false }} name='WorkersList' component={WorkersListScreen} />

        </Stack.Navigator>
    )

}