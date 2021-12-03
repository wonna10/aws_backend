import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import colour from "../Colours/Colours";

const Header = ({CompanyName}) => {
    const history = useHistory();
    const [isLogin, setIsLogin] = useState(false);
    const [displayName, setDisplayName] = useState(null);
    var defaultName = "eISO System"

    useEffect(() => {
        let getDisplayName = window.sessionStorage.getItem("displayName")
        if (getDisplayName !== null) {
            setIsLogin(true)
            setDisplayName(getDisplayName);
        }
    }, []);

    return (
            <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: colour.c6 }}>  
                    <h2 style={{ color: "#ffffff" }}>{CompanyName ? CompanyName : defaultName}</h2>
            </nav>
    )
};
export default Header;
