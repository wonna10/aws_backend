import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import countryList from 'react-select-country-list'
import { isValidPhoneNumber } from "react-phone-number-input";
import colour from '../../Components/Colours/Colours';
import { makeStyles, Button, Paper } from '@material-ui/core';
import Select from 'react-select';
import axios from 'axios';
import config from '../../Config';
import { useForm, Controller } from 'react-hook-form';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { decodeToken } from 'react-jwt';
import TopBar from '../../Components/TopBar/TopBar';
import { Row, Col } from 'react-bootstrap';
import Title from '../../Components/Title/Title';

const Register = ({ match }) => {
    const history = useHistory();
    const { register, handleSubmit, control, formState: { errors }, watch } = useForm();

    const token = match.params.token;
    const email = decodeToken(token).email
    const company_id = decodeToken(token).company_id
    const priv_id = decodeToken(token).priv_id
    const key = decodeToken(token).key

    const countryOptions = useMemo(() => countryList().getData(), [])

    const [userData, setUserData] = useState({
        firstName: "",
        lastName: "",
        email: email,
        contact: "",
        country: "",
        state: "",
        street: "",
        postalcode: "",
        priv_id: priv_id,
        company_id: company_id,
        key: key,
    })

    useEffect(() => { 
        axios.post(`${config.baseUrl}/u/user/checkemailandkey/`, //Check with database to see if param is a valid
          {
            data: {
              email: email,
              key: key
            }
          })
          .then(response => {
            console.log(response.data)
            if (response.data.length == 0) { 
              alert('This invitation link have expired or does not exist')
              window.location.assign('/login')
            }
          }).catch(error => {
            if (error.response.status == 500) {
              console.log(error);
            }
          });
      },[])

    const privOptions = [
        { value: 2, label: 'Super Admin' },
        { value: 3, label: 'Admin' },
        { value: 4, label: 'User' }
    ]

    const phoneValidation = (value) => {
        if (value == "") {
            return false
        }
        else {
            return isValidPhoneNumber('+' + value.toString())

        }
    }
    const onSubmit = (data, e) => {
        data.country = userData.country
        data.contact = userData.contact
        data.email = userData.email
        data.company_id = userData.company_id
        data.priv_id = userData.priv_id
        data.key = userData.key
        axios.post(`${config.baseUrl}/u/user/createuser`, { data })
            .then(response => {
                window.location.assign('/login')
                alert('Successfuly Created. You can now login.')
            }).catch(error => {
                if (error.response.status == 500) {
                    alert('error')
                }
                if (error.response.status == 401) {
                    alert('Invitation Link has expired.')
                }
            })
    }// End of onSubmit

    const useStyles = makeStyles({
        //local style
        formContainer: {
            backgroundColor: colour.c3,
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
        btnContainer: {
            marginTop: 20,
            marginBottom: 50,
            margin: 'auto'
        }

    })
    const classes = useStyles()

    const selectStyle = {
        option: styles => ({ ...styles, color: 'black' })
    }


    return (
        <div>
            <Title title="Register"/>
            <TopBar pageName='Register' />
            <Paper className={classes.formContainer}>
                <form className={classes.form} onSubmit={handleSubmit(onSubmit)} noValidate autoComplete="off">
                    <div className="form-group">
                        <label htmlFor="emailInput">Email</label>
                        <span className="mandatory">*</span>
                        <input
                            id="emailInput"
                            defaultValue={userData.email}
                            name="email"
                            type="email"
                            className="form-control"
                            aria-describedby="Enter email"
                            disabled
                            placeholder="Enter email"
                            ref={register({
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Invalid email address"
                                },
                                required: {
                                    type: "email",
                                    value: true,
                                    message: 'Please enter your email.',
                                },
                            })}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="firstNameInput">First Name</label>
                        <span className="mandatory">*</span>
                        <input
                            id="firstNameInput"
                            name="firstName"
                            type="text"
                            className="form-control"
                            aria-describedby="Enter first name"
                            placeholder="Enter first name"
                            ref={register({
                                required: {
                                    value: true,
                                    message: 'Please enter your first name.',
                                },
                            })}
                        />
                        {errors["firstName"] && (
                            <p className="error-message">Please enter first name</p>
                        )}
                    </div>
                    <div className="form-group">
                        <label htmlFor="lastNameInput">Last Name</label>
                        <span className="mandatory">*</span>
                        <input
                            id="lastNameInput"
                            name="lastName"
                            type="text"
                            className="form-control"
                            aria-describedby="Enter last name"
                            placeholder="Enter last name"
                            ref={register({
                                required: {
                                    value: true,
                                    message: 'Please enter your last name.',
                                },
                            })}
                        />
                        {errors["lastName"] && (
                            <p className="error-message">Please enter last name</p>
                        )}
                    </div>
                    <div className="form-group">
                        <label htmlFor="passwordInput">Password</label>
                        <span className="mandatory">*</span>
                        <input
                            type="password"
                            name="password"
                            className="form-control"
                            id="passwordInput"
                            placeholder="Enter password"
                            ref={register({
                                required: {
                                    value: true,
                                    message: 'Please enter password',
                                },
                                minLength: {
                                    value: 6,
                                    message: 'Minimum 5 characters are allowed',
                                },
                            })}
                        />
                        {errors["password"] && (
                            <p className="error-message">Password length must be a minimum of 5 characters</p>
                        )}
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirmPasswordInput">Confirm Password</label>
                        <span className="mandatory">*</span>
                        <input
                            type="password"
                            name="confirmPassword"
                            className="form-control"
                            id="confirmPasswordInput"
                            placeholder="Enter confirm password"
                            ref={register({
                                validate: (value) => value === watch('password') || "Passwords don't match.",
                                required: {
                                    value: true,
                                    message: 'Please enter password',
                                },
                                minLength: {
                                    value: 5,
                                    message: 'Minimum 5 characters are allowed',
                                },
                            })}
                        />
                        {errors["confirmPassword"] && (
                            <p className="error-message">Field is empty or password does not match</p>
                        )}
                    </div>
                    <div className="form-group">
                        <label htmlFor="contactInput">Contact Number</label>
                        <span className="mandatory">*</span>
                        <Controller
                            name="contact"
                            control={control}
                            rules={{
                                validate: (value) => phoneValidation(userData.contact)
                            }}
                            render={() => (
                                <PhoneInput
                                    dropdownStyle={{ 'color': "black" }}
                                    enableSearch
                                    onChange={e => setUserData(prevState => ({
                                        ...prevState,
                                        contact: e
                                    }))}
                                    name="contact"
                                    country="sg"
                                />
                            )}
                        />
                        {errors["contact"] && (
                            <p className="error-message">Invalid Phone Number</p>
                        )}
                    </div>
                    <div className="form-group">
                        <label htmlFor="countryInput">Select Country</label>
                        <span className="mandatory">*</span>
                        <Select options={countryOptions}
                            styles={selectStyle}
                            name="country"
                            register={register}
                            onChange={e => setUserData(prevState => ({
                                ...prevState,
                                country: e
                            }))}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="stateInput">State</label>
                        <span className="mandatory">*</span>
                        <input
                            id="stateInput"
                            name="state"
                            type="text"
                            className="form-control"
                            aria-describedby="Enter state"
                            placeholder="Enter state"
                            ref={register({
                                required: {
                                    value: true,
                                    message: 'Please enter state.',
                                },
                            })}
                        />
                        {errors["state"] && (
                            <p className="error-message">Please enter your state</p>
                        )}
                    </div>
                    <div className="form-group">
                        <label htmlFor="streetInput">Street</label>
                        <span className="mandatory">*</span>
                        <input
                            id="streetInput"
                            name="street"
                            type="text"
                            className="form-control"
                            aria-describedby="Enter street"
                            placeholder="Enter street"
                            ref={register({
                                required: {
                                    value: true,
                                    message: 'Please enter street.',
                                },
                            })}
                        />
                        {errors["street"] && (
                            <p className="error-message">Please enter your street</p>
                        )}
                    </div>
                    <div className="form-group">
                        <label htmlFor="postalcodeInput">Postal Code</label>
                        <span className="mandatory">*</span>
                        <input
                            id="postalcodeInput"
                            name="postalcode"
                            type="number"
                            className="form-control"
                            aria-describedby="Enter postal code"
                            placeholder="Enter postal code"
                            ref={register({
                                required: {
                                    value: true,
                                    message: 'Please enter postal code.',
                                },
                            })}
                        />
                        {errors["postalcode"] && (
                            <p className="error-message">Please enter your postal code</p>
                        )}
                    </div>
                    <Row >
                        <div className={classes.btnContainer}>
                            <Button type="submit" style={{ backgroundColor: colour.c5, color: colour.c1, marginRight: 10, padding: 10 }}>Submit</Button>
                            <Button onClick={() => history.push(`/manageusers`)} className={classes.removeOutline} style={{ backgroundColor: colour.c5, color: colour.c1, marginLeft: 10, padding: 10 }}>Cancel</Button>
                        </div>
                    </Row>
                </form>
            </Paper>
        </div>
    );
};
export default Register;
