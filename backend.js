import AsyncStorage from "@react-native-async-storage/async-storage";

//st is short for state
function err(err) {
    console.log(err)
}

export default class Endpoints {
    constructor() {
        //this.url = "http://192.168.74.202:3000/api/"
        this.url = "https://reeya-backend.onrender.com/api/"
        //this.url="https://eathub.live/"
    }
    async setRequestOptions(method) {
        this.token = await AsyncStorage.getItem("token")
        console.log(this.token)

        this.requestOptions = {
            method,
            headers: { 'Content-Type': 'application/json', 'auth': `${this.token}` },
        }
    }
    async handleScreenNavigationBasedOnRole(navigation) {
        //this is to handle the navigationn system based on the role of the user 
        let user_role = await AsyncStorage.getItem("station_role")
        let has_station = await AsyncStorage.getItem("has_station")
        let station_type = await AsyncStorage.getItem("station_type")

        if (user_role == "WORKER" && has_station == "false") {
            navigation.replace("WaitingRoom")
        } else if (user_role == "OWNER" && has_station == "false") {
            navigation.replace("StationCreation")
        } else if (user_role == "OWNER" && has_station == "true") {
            navigation.replace("MainTab", { station_type })
        } else if (user_role == "WORKER" && has_station == "true") {
            navigation.replace("MainTab", { station_type })
        }


    }

    async handleScreenNavigationBasedStationType(navigation) {
        //this is to handle the navigationn system based on the type of station 
        navigation.replace('MainTab')


    }


    async registration({ username, password }, addMessage, Message_st_func, Nextpagefunc) {
        await this.setRequestOptions("Post")
        addMessage("sending...", Message_st_func)

        this.requestOptions.body = JSON.stringify({ username, password })
        try {
            console.log("eee")
            let response = await fetch(`${this.url}account/registration`, this.requestOptions)


            let result = await response.json()
            if (Object.keys(result).includes("message")) {
                addMessage(result.message, Message_st_func)
            } else {
                addMessage("Account created successfully", Message_st_func)

                await AsyncStorage.setItem("token", result.auth_token)
                setTimeout(() => {
                    Nextpagefunc.snapToNext()

                }, 2000)
            }

        } catch (err) {
            console.log(err)
            addMessage("Check Internet connection", Message_st_func)
        }

    }

    async login(data, addMessage, Message_st_func, navigation) {
        await this.setRequestOptions("Post")
        this.requestOptions.body = JSON.stringify(data)
        try {
            console.log("eee")
            let response = await fetch(`${this.url}account/login`, this.requestOptions)

            let result = await response.json()
            console.log(result)
            if (Object.keys(result).includes("message")) {
                addMessage(result.message, Message_st_func)
            } else {
                addMessage("Logging you in boss", Message_st_func)

                if (result.has_station == "true") {
                    //so the person will need to always login if he/she hasn't created or joined a station 
                    await AsyncStorage.setItem("station_type", result.station_type)

                }
                await AsyncStorage.setItem("station_role", result.role)
                await AsyncStorage.setItem("token", result.auth_token)


                await AsyncStorage.setItem("has_station", result.has_station)

                await this.handleScreenNavigationBasedOnRole(navigation)
            }

        } catch (err) {
            console.log(err)
            addMessage("Check Internet connection", Message_st_func)
        }

    }

    async checkStationRole() {
        let station_role = await AsyncStorage.getItem("station_role")
        return station_role
    }
    async createProfile({ first_name, last_name, middle_name, phone_number, role, email }, addMessage, Message_st_func, navigation) {
        await this.setRequestOptions("Post")
        console.log("bitch")
        this.requestOptions.body = JSON.stringify({ first_name, last_name, middle_name, phonenumber: phone_number, role, email })
        try {
            console.log("eee")
            let response = await fetch(`${this.url}account/profile`, this.requestOptions)

            let result = await response.json()
            if (Object.keys(result).includes("message")) {
                addMessage(result.message, Message_st_func)
            } else {
                addMessage("Profile created successfully", Message_st_func)
                console.log(result)
                await AsyncStorage.setItem("station_role", result.role)
                setTimeout(async () => {
                    let station_role = await this.checkStationRole()
                    station_role == "OWNER" ? navigation.replace('StationCreation') : navigation.replace('WaitingRoom')

                }, 1000)
            }

        } catch (err) {
            console.log(err)
            addMessage("Check Internet connection", Message_st_func)
        }

    }


