import { createNativeStackNavigator } from '@react-navigation/native-stack'
import CreateItemScreen from '../../screens/Wholesaler/CreateItem';
import ItemListScreen from '../../screens/Wholesaler/ItemList';
import OfficeScreen from '../../screens/Wholesaler/Office';
import UpdateItemScreen from '../../screens/Wholesaler/UpdateItem';
import WorkersListScreen from '../../screens/WorkerList';



const Stack = createNativeStackNavigator();

export function OfficeStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen options={{ headerShown: false }} name='OfficeHome' component={OfficeScreen} />
            <Stack.Screen options={{ headerShown: false }} name='ItemList' component={ItemListScreen} />
            <Stack.Screen options={{ headerShown: false }} name='WorkersList' component={WorkersListScreen} />
            <Stack.Screen options={{ headerShown: false }} name='CreateItem' component={CreateItemScreen} />
            <Stack.Screen options={{ headerShown: false }} name='UpdateItem' component={UpdateItemScreen} />
           

        </Stack.Navigator>
    )

}