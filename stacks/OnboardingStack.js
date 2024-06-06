import { createNativeStackNavigator } from '@react-navigation/native-stack'
import LoginScreen from '../screens/Account/Login';
import Onboarding from '../screens/Account/Onboarding';
import RegistrationScreen from '../screens/Account/Registration';
import IncomingStationRequestScreen from '../screens/Admin/Stationlist';
import StationCreationScreen from '../screens/Station/Creation';
import WaitingRoom from '../screens/Station/Waitingroom';

const Stack = createNativeStackNavigator();

export default function OnboardingStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen options={{ headerShown: false }} name='Onboarding' component={Onboarding} />
            <Stack.Screen options={{ headerShown: false }} name='StationCreation' component={StationCreationScreen} />
            <Stack.Screen options={{ headerShown: false }} name='WaitingRoom' component={WaitingRoom} />
            <Stack.Screen options={{ headerShown: false }} name='Admin_StationRequest' component={IncomingStationRequestScreen} />
            <Stack.Screen options={{ headerShown: false }} name='Registration' component={RegistrationScreen} />
            <Stack.Screen options={{ headerShown: false }} name='Login' component={LoginScreen} />
        </Stack.Navigator>
    )

}