    async createProfile({ first_name, last_name, middle_name, phone_number, role, email }, addMessage, Message_st_func, navigation) {
        await this.setRequestOptions("Post")
        console.log("bitch")
        this.requestOptions.body = JSON.stringify({ first_name, last_name, middle_name, phonenumber: phone_number, role, email })
        try {
            console.log("eee")
            let response = await fetch(`${this.url}account/profile`, this.requestOptions)

            let result = await response.json()
            if (Object.keys(result).includes("message")) {
                addMessage(result.message, Message_st_func)
            } else {
                addMessage("Profile created successfully", Message_st_func)
                console.log(result)
                await AsyncStorage.setItem("station_role", result.role)
                setTimeout(async () => {
                    let station_role = await this.checkStationRole()
                    station_role == "OWNER" ? navigation.replace('StationCreation') : navigation.replace('WaitingRoom')

                }, 1000)
            }

        } catch (err) {
            console.log(err)
            addMessage("Check Internet connection", Message_st_func)
        }

    }
    async createStation(data, addMessage, Message_st_func, navigation) {
        await this.setRequestOptions("Post")
        console.log("bitch")
        this.requestOptions.body = JSON.stringify(data)
        try {
            let response = await fetch(`${this.url}station/create`, this.requestOptions)


            let result = await response.json()
            console.log(result)

            if (Object.keys(result).includes("message")) {
                addMessage(result.message, Message_st_func)
            } else {
                addMessage("Station created successfully", Message_st_func)
                await AsyncStorage.setItem("has_station", "true")
                console.log(result)
                setTimeout(async () => {
                    //we will have to check to type of the user to determine the next page
                    await this.handleScreenNavigationBasedOnRole(navigation)
                }, 1000)
            }

        } catch (err) {
            console.log(err)
            addMessage("Check Internet connection", Message_st_func)
        }

    }

    async getProfile(st, addMessage, Message_st_func) {
        await this.setRequestOptions("Get")

        try {
            console.log("eee")
            let response = await fetch(`${this.url}account/profile`, this.requestOptions)

            let result = await response.json()
            if (Object.keys(result).includes("message")) {
                addMessage(result.message, Message_st_func)
            } else {
                addMessage("Gotten profile", Message_st_func)
                st(result)

            }

        } catch (err) {
            console.log(err)
            addMessage("Check Internet connection", Message_st_func)
        }

    }


    async add_worker(setWorkers, data, addMessage, Message_st_func, setShowIndicator) {
        await this.setRequestOptions("Put")

        console.log(setWorkers, data, addMessage, Message_st_func, setShowIndicator)
        this.requestOptions.body = JSON.stringify(data)
        setShowIndicator(true)

        try {
            console.log("eee")
            let response = await fetch(`${this.url}station/add_workers`, this.requestOptions)

            let result = await response.json()
            console.log(result)

            if (Object.keys(result).includes("message")) {

                setShowIndicator(false)
                console.log("result")
                addMessage(result.message, Message_st_func)
            } else {
                setShowIndicator(false)
                addMessage("Added Worker", Message_st_func)
                setWorkers(result)

            }

        } catch (err) {
            console.log(err)
            setShowIndicator(false)

            addMessage("Check Internet connection", Message_st_func)
        }

    }

    async remove_worker(setWorkers, data, addMessage, Message_st_func, setShowIndicator) {
        await this.setRequestOptions("Put")

        console.log(setWorkers, data, addMessage, Message_st_func, setShowIndicator)
        this.requestOptions.body = JSON.stringify(data)
        setShowIndicator(true)

        try {
            console.log("eee")
            let response = await fetch(`${this.url}station/remove_worker`, this.requestOptions)

            let result = await response.json()
            console.log(result)

            if (Object.keys(result).includes("message")) {

                setShowIndicator(false)
                console.log("result")
                addMessage(result.message, Message_st_func)
            } else {
                setShowIndicator(false)
                addMessage("Added Worker", Message_st_func)
                setWorkers(result)

            }

        } catch (err) {
            console.log(err)
            setShowIndicator(false)

            addMessage("Check Internet connection", Message_st_func)
        }

    }

    async view_workers(setWorkers, addMessage, Message_st_func, setShowIndicator) {
        await this.setRequestOptions("Get")
        setShowIndicator(true)

        try {
            let response = await fetch(`${this.url}station/view_workers`, this.requestOptions)

            let result = await response.json()
            console.log(result)

            if (Object.keys(result).includes("message")) {

                setShowIndicator(false)
                console.log("result")
                addMessage(result.message, Message_st_func)
            } else {
                setShowIndicator(false)
                setWorkers(result)

            }

        } catch (err) {
            console.log(err)
            setShowIndicator(false)

            addMessage("Check Internet connection", Message_st_func)
        }

    }


