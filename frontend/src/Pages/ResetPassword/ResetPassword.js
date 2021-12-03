import { React, useState } from 'react';
import 'react-phone-input-2/lib/style.css'
import axios from 'axios';
import config from '../../Config.js';
import { makeStyles, Paper, IconButton, Button } from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons'
import {Row} from "react-bootstrap"
import { decodeToken } from 'react-jwt';
import { useHistory } from 'react-router';
//components
import TopBar from '../../Components/TopBar/TopBar.js';
import colour from '../../Components/Colours/Colours.js';
import Title from '../../Components/Title/Title';

const ResetPassword = ({ match }) => {
    const token = localStorage.getItem('token')
    const gu_id = match.params.guId;
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

    const [password, setPassword] = useState('')
    const [pwType, setPwType] = useState('password')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [cmfPwType, setCmfPwType] = useState('password')

    //submit
    const onSubmit = () => {
        if (password.length < 1) {
            alert('Password should not be empty')
        } else if (password != confirmPassword) {
            alert('Password not matching')
        } else {
            axios.put(`${config.baseUrl}/u/user/resetpassword/${gu_id}`, { data: { password: password } })
                .then(response => {
                    alert('Password updated')
                    history.push(`/manageusers`)
                })
                .catch(err => {
                    alert('Update fail')
                    console.log(err)
                })
        }
    }

    //show password
    const togglePW = () => {
        if (pwType == 'password') {
            setPwType('text')
        } else {
            setPwType('password')
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
            <Title title="Reset Password"/>
            <TopBar pageName='Reset Password' />
            <Paper className={classes.formContainer}>
                <form className={classes.form} noValidate autoComplete="off">
                    {/* New Password */}
                    <div className="form-group" style={{ height: 'auto' }}>
                        <label htmlFor="newPassword">New Password</label>
                        <span className="mandatory">*</span>
                        <div style={{ display: 'flex' }}>
                            <input
                                style={{ margin: 'auto' }}
                                id="newPassword"
                                type={pwType}
                                className="form-control" w
                                placeholder="Enter new password"
                                value={password}
                                onChange={(e) => { setPassword(e.target.value) }}
                            />
                            <IconButton onClick={() => togglePW()} className={classes.removeOutline}>
                                {(pwType == 'password') && <VisibilityOff style={{ color: 'white' }} />}
                                {(pwType != 'password') && <Visibility style={{ color: 'white' }} />}
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
export default ResetPassword
