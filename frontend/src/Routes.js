import React, { useEffect, useState } from "react";
//https://ui.dev/react-router-v4-pass-props-to-link/
import {
    Route,
    BrowserRouter as Router,
    Switch,
    Redirect,
} from 'react-router-dom';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import './Style.css'
import moment from 'moment'
import { decodeToken, isExpired } from 'react-jwt';
import Cookies from 'universal-cookie';
import axios from "axios";
import config from "./Config";
import { useHistory } from "react-router";

//pages
import Login from './Pages/Login/Login';
import Dashboard from './Pages/Dashboard/Dashboard';
import ManageUsers from './Pages/ManageUsers/ManageUsers';
import ManageInvites from './Pages/ManageInvites/ManageInvites';
import EditUser from "./Pages/EditUser/EditUser";
import MissingPage from './Pages/MissingPage/MissingPage';
import AssignRole from './Pages/AssignRole/AssignRole';
import ResetPassword from './Pages/ResetPassword/ResetPassword';
import ManageRoles from './Pages/ManageRoles/MangeRoles'
import EditRole from './Pages/EditRole/EditRole';
import Profile from './Pages/Profile/Profile';
import EditProfile from './Pages/EditProfile/EditProfile';
import Register from './Pages/Register/Register';
import SendInvites from "./Pages/SendInvites/SendInvites";
import Company from "./Pages/Company/Company";
import PaymentMethod from "./Pages/PaymentMethod/PaymentMethod";
import Expired from "./Pages/Expired/Expired";
import ChangePassword from "./Pages/ChangePassword/ChangePassword";
import EmailRequest from "./Pages/ResetPassword/EmailRequest";
import ResetPasswordV2 from "./Pages/ResetPassword/ResetPasswordV2";

//components
import SideNav from './Components/SideNav/SideNav';
import Header from "./Components/Header/Header";

const token = localStorage.getItem('token')
const authGuard = (Component) => (props) => {
    const cookies = new Cookies();
    const history = useHistory();
    useEffect(() => {
        axios.post(`${config.baseUrl}/u/user/refreshtoken`,
            { jwt: token }, { withCredentials: true })
            .then(response => {
                localStorage.setItem('token', response.data);
            }).catch(error => {
                console.log(error);
            });
    }, []);

    return localStorage.getItem('token') ? (
        <Component {...props} />
    ) : (
        <Redirect to="/login" />
    );
};
const authGuardNotLogin = (Component) => (props) => {
    console.log(props);
    return <Component {...props} />
};

//set MUI theme
const themeMUI = createMuiTheme({
    typography: {
        fontFamily: [
            'Segoe UI', 'Frutiger', 'Frutiger Linotype', 'Dejavu Sans', 'Helvetica Neue', 'Arial', 'sans-serif'
        ]
    }
})

console.log()
const Routes = (props) => (
    <ThemeProvider theme={themeMUI}>
        <Router {...props} >
            <Switch>
                <Route path="/register/:token" component={authGuardNotLogin(Register)}></Route>
                <Route exact strict path="/login" component={Login} />

                <Route path="/resetPasswordV2/token=:token" component={authGuardNotLogin(ResetPasswordV2)}></Route>
                <Route path="/emailRequest" component={authGuardNotLogin(EmailRequest)}></Route>

                <Route path=''>
                    <div style={{ display: 'flex', height: '100vh', }}>
                        <SideNav />

                        <div style={{ width: '100%' }}>
                            <Header CompanyName="eISO"></Header>
                            {/* <TopBar pageName='' /> */}
                            <div style={{ margin: 10 }}>
                                <Switch>
                                    {/* add pages as shown bellow
                                <Route path="/pathname" component={authGuard(page)}></Route> */}
                                    <Route path="/dashboard" component={authGuard(Dashboard)} />
                                    <Route path="/manageusers" component={authGuard(ManageUsers)} />
                                    <Route path="/edituser/:guId" component={authGuard(EditUser)} />
                                    <Route path="/manageinvites" component={authGuard(ManageInvites)} />
                                    <Route path="/assignrole/:guId" component={authGuard(AssignRole)} />
                                    <Route path="/sendinvites/" component={authGuard(SendInvites)} />
                                    <Route path="/resetpassword/:guId" component={authGuard(ResetPassword)} />
                                    <Route path="/manageroles" component={authGuard(ManageRoles)} />
                                    <Route path="/editrole/:roleId" component={authGuard(EditRole)} />
                                    <Route path="/profile" component={authGuard(Profile)} />
                                    <Route path="/editprofile" component={authGuard(EditProfile)} />
                                    <Route path="/company" component={authGuard(Company)} />
                                    <Route path="/changepassword" component={authGuard(ChangePassword)} />
                                    <Route path="/paymentmethod" component={authGuard(PaymentMethod)} />
                                    <Route exact path="/">
                                        <Redirect to="/dashboard" />
                                    </Route>
                                    <Route path="" component={MissingPage} />
                                </Switch>
                            </div>
                        </div>
                    </div>
                </Route>

            </Switch>
        </Router >
    </ThemeProvider >
);


export default Routes;