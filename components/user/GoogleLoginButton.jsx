import React from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { useGlobal } from "../../global/GlobalContext";
import { useLocation, useNavigate } from "@/components/compat/router";

const GoogleLoginButton = () => {
    // const clientId = "46468534085-tnnqv3v6j5r6j3p1u6r6v5s5o8r4qk7i.apps.googleusercontent.com"; //this is plasticmart client id
    const clientId = "dummy10121554454551"; //this is indianhairworld client id
    const { setToken } = useAuth();
    const { mergeLocalCartWithServer } = useGlobal();
    const navigate = useNavigate();
    const location = useLocation();
    const redirectTo = location.state?.slug || '/';

    const handleSuccess = async (response) => {
        try {
            const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/google/callback` ,
                {
                    token: response.credential, // must be 'token'
                    }
                , {
                headers: { Authorization: `Bearer ${response.credential}` }
            }
        );

            // localStorage.setItem("token", data.token);
            // console.log('dataGoogle', data);
            if(data.status){
                setToken(data.user_token);
                localStorage.setItem('username', data.user_data.name);
                localStorage.setItem('useremail', data.user_data.email);
                localStorage.setItem('uservarified', data.user_data.email_verified_at);
                await mergeLocalCartWithServer(data.user_token);
                navigate(redirectTo, { state: location.state });
                window.location.reload();
            }
            // console.log('data.token', data.token);
            // alert("Login successful!");
        } catch (error) {
            console.error("Login failed", error);
        }
    };

    const handleFailure = (error) => {
        console.error("Google login error", error);
    };

    return (
        <GoogleOAuthProvider clientId={clientId}>
            <GoogleLogin 
                onSuccess={handleSuccess}
                onError={handleFailure}
            />
        </GoogleOAuthProvider>
    );
};

export default GoogleLoginButton;