    async all_Item(setItems, addMessage, Message_st_func, setShowIndicator) {
        await this.setRequestOptions("Get")

        setShowIndicator(true)

        try {
            console.log("eee")
            let response = await fetch(`${this.url}wholesaler/owner/all/items`, this.requestOptions)

            let result = await response.json()
            console.log(result)

            if (Object.keys(result).includes("message")) {

                setShowIndicator(false)
                addMessage(result.message, Message_st_func)
            } else {
                setShowIndicator(false)

                setItems(result)
            }

        } catch (err) {
            console.log(err)
            setShowIndicator(false)

            addMessage("Check Internet connection", Message_st_func)
        }

    }


    async create_Item(data, addMessage, Message_st_func, setShowIndicator) {
        await this.setRequestOptions("Post")

        console.log(data, addMessage, Message_st_func, setShowIndicator)
        this.requestOptions.body = JSON.stringify(data)
        setShowIndicator(true)

        try {
            console.log("eee")
            let response = await fetch(`${this.url}wholesaler/owner/item/create`, this.requestOptions)

            let result = await response.json()
            console.log(result)

            if (Object.keys(result).includes("message")) {

                setShowIndicator(false)
                console.log("result")
                addMessage(result.message, Message_st_func)
            } else {
                setShowIndicator(false)
                addMessage(`${result.title} Created`, Message_st_func)

            }

        } catch (err) {
            console.log(err)
            setShowIndicator(false)

            addMessage("Check Internet connection", Message_st_func)
        }

    }


    async update_or_view_Item(data, itemID, addMessage, Message_st_func, setShowIndicator) {
        await this.setRequestOptions("Put")

        this.requestOptions.body = JSON.stringify(data)
        setShowIndicator(true)

        try {
            console.log("enter me")
            let response = await fetch(`${this.url}wholesaler/owner/item/${itemID}`, this.requestOptions)

            let result = await response.json()
            console.log(result)

            if (Object.keys(result).includes("message")) {

                setShowIndicator(false)
                console.log("result")
                addMessage(result.message, Message_st_func)
            } else {
                setShowIndicator(false)
                addMessage("Item updated", Message_st_func)

            }

        } catch (err) {
            console.log(err)
            setShowIndicator(false)

            addMessage("Check Internet connection", Message_st_func)
        }

    }
    async addToCart(data, itemID, addMessage, Message_st_func, setShowIndicator) {
        await this.setRequestOptions("Post")

        this.requestOptions.body = JSON.stringify(data)
        setShowIndicator(true)

        try {
            console.log("enter me")
            let response = await fetch(`${this.url}retailer/worker_and_owner/add_to_cart/${itemID}`, this.requestOptions)

            let result = await response.json()
            console.log(result)

            if (Object.keys(result).includes("message")) {

                setShowIndicator(false)
                console.log("result")
                addMessage(result.message, Message_st_func)
            }

        } catch (err) {
            console.log(err)
            setShowIndicator(false)

            addMessage("Check Internet connection", Message_st_func)
        }

    }

    async decreaseFromCart(data, itemID, addMessage, Message_st_func, setShowIndicator) {
        await this.setRequestOptions("Post")

        this.requestOptions.body = JSON.stringify(data)
        setShowIndicator(true)

        try {
            console.log("enter me")
            let response = await fetch(`${this.url}retailer/worker_and_owner/decrease_from_cart/${itemID}`, this.requestOptions)

            let result = await response.json()
            console.log(result)

            if (Object.keys(result).includes("message")) {

                setShowIndicator(false)
                console.log("result")
                addMessage(result.message, Message_st_func)
            }

        } catch (err) {
            console.log(err)
            setShowIndicator(false)

            addMessage("Check Internet connection", Message_st_func)
        }

    }
    async Retailer_Item_by_wholesaler(setItems, wholesalerId, addMessage, Message_st_func, setShowIndicator) {
        await this.setRequestOptions("Post")

        setShowIndicator(true)

        try {
            console.log("eee")
            let response = await fetch(`${this.url}retailer/worker_and_owner/item_by_wholesaler/${wholesalerId}`, this.requestOptions)

            let result = await response.json()

            if (Object.keys(result).includes("message")) {

                setShowIndicator(false)
                addMessage(result.message, Message_st_func)
            } else {
                setShowIndicator(false)

                setItems(result)
            }

        } catch (err) {
            console.log(err)
            setShowIndicator(false)

            addMessage("Check Internet connection", Message_st_func)
        }

    }
    async Retailer_homepage_Item(setItems, data, addMessage, Message_st_func, setShowIndicator) {
        await this.setRequestOptions("Post")
        this.requestOptions.body = JSON.stringify(data)

        setShowIndicator(true)

        try {
            console.log("eee")
            let response = await fetch(`${this.url}retailer/worker_and_owner/all_items`, this.requestOptions)

            let result = await response.json()

            if (Object.keys(result).includes("message")) {

                setShowIndicator(false)
                addMessage(result.message, Message_st_func)
            } else {
                setShowIndicator(false)

                setItems(result)
            }

        } catch (err) {
            console.log(err)
            setShowIndicator(false)

            addMessage("Check Internet connection", Message_st_func)
        }

    }


