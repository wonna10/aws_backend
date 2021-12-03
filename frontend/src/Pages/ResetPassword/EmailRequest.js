import React, { useState } from "react";
import axios from 'axios';
import { useHistory } from "react-router-dom";
import { Form, Button, Container } from "react-bootstrap";
import styles from './ResetPassword.module.css';
import { useForm } from 'react-hook-form';

import colour from '../../Components/Colours/Colours'
import config from '../../Config.js';


function EmailRequest() {
  const history = useHistory();
  const { register, handleSubmit } = useForm();
  const [userCredential, setUserCredential] = useState({ email: "sohwk@gmail.com" });
  const [message, setMessage] = useState({ data: '', type: '' });
  const [isDisplay, setIsDisplay] = useState(false);
  // handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setUserCredential({
      ...userCredential,
      [name]: value
    })
  };

  const onSubmit = () => {
    console.log(userCredential.email);
    axios.post(`${config.baseUrl}/auth/resetPasswordEmail`, { email: userCredential.email })
      .then(response => {
        setMessage({
          data: 'Your email has been sent. Please check your email for link to reset your password.',
          type: 'alert-success'
        });
        setIsDisplay(true);
      })
      .catch(error => {
        console.log(error);
        setMessage({
          data: 'Something went wrong. Please try again later.',
          type: 'alert-danger'
        });
        setIsDisplay(true);
      })
    // history.push(`/TokenInput`)
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

            <legend className={`border rounded p-1 text-center`} >
             Request Email
            </legend>
            <hr />
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Form.Group className="my-4" controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  name="email"
                  type="email"
                  placeholder="Enter email"
                  defaultValue={userCredential.email}
                  onChange={e => handleInputChange(e)}
                  {...register("email", { required: true })} />
              </Form.Group>
              <hr />

              <Button
                onClick={() => onSubmit()}
                style={{
                  backgroundColor: colour.c5,
                  color: colour.c1,
                  width: '100%',
                }}
                className="mt-4 w-100">
                Reset
              </Button>

            </Form>
          </fieldset>
        </div>
      </div>
    </div>
  );
}

export default EmailRequest;