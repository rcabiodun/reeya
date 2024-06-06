//this is for dispacthers
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import DispatchOfficeScreen from '../../screens/Dispatch/Office';
import OfficeScreen from '../../screens/Wholesaler/Office';
import WorkersListScreen from '../../screens/WorkerList';

const Stack = createNativeStackNavigator();

export function DispatchOfficeStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen options={{ headerShown: false }} name='OfficeHome' component={DispatchOfficeScreen} />
            <Stack.Screen options={{ headerShown: false }} name='WorkersList' component={WorkersListScreen} />

        </Stack.Navigator>
    )

}