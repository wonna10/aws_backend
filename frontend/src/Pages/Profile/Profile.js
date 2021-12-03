import StyledButton from "../../Components/StyledButton/StyledButton";
import { makeStyles, Paper } from '@material-ui/core';
import { useHistory } from "react-router";
import React, { useState, useEffect } from 'react';
import TopBar from '../../Components/TopBar/TopBar';
import Title from '../../Components/Title/Title'
import colour from "../../Components/Colours/Colours";
import { Row } from "react-bootstrap";
const Profile = () => {
    const history = useHistory();
    const useStyles = makeStyles({
        root: {
            margin: 'auto',
            height: "auto",
            backgroundColor: colour.c1,
            boxShadow: "0px 5px 5px rgba(00,00,00,0.2)",
            padding: '15px 15px 1px 15px',
            borderRadius: 5,
            marginBottom: 15
        }
    })

    const classes = useStyles()
    return (
        <>
            <Title title="Profile" />
            <TopBar pageName='Profile' />
            <div className={classes.root}>
                <Row style={{ margin: 20 }}>
                    <div style={{ margin: 'auto' }}>
                        <StyledButton text="Edit Profile" event={() => { history.push('/editprofile') }} />
                        <StyledButton text="Change Password" event={() => { history.push('/changepassword') }} style={{ marginLeft: 20 }} />
                        <StyledButton text="Update Payment Method" event={() => { history.push('/paymentmethod') }} style={{ marginLeft: 20 }} />
                    </div>
                </Row>
            </div>
        </>
    );
};

export default Profile;