    async Retailer_Search(setItems, data, addMessage, Message_st_func, setShowIndicator) {
        await this.setRequestOptions("Post")
        this.requestOptions.body = JSON.stringify(data)
        setShowIndicator(true)

        try {
            console.log("eee")
            let response = await fetch(`${this.url}retailer/worker_and_owner/search`, this.requestOptions)

            let result = await response.json()

            if (Object.keys(result).includes("message")) {

                setShowIndicator(false)
                addMessage(result.message, Message_st_func)
            } else {
                setShowIndicator(false)

                setItems(result)
            }

        } catch (err) {
            console.log(err)
            setShowIndicator(false)

            addMessage("Check Internet connection", Message_st_func)
        }

    }

    async Retailer_Cart(setItems, addMessage, Message_st_func, setShowIndicator, setTotalPrice) {
        await this.setRequestOptions("Get")
        setShowIndicator(true)
        try {
            console.log("eee")
            let response = await fetch(`${this.url}retailer/worker_and_owner/cart`, this.requestOptions)

            let result = await response.json()
            setTotalPrice(0)

            let total = 0
            result.map((v, i) => {
                total += v.total_price
            })
            setTotalPrice(total)

            if (Object.keys(result).includes("message")) {

                setShowIndicator(false)
                addMessage(result.message, Message_st_func)
            } else {
                setShowIndicator(false)

                setItems(result)
            }

        } catch (err) {
            console.log(err)
            setShowIndicator(false)

            addMessage("Check Internet connection", Message_st_func)
        }

    }

    async Retailer_Checkout(data, addMessage, Message_st_func, setShowIndicator,) {
        await this.setRequestOptions("Post")
        setShowIndicator(true)
        this.requestOptions.body = JSON.stringify(data)

        try {
            let response = await fetch(`${this.url}retailer/worker_and_owner/checkout`, this.requestOptions)

            let result = await response.json()



            if (Object.keys(result).includes("message")) {

                setShowIndicator(false)
                addMessage(result.message, Message_st_func)
            }

        } catch (err) {
            console.log(err)
            setShowIndicator(false)

            addMessage("Check Internet connection", Message_st_func)
        }

    }

    async Retailer_pending_orders(setItems, addMessage, Message_st_func, setShowIndicator,) {
        await this.setRequestOptions("Post")
        setShowIndicator(true)

        try {
            let response = await fetch(`${this.url}retailer/worker_and_owner/pending_orders`, this.requestOptions)

            let result = await response.json()



            if (Object.keys(result).includes("message")) {

                setShowIndicator(false)
                addMessage(result.message, Message_st_func)
            } else {
                setShowIndicator(false)

                setItems(result)
            }

        } catch (err) {
            console.log(err)
            setShowIndicator(false)

            addMessage("Check Internet connection", Message_st_func)
        }

    }
    async wholesaler_incoming_orders(setItems, addMessage, Message_st_func, setShowIndicator,) {
        await this.setRequestOptions("Post")
        setShowIndicator(true)

        try {
            let response = await fetch(`${this.url}wholesaler/owner/pending_orders`, this.requestOptions)

            let result = await response.json()



            if (Object.keys(result).includes("message")) {

                setShowIndicator(false)
                addMessage(result.message, Message_st_func)
            } else {
                setShowIndicator(false)

                setItems(result)
            }

        } catch (err) {
            console.log(err)
            setShowIndicator(false)

            addMessage("Check Internet connection", Message_st_func)
        }

    }

