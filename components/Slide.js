const [emailError, setEmailError] = useState(false);
const [firstnameError, setFirstnameError] = useState(false);
const [lastnameError, setLastnameError] = useState(false);
const [middlenameError, setMiddlenameError] = useState(false);
const [roleError, setRoleError] = useState(false);
const [phonenumberError, setPhonenumberError] = useState(false);

const [emailMessage, setEmailMessage] = useState("");
const [firstnameMessage, setFirstnameMessage] = useState("");
const [lastnameMessage, setLastnameMessage] = useState("");
const [middlenameMessage, setMiddlenameMessage] = useState("");
const [roleMessage, setRoleMessage] = useState("");
const [phonenumberMessage, setPhonenumberMessage] = useState("");

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

const validateFirstname = (firstname) => {
  // check if the firstname is empty
  if (!firstname) {
    setFirstnameError(true);
    setFirstnameMessage("Firstname is required");
    return false;
  }
  // check if the firstname is alphabetic
  const firstnameRegex = /^[a-zA-Z]+$/;
  if (!firstnameRegex.test(firstname)) {
    setFirstnameError(true);
    setFirstnameMessage("Firstname must be alphabetic");
    return false;
  }
  