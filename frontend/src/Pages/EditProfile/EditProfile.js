import { React, useState, useEffect, useMemo } from 'react';
import Select from 'react-select-v2';
import countryList from 'react-select-country-list'
import { useForm, Controller } from 'react-hook-form';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { isValidPhoneNumber } from "react-phone-number-input";
import axios from 'axios';
import { decodeToken } from 'react-jwt';
import config from '../../Config.js';
import { useHistory, Link } from 'react-router-dom';
import { makeStyles, Paper, Button } from '@material-ui/core';
import { Row, Col } from 'react-bootstrap';
import TopBar from '../../Components/TopBar/TopBar.js';
import colour from '../../Components/Colours/Colours.js';
import Title from '../../Components/Title/Title';

const Profile = () => {
    const { register, handleSubmit, errors, control } = useForm();
    const history = useHistory();
    const countryOptions = useMemo(() => countryList().getData(), [])
    const token = localStorage.getItem('token')
    const user_id = decodeToken(token).userId
    const [firstName, setFirstName] = useState()
    const [lastName, setLastName] = useState()
    const [email, setEmail] = useState()
    const [contact, setContact] = useState()
    const [country, setCountry] = useState('')
    const [state, setState] = useState()
    const [street, setStreet] = useState()
    const [postalcode, setPostalCode] = useState()
    const [privilege, setPrivilege] = useState()

    useEffect(() => {
        axios.get(`${config.baseUrl}/u/user/getuserdata/${user_id}`,
            {})
            .then(response => {
                var data = response.data.data[0]
                for (var i = 0; i < countryOptions.length; i++) {
                    if (countryOptions[i].label === data.country) {
                        setCountry(countryOptions[i])
                    }
                }
                setFirstName(data.first_name)
                setLastName(data.last_name)
                setEmail(data.email)
                setContact(data.contact_number.toString())
                setState(data.state)
                setStreet(data.street)
                setPostalCode(data.postal_code)
                setPrivilege(privOptions[data.priv_id - 2])
            }).catch(error => {
                if (error.response.status == 500) {
                    alert("Error!")
                }
            });
    }, []);

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
        if (data.country == undefined) {
            data.country = country
        }
        data.contact = contact
        data.privilege = privilege
        axios.put(`${config.baseUrl}/u/user/updateuser/${user_id}`,
            {
                data: data
            })
            .then(response => {
                alert('Successfuly Updated')
                history.push(`/dashboard`);
            }).catch(error => {

                if (error.response.status == 500) {
                    alert('Error!')
                }

                if (error.response.status == 401) {
                    alert("This email has already been used.")
                }
                // Reset the form state
                e.target.reset();
            });
    }// End of onSubmit

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
        btnContainer: {
            marginTop: 20,
            marginBottom: 20,
            margin: 'auto'
        }

    })
    const classes = useStyles()

    const selectStyle = {
        option: styles => ({ ...styles, color: 'black' })
    }


    return (
        <div>
            <Title title="Profile"/>
            <TopBar pageName='Profile' />
            <Paper className={classes.formContainer}>
                <form className={classes.form} onSubmit={handleSubmit(onSubmit)} noValidate autoComplete="off">
                    <div className="form-group">
                        <label htmlFor="firstNameInput">First Name</label>
                        <span className="mandatory">*</span>
                        <input
                            id="firstNameInput"
                            name="firstName"
                            defaultValue={firstName}
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
                            defaultValue={lastName}
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
                        <label htmlFor="emailInput">Email</label>
                        <span className="mandatory">*</span>
                        <input
                            id="emailInput"
                            defaultValue={email}
                            name="email"
                            type="email"
                            required
                            className="form-control"
                            aria-describedby="Enter email"
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
                        {errors["email"] && (
                            <p className="error-message">Invalid Email</p>
                        )}
                    </div>
                    <div className="form-group">
                        <label htmlFor="contactInput">Contact Number</label>
                        <span className="mandatory">*</span>
                        <Controller
                            name="contact"
                            control={control}
                            rules={{
                                validate: (value) => phoneValidation(contact)
                            }}
                            render={() => (
                                <PhoneInput
                                    dropdownStyle={{ 'color': "black" }}
                                    enableSearch
                                    value={contact}
                                    onChange={setContact}
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
                            value={country}
                            onChange={setCountry}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="stateInput">State</label>
                        <span className="mandatory">*</span>
                        <input
                            id="stateInput"
                            name="state"
                            defaultValue={state}
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
                            defaultValue={street}
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
                            defaultValue={postalcode}
                            type="numbers"
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
                    {false && (
                        <div className="form-group">
                            <label htmlFor="privInput">Privilege</label>
                            <Select
                                options={privOptions}
                                name="privilege"
                                ref={register()}
                                value={privilege}
                                onChange={setPrivilege}
                                styles={selectStyle}
                            />
                        </div>
                    )}
                    <Row >
                        <div className={classes.btnContainer}>
                            <Button type="submit" style={{ backgroundColor: colour.c5, color: colour.c1, marginRight: 10, padding: 10 }}>Submit</Button>
                            <Button onClick={() => history.push(`/dashboard`)} className={classes.removeOutline} style={{ backgroundColor: colour.c5, color: colour.c1, marginLeft: 10, padding: 10 }}>Cancel</Button>
                        </div>
                    </Row>
                </form>
            </Paper>
        </div>
    );
};

export default Profile