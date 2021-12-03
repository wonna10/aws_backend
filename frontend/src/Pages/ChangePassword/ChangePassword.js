import { React, useState } from 'react';
import 'react-phone-input-2/lib/style.css'
import axios from 'axios';
import config from '../../Config.js';
import { makeStyles, Paper, IconButton, Button } from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons'
import { Row } from "react-bootstrap"
import { decodeToken } from 'react-jwt';
import { useHistory } from 'react-router';
//components
import TopBar from '../../Components/TopBar/TopBar.js';
import colour from '../../Components/Colours/Colours.js';
import Title from '../../Components/Title/Title';

const ChangePassword = () => {
    const token = localStorage.getItem('token')
    const user_uuid = decodeToken(token).userUUID;
    const history = useHistory()
    if (decodeToken(token).privId > 3) {
        alert('You do not have the privilege to view this page.')
        history.push('/dashboard')
    }
    const useStyles = makeStyles({
        //local style
        formContainer: {
            backgroundColor: colour.c3,
            overflow: 'hidden'
        },
        form: {
            width: '80%',
            margin: 'auto',
            color: 'white',
            padding: '20px'
        },
        formField: {
            backgroundColor: 'black'
        },
        removeOutline: {
            "&:focus": {
                border: "none",
                outline: "none"
            }
        },
        btnContainer: {
            marginBottom: 20,
            margin: 'auto'
        }
    })
    const classes = useStyles()

    const [currentPassword, setCurrentPassword] = useState('')
    const [currentPwType, setCurrentPwType] = useState('password')
    const [newPassword, setNewPassword] = useState('')
    const [newPwType, setNewPwType] = useState('password')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [cmfPwType, setCmfPwType] = useState('password')

    //submit
    const onSubmit = () => {
        if (newPassword.length < 1 || currentPassword.length < 1) {
            alert('Field should not be empty')
        } else if (newPassword != confirmPassword) {
            alert('Password not matching')
        } else {
            console.log(user_uuid);
            axios.put(`${config.baseUrl}/u/user/changepassword/${user_uuid}`, { data: { currentPassword: currentPassword, newPassword: newPassword } })
                .then(response => {
                    alert('Password updated')
                    history.push(`/Dashboard`)
                })
                .catch(error => {
                    if (error.response.status == 406) {
                        alert('Wrong Current Password')
                    }
                    else {
                        alert('Update fail')
                        console.log(error)
                    }
                })
        }
    }


    //show current password
    const toggleCurrentPW = () => {
        if (currentPwType == 'password') {
            setCurrentPwType('text')
        } else {
            setCurrentPwType('password')
        }
    }

    //show password
    const toggleNewPW = () => {
        if (newPwType == 'password') {
            setNewPwType('text')
        } else {
            setNewPwType('password')
        }
    }

    //show confirm password
    const toggleCmfPW = () => {
        if (cmfPwType == 'password') {
            setCmfPwType('text')
        } else {
            setCmfPwType('password')
        }
    }

    return (
        <div>
            <Title title="Change Password" />
            <TopBar pageName='Change Password' />
            <Paper className={classes.formContainer}>
                <form className={classes.form} noValidate autoComplete="off">
                    {/* Current Password */}
                    <div className="form-group" style={{ height: 'auto' }}>
                        <label htmlFor="newPassword">Current Password</label>
                        <span className="mandatory">*</span>
                        <div style={{ display: 'flex' }}>
                            <input
                                style={{ margin: 'auto' }}
                                id="currentPassword"
                                type={currentPwType}
                                className="form-control" w
                                placeholder="Enter current password"
                                onChange={(e) => { setCurrentPassword(e.target.value) }}
                            />
                            <IconButton onClick={() => toggleCurrentPW()} className={classes.removeOutline}>
                                {(currentPwType == 'password') && <VisibilityOff style={{ color: 'white' }} />}
                                {(currentPwType != 'password') && <Visibility style={{ color: 'white' }} />}
                            </IconButton>
                        </div>
                    </div>

                    {/* New Password */}
                    <div className="form-group" style={{ height: 'auto' }}>
                        <label htmlFor="newPassword">New Password</label>
                        <span className="mandatory">*</span>
                        <div style={{ display: 'flex' }}>
                            <input
                                style={{ margin: 'auto' }}
                                id="newPassword"
                                type={newPwType}
                                className="form-control" w
                                placeholder="Enter new password"
                                onChange={(e) => { setNewPassword(e.target.value) }}
                            />
                            <IconButton onClick={() => toggleNewPW()} className={classes.removeOutline}>
                                {(newPwType == 'password') && <VisibilityOff style={{ color: 'white' }} />}
                                {(newPwType != 'password') && <Visibility style={{ color: 'white' }} />}
                            </IconButton>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="form-group" style={{ height: 'auto' }}>
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <span className="mandatory">*</span>
                        <div style={{ display: 'flex' }}>
                            <input
                                style={{ margin: 'auto' }}
                                id="confirmPassword"
                                type={cmfPwType}
                                className="form-control"
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => { setConfirmPassword(e.target.value) }}
                            />
                            <IconButton onClick={() => toggleCmfPW()} className={classes.removeOutline}>
                                {(cmfPwType == 'password') && <VisibilityOff style={{ color: 'white' }} />}
                                {(cmfPwType != 'password') && <Visibility style={{ color: 'white' }} />}
                            </IconButton>
                        </div>
                    </div>
                </form>
                <Row >
                    <div className={classes.btnContainer}>
                        <Button onClick={() => onSubmit()} className={classes.removeOutline} style={{ backgroundColor: colour.c5, color: colour.c1, marginRight: 10 }}>Submit</Button>
                        <Button onClick={() => history.push(`/manageusers`)} className={classes.removeOutline} style={{ backgroundColor: colour.c5, color: colour.c1, marginLeft: 10 }}>Cancel</Button>
                    </div>
                </Row>
            </Paper>
        </div >
    );
};
export default ChangePassword
