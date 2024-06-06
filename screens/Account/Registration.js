import React, { useState, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, Dimensions } from "react-native";
import Carousel from "react-native-snap-carousel";
import Endpoints from "../../backend";
import { color_scheme } from "../../colorscheme";
import Message, { addMessage } from "../../components/messagetoast";

import { Picker } from '@react-native-picker/picker';

const locations = [
    { label: "WORKER", value: 'WORKER' },
    { label: 'OWNER', value: 'OWNER' },
];

const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
const backend = new Endpoints()
const RegistrationScreen = ({ navigation }) => {
    const carouselRef = useRef(null);
    const [enableSnap, setEnableSnap] = useState(false);
    let counter = 0


    const [usernameError, setUsernameError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [usernameMessage, setUsernameMessage] = useState("");
    const [passwordMessage, setPasswordMessage] = useState("");
    const [emailError, setEmailError] = useState(false);
    const [firstnameError, setFirstnameError] = useState(false);
    const [lastnameError, setLastnameError] = useState(false);
    const [middlenameError, setMiddlenameError] = useState(false);
    const [roleError, setRoleError] = useState(false);
    const [phonenumberError, setPhonenumberError] = useState(false);

    const [emailMessage, setEmailMessage] = useState("");
    const [firstnameMessage, setFirstnameMessage] = useState("");
    const [messages, setmessages] = useState([])

    const [lastnameMessage, setLastnameMessage] = useState("");
    const [middlenameMessage, setMiddlenameMessage] = useState("");
    const [roleMessage, setRoleMessage] = useState("");
    const [phonenumberMessage, setPhonenumberMessage] = useState("");
    const validateUsername = (username) => {
        // check if the username is empty
        if (!username) {
            setUsernameError(true);
            setUsernameMessage("Username is required");
            return false;
        }
        // check if the username is alphanumeric
        const usernameRegex = /^[a-zA-Z0-9]+$/;
        if (!usernameRegex.test(username)) {
            setUsernameError(true);
            setUsernameMessage("Username must be alphanumeric");
            return false;
        }
        // check if the username is between 4 and 16 characters
        if (username.length < 4 || username.length > 16) {
            setUsernameError(true);
            setUsernameMessage("Username must be between 4 and 16 characters");
            return false;
        }
        // if all checks pass, return true
        setUsernameError(false);
        setUsernameMessage("");
        return true;
    };

    const validatePassword = (password) => {
        // check if the password is empty
        if (!password) {
            setPasswordError(true);
            setPasswordMessage("Password is required");
            return false;
        }
        // check if the password contains at least one lowercase letter, one uppercase letter, one digit and one special character
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).+$/;
        if (!passwordRegex.test(password)) {
            setPasswordError(true);
            setPasswordMessage(
                "Password must contain at least one lowercase letter, one uppercase letter, one digit and one special character"
            );
            return false;
        }
        // check if the password is between 8 and 32 characters
        if (password.length < 8 || password.length > 32) {
            setPasswordError(true);
            setPasswordMessage("Password must be between 8 and 32 characters");
            return false;
        }
        // if all checks pass, return true
        setPasswordError(false);
        setPasswordMessage("");
        return true;
    };

    const [data, setData] = useState([
        {
            title: "First page",
            username: "",
            password: "",
        },
        {
            title: "Second page",
            first_name: "",
            last_name: "",
            middle_name: "",
            email: "",
            phone_number: "",
            role: "",
        },
    ]);


    const [showPassword, setShowPassword] = useState(false);

    const [activeSlide, setActiveSlide] = useState(0);

    const validateEmail = (email) => {
        // check if the email is empty
        if (!email) {
            setEmailError(true);
            setEmailMessage("Email is required");
            return false;
        }
        // check if the email matches the regex
        if (!emailRegex.test(email)) {
            setEmailError(true);
            setEmailMessage("Email is invalid");
            return false;
        }
        // if all checks pass, return true
        setEmailError(false);
        setEmailMessage("");
        return true;
    };
    const handleNext = async (page) => {
        console.log("bitch")
        // check if the active slide is the first page
        
        page == 2 ? await backend.createProfile(data[1], addMessage, setmessages, navigation) : null
        if (activeSlide === 0) {
            // check if there are no username or password errors
            if (!usernameError && !passwordError) {
                // enable snapping and snap to the second page
                setEnableSnap(true);
                //;
                page == 1 ? await backend.registration(data[0], addMessage, setmessages, carouselRef.current) : await backend.createProfile(data[1], addMessage, setmessages, navigation)
            } else {
                // show an alert message
                alert("Please fix the errors before proceeding");
            }
        }
    };
    const handleUsernameChange = (text, index) => {
        // update the username value in the data array
        setData((prevData) =>
            prevData.map((item, i) =>
                i === index ? { ...item, username: text } : item
            )
        );
        // validate the username
        validateUsername(text);
    };

    const handleEmailChange = (text, index) => {
        // update the username value in the data array
        setData((prevData) =>
            prevData.map((item, i) =>
                i === index ? { ...item, email: text } : item
            )
        );
        // validate the username
        validateEmail(text);
    };
    const validatePhonenumber = (phone_number) => {
        // check if the phone_number is empty
        if (!phone_number) {
            setPhonenumberError(true);
            setPhonenumberMessage("phone_number is required");
            return false;
        }
        // check if the phone_number is numeric
        const phonenumberRegex = /^[0-9]+$/;
        if (!phonenumberRegex.test(phone_number)) {
            setPhonenumberError(true);
            setPhonenumberMessage("phone_number must be numeric");
            return false;
        }
        // if all checks pass, return true
        setPhonenumberError(false);
        setPhonenumberMessage("");
        return true;
    };

    const handlePasswordChange = (text, index) => {
        // update the password value in the data array
        setData((prevData) =>
            prevData.map((item, i) =>
                i === index ? { ...item, password: text } : item
            )
        );
        // validate the password
        validatePassword(text);
    };
    const handlePhonenumberChange = (text, index) => {
        // update the password value in the data array
        setData((prevData) =>
            prevData.map((item, i) =>
                i === index ? { ...item, phone_number: text } : item
            )
        );
        // validate the password
        validatePhonenumber(text);
    };

    const handleFieldChange = (text, index, field) => {
        // update the field value in the data array
        setData((prevData) =>
            prevData.map((item, i) =>
                i === index ? { ...item, [field]: text } : item
            )
        );
    };

    const renderItem = ({ item, index }) => {
        if (index === 0) {
            // render the first page with username and password fields
            return (
                <View style={styles.page}>
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
                    <Text style={styles.title}>Create an Account</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Username"
                        value={item.username}
                        onChangeText={(text) => handleUsernameChange(text, index)}
                    />
                    {usernameError && <Text style={styles.error}>{usernameMessage}</Text>}
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        value={item.password}
                        onChangeText={(text) => handlePasswordChange(text, index)}
                        secureTextEntry={!showPassword}
                    />
                    {passwordError && <Text style={styles.error}>{passwordMessage}</Text>}

                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                        <Text style={styles.button}>
                            {showPassword ? "Hide password" : "Show password"}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={async () => await handleNext(1)}>
                        <Text style={styles.button}>Next</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{position:"absolute",bottom:10}} onPress={()=>{navigation.push("Login")}}>
                        <Text style={{fontFamily:"reg",color:color_scheme.grey,fontSize:16}}>Have an account?? <Text style={{fontFamily:"reg",fontSize:16,color:color_scheme.primary}}>login</Text></Text>
                    </TouchableOpacity>

                </View>
            );
        } else {
            // render the second page with six fields
            return (
                <View style={styles.page}>
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
                    <Text style={[styles.title,]}>Create your profile</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="first_name"
                        value={item.first_name}
                        onChangeText={(text) => handleFieldChange(text, index, "first_name")}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="last_name"
                        value={item.last_name}
                        onChangeText={(text) => handleFieldChange(text, index, "last_name")}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="middle_name"
                        value={item.middle_name}
                        onChangeText={(text) => handleFieldChange(text, index, "middle_name")}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        value={item.email}
                        onChangeText={(text) => handleEmailChange(text, index, "email")}
                    />
                    {emailError && <Text style={styles.error}>{emailMessage}</Text>}
                    <TextInput
                        style={styles.input}
                        placeholder="phone_number"
                        keyboardType="numeric"
                        value={item.phone_number}
                        onChangeText={(text) => handlePhonenumberChange(text, index)}
                    />
                    {phonenumberError && <Text style={styles.error}>{phonenumberMessage}</Text>}


                    <Picker
                        selectedValue={item.role}
                        style={{ height: 50, width: 200 }}
                        onValueChange={(text) => handleFieldChange(text, index, "role")}
                    >
                        {locations.map((location) => (
                            <Picker.Item
                                key={location.value}
                                label={location.label}
                                value={location.value}
                            />
                        ))}
                    </Picker>
                    <TouchableOpacity onPress={async () => await handleNext(2)}>
                        <Text style={styles.button}>Next</Text>
                    </TouchableOpacity>
                </View>
            );
        }
    };

    return (
        <Carousel
            data={data}
            renderItem={renderItem}
            sliderWidth={Dimensions.get("window").width}
            itemWidth={Dimensions.get("window").width}
            itemHeight={Dimensions.get("window").height}

            onSnapToItem={(index) => setActiveSlide(index)}
            enableSnap={enableSnap} // use a state variable for this prop
            ref={carouselRef} // pass the ref as a prop
        />
    );
};

const styles = {
    page: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: color_scheme.secondary,
    },
    error: {
        color: "red",
        margin: 10,
    },

    title: {
        fontSize: 27,
        fontFamily: "bold",

        margin: 10,
        color: color_scheme.primary,
    },
    input: {
        width: "80%",
        fontFamily: "reg",
        height: 50,
        borderWidth: 1,
        borderColor: color_scheme.accent,
        borderRadius: 10,
        padding: 10,
        margin: 10,
        color: color_scheme.accent
    },
    button: {
        color: "#fff",
        fontFamily: "reg",
        backgroundColor: color_scheme.accent,
        padding: 10,
        borderRadius: 5,
        margin: 10,
    },
};

export default RegistrationScreen;
