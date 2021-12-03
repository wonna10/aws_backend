import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useHistory } from "react-router-dom";
import { Form, Button, Container } from "react-bootstrap";
import styles from './ResetPassword.module.css';
import { useForm } from 'react-hook-form';
import { useParams } from "react-router";

import colour from '../../Components/Colours/Colours'
import config from '../../Config.js';

function ResetPasswordV2() {
    let { token } = useParams();
    const history = useHistory();
    const [userCredential, setUserCredential] = useState({ password: "", confirmPassword: "" });
    const [message, setMessage] = useState({ data: '', type: '' });
    const { register, handleSubmit } = useForm();
    const [isDisplay, setIsDisplay] = useState(false);

    console.log(token);

    // handle input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setUserCredential({
            ...userCredential,
            [name]: value
        })

    };

    const onSubmit = (data) => {
        if (userCredential.password == "" && userCredential.confirmPassword == "") {
            setMessage({
                data: 'Please fill in your password.',
                type: 'alert-danger'
            });
            setIsDisplay(true)
            alert("Please fill in your password");
        }
        else if (userCredential.password != userCredential.confirmPassword) {
            setMessage({
                data: 'Password does not match. Please try again',
                type: 'alert-danger'
            });
            setIsDisplay(true)
            alert("Password does not match");
        }
        else {
            axios.put(`${config.baseUrl}/auth/resetPassword`, {
                password: userCredential.password
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(response => {
                    let records = response.data.message
                    console.log(response)
                    console.log(records);
                    setMessage({
                        data: 'Your password reset is successful.',
                        type: 'alert-success'
                    });
                    setIsDisplay(true);
                    alert("Reset successful");
                    history.push("/Login");
                })
                .catch(error => {
                    console.log(error);
                    setMessage({
                        data: 'Something went wrong. Please try again.',
                        type: 'alert-danger'
                    });
                    setIsDisplay(true);
                });

        }
    }

    return (
        <div className={`${styles.bg}`}>
            <div className={`container-fluid d-flex align-items-center justify-content-center h-100`}>
                <div className={`${styles.loginFormContainer} my-auto`}>
                    <fieldset className="border p-3 rounded">

                        {isDisplay && message && (
                            <div
                                className={`alert fade show d-flex ${message.type}`}
                                role="alert" >
                                {message.data}
                                <span
                                    aria-hidden="true"
                                    className="ml-auto cursor-pointer"
                                    onClick={() => setMessage(null)} >
                                    &times;
                                </span>
                            </div>
                        )}

                        <legend className={` border rounded p-1 text-center`} >
                            Reset Password
                        </legend>
                        <hr />
                        <Form onSubmit={handleSubmit(onSubmit)}>
                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    name="password"
                                    type="password"
                                    placeholder="Password"
                                    onChange={e => handleInputChange(e)}
                                    {...register("password", { required: true })} />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
                                <Form.Label>Confirm Password</Form.Label>
                                <Form.Control
                                    name="confirmPassword"
                                    type="password"
                                    placeholder="Password"
                                    onChange={e => handleInputChange(e)}
                                    {...register("confirmPassword", { required: true })}
                                />
                            </Form.Group>
                            <hr />
                            <Button onClick={() => onSubmit()}
                                style={{
                                    backgroundColor: colour.c5,
                                    color: colour.c1,
                                    width: '100%',
                                }}
                                className="w-100">
                                Reset Password
                            </Button>

                        </Form>
                    </fieldset>
                </div>
            </div>
        </div >
    );
}

export default ResetPasswordV2;