// Add the token to the header if there is one.
import axios from "axios";

// this method sync the local storage token with the default auth token sent with every request.
const setAuthToken = (token) => {
  if (token) {
    // set default header wich will be sent with every reqeust being made. 
    axios.defaults.headers.common["x-auth-token"] = token; 
  } else {
    delete axios.defaults.headers.common["x-auth-token"];
  }
};

export default setAuthToken;
