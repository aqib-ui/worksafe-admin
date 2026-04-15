// import { Route, Routes } from 'react-router-dom';
// import LoginScreen from "../screens/loginScreen/index.jsx";
// import RegisterScreen from "../screens/registerScreen/index.jsx";

// const UnauthenticatedRoutes = () => (
//     <>
//         <Routes>
//             <Route path="*" element={<LoginScreen />} />
//             <Route path="/" element={<LoginScreen />} />
//             <Route path="/register" element={<RegisterScreen />} />
//         </Routes>
//     </>
// );

// export default UnauthenticatedRoutes;



import { Route, Routes } from 'react-router-dom';
import LoginScreen from "../screens/authScreens/loginScreen/index";
import EmailVerification from "../screens/authScreens/emailVerificaition/index";
import Otp from "../screens/authScreens/otp/index";
import ResetPassword from "../screens/authScreens/resetPassword/index";
import Register from "../screens/authScreens/register/index";
import OnBoarding from "../screens/authScreens/onboarding/index";
import AuthLayout from '../layouts/authLayout';

import TermsCondition from "../screens/termsAndCondition/index";
import PrivacyPolicy from "../screens/privacyPolicy/index";


const UnauthenticatedRoutes = () => (
    <>
        <Routes>
            <Route element={<AuthLayout />}>
                <Route path="*" element={<LoginScreen />} />
                <Route path="/" element={<LoginScreen />} />
                <Route path="/email-verification" element={<EmailVerification />} />
                <Route path="/otp" element={<Otp />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/register" element={<Register />} />

            </Route>
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-and-condition" element={<TermsCondition />} />
            {/* <Route path="/user-onboard" element={<OnBoarding />} /> */}
        </Routes>
    </>
);

export default UnauthenticatedRoutes;