    async dispatcher_pending_deliveries(setItems, addMessage, Message_st_func, setShowIndicator,) {
        await this.setRequestOptions("Put")
        setShowIndicator(true)

        try {
            let response = await fetch(`${this.url}dispatcher/worker_and_owner/view_incoming_deliveries`, this.requestOptions)

            let result = await response.json()


            console.log(result[0])
            if (Object.keys(result).includes("message")) {

                setShowIndicator(false)
                addMessage(result.message, Message_st_func)
            } else {
                setShowIndicator(false)

                setItems(result)
            }

        } catch (err) {
            console.log(err)
            setShowIndicator(false)

            addMessage("Check Internet connection", Message_st_func)
        }

    }

    async admin_station_requests(setItems, addMessage, Message_st_func, setShowIndicator,) {
        await this.setRequestOptions("Get")
        setShowIndicator(true)

        try {
            let response = await fetch(`${this.url}account/station_list`, this.requestOptions)

            let result = await response.json()


            if (Object.keys(result).includes("message")) {

                setShowIndicator(false)
                addMessage(result.message, Message_st_func)
            } else {
                setShowIndicator(false)

                setItems(result)
            }

        } catch (err) {
            console.log(err)
            setShowIndicator(false)

            addMessage("Check Internet connection", Message_st_func)
        }

    }

    async station_profile(setItems, addMessage, Message_st_func, setShowIndicator,) {
        await this.setRequestOptions("Get")
        setShowIndicator(true)

        try {
            let response = await fetch(`${this.url}station/view_wallet`, this.requestOptions)

            let result = await response.json()
            console.log(result)

            if (Object.keys(result).includes("message")) {

                setShowIndicator(false)
                addMessage(result.message, Message_st_func)
            } else {
                setShowIndicator(false)

                setItems(result)
            }

        } catch (err) {
            console.log(err)
            setShowIndicator(false)

            addMessage("Check Internet connection", Message_st_func)
        }

    }
    async wholesaler_change_order_status(data, orderedItemId, addMessage, Message_st_func, setShowIndicator) {
        await this.setRequestOptions("Put")
        this.requestOptions.body = JSON.stringify(data)
        setShowIndicator(true)

        try {
            let response = await fetch(`${this.url}wholesaler/worker/ordereditem/changestatus/${orderedItemId}`, this.requestOptions)

            let result = await response.json()



            if (Object.keys(result).includes("message")) {

                setShowIndicator(false)
                addMessage(result.message, Message_st_func)
            }



        } catch (err) {
            console.log(err)
            setShowIndicator(false)

            addMessage("Check Internet connection", Message_st_func)
        }

    }
    async dispatcher_change_order_status(data, orderedItemId, addMessage, Message_st_func, setShowIndicator) {
        await this.setRequestOptions("Put")
        this.requestOptions.body = JSON.stringify(data)
        setShowIndicator(true)

        try {
            let response = await fetch(`${this.url}dispatcher/worker_and_owner/ordereditem/changestatus/${orderedItemId}`, this.requestOptions)

            let result = await response.json()



            if (Object.keys(result).includes("message")) {

                setShowIndicator(false)
                addMessage(result.message, Message_st_func)
            }



        } catch (err) {
            console.log(err)
            setShowIndicator(false)

            addMessage("Check Internet connection", Message_st_func)
        }

    }

    async initiate_payment(data, orderedItemId, addMessage, Message_st_func, setShowIndicator, navigation) {
        await this.setRequestOptions("Post")
        //this.requestOptions.body=JSON.stringify(data)
        setShowIndicator(true)

        try {
            let response = await fetch(`${this.url}retailer/worker_and_owner/initiate_payments/${orderedItemId}`, this.requestOptions)
            let result = await response.json()
            console.log(result)
            if (Object.keys(result).includes("message")) {

                setShowIndicator(false)
                addMessage(result.message, Message_st_func)
                return;
            } else {
                console.log("moving")
                navigation.navigate("Home", { screen: "Payment", params: { url: result.authorization_url } })
            }




        } catch (err) {
            console.log(err)
            setShowIndicator(false)

            addMessage("Check Internet connection", Message_st_func)
        }

    }
    async admin_change_station_status(data, stationId, addMessage, Message_st_func, setShowIndicator) {
        await this.setRequestOptions("Put")
        setShowIndicator(true)

        try {
            let response = await fetch(`${this.url}account/station/approve/${stationId}`, this.requestOptions)

            let result = await response.json()



            if (Object.keys(result).includes("message")) {

                setShowIndicator(false)
                addMessage(result.message, Message_st_func)
            }



        } catch (err) {
            console.log(err)
            setShowIndicator(false)

            addMessage("Check Internet connection", Message_st_func)
        }

    }
}
//food/byVendor/<vendorid>/