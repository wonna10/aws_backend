import React, { useState, useMemo, useEffect } from 'react';
import { makeStyles } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import countryList from 'react-select-country-list'
import Select from 'react-select';
import axios from 'axios';
import config from '../../Config';
import Title from '../../Components/Title/Title'
import PhoneInput from 'react-phone-input-2'
import { decodeToken } from "react-jwt";
import 'react-phone-input-2/lib/style.css'
import { useForm, Controller } from 'react-hook-form';
import { Row } from 'react-bootstrap'

//import Components
import colour from '../../Components/Colours/Colours'
import TopBar from '../../Components/TopBar/TopBar'
import StyledButton from '../../Components/StyledButton/StyledButton'



const Company = () => {
    const token = localStorage.getItem('token')
    const company_id = decodeToken(token).companyId
    const { register, handleSubmit, control, errors } = useForm()
    const history = useHistory();
    if (decodeToken(token).privId != 2) {
        alert('You do not have the privilege to view this page.')
        history.push('/dashboard')
    }
    const countryOptions = useMemo(() => countryList().getData(), [])
    //States
    const [contactValid, setContactValid] = useState('')
    const [country, setCountry] = useState('')
    const [Data, setData] = useState({
        name: null,
        description: null,
        email: null,
        contact_number: null,
        postal_code: null,
        state: null,
        street: null,
    })

    //regex
    const regex = new RegExp(/65[6|8|9]\d{7}/g)

    //Styles
    const useStyles = makeStyles({
        //local style
        formContainer: {
            backgroundColor: colour.c3,
            color: colour.c1,
            borderRadius: "5px",
            boxShadow: "0px 5px 5px rgba(00,00,00,0.2)",
        },
        form: {
            width: '80%',
            margin: 'auto',
            color: 'white',
            padding: '20px'
        },
        formField: {
            marginBottom: 30,
        },
        btnContainer: {
            marginTop: 20,
            marginBottom: 20,
            margin: 'auto'
        },
        errorMessage: {
            color: colour.error
        }

    })
    const classes = useStyles()

    //Select Style
    const selectStyle = {
        option: styles => ({ ...styles, color: 'black' })
    }

    useEffect(() => {
        axios.get(`${config.baseUrl}/u/company/getcompanydata/${company_id}`,
        )
            .then(response => {
                let data = response.data[0]
                for (var i = 0; i < countryOptions.length; i++) {
                    if (countryOptions[i].label === data.country) {
                        setCountry(countryOptions[i])
                    }
                }
                setData({
                    name: data.name,
                    description: data.description,
                    email: data.email,
                    contact_number: data.contact_number.toString(),
                    state: data.state,
                    street: data.street,
                    postal_code: data.postal_code
                })
            }).catch(error => {
                console.log(error)
                alert('Error when submitting, please try again.')
            });
    }, []);

    //Handle the form submit of Registration form
    const onSubmit = (data) => {
        //validate contact
        if (Data.contact_number == '') {
            console.log('empty')
            setContactValid('empty')
            return
        } else if (regex.test(Data.contact_number) == true) {
            console.log('pass')
            setContactValid('pass')
        } else {
            console.log('fail')
            setContactValid('fail')
            return
        }
        data.contact_number = Data.contact_number
        data.country = country
        axios.put(`${config.baseUrl}/u/company/updatecompany/${company_id}`,
            { data }
        )
            .then(response => {
                alert('Submit Ok')
                alert('Successfully Updated')
                history.push(`/dashboard`);
            }).catch(error => {
                console.log(error)
                alert('Error when submitting, please try again.')
            });
    }// End of onSubmit
    https://stackoverflow.com/questions/62574713/react-form-hooks-how-to-validate-select-option
    console.log(Data)
    return (
        <div>
            <TopBar pageName="Company" />
            <Title title="Company"></Title>
            <div className={classes.formContainer} >
                <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
                    <div className={classes.formField}>
                        <label htmlFor="name">Company Name</label>
                        <input
                            name="name"
                            type='text'
                            defaultValue={Data.name}
                            className="form-control"
                            placeholder="Enter Name"
                            ref={register({ required: { value: true, message: "Please input company name" } })}
                        />
                        {errors.name && <p className={classes.errorMessage}>{errors.name.message}</p>}
                    </div>

                    <div className={classes.formField}>
                        <label htmlFor="description">Company Description</label>
                        <input
                            name="description"
                            className="form-control"
                            type='text'
                            defaultValue={Data.description}
                            placeholder="Enter Name"
                            ref={register({ required: { value: true, message: "Please input company name" } })}
                        />
                        {errors.description && <p className={classes.errorMessage}>{errors.description.message}</p>}
                    </div>

                    <div className={classes.formField}>
                        <label htmlFor="email">Company Email</label>
                        <input
                            name="email"
                            className="form-control"
                            type='email'
                            defaultValue={Data.email}
                            placeholder="Enter Email"
                            ref={register({ required: { value: true, message: "Please input company name" } })}
                        />
                        {errors.email && <p className={classes.errorMessage}>{errors.email.message}</p>}
                    </div>

                    <div className={classes.formField}>
                        <label htmlFor="contact">Company Contact Number</label>
                        <Controller
                            name="contact"
                            control={control}
                            render={() => (
                                <PhoneInput
                                    dropdownStyle={{ 'color': "black" }}
                                    enableSearch
                                    value={Data.contact_number}
                                    onChange={e => setData(prevState => ({
                                        ...prevState,
                                        contact_number: e
                                    }))}
                                    name="contact"
                                    country="sg"
                                />
                            )}
                        />
                        {contactValid == 'empty' && <p className={classes.errorMessage}>Please input company contact number</p>}
                        {contactValid == 'fail' && <p className={classes.errorMessage}>Company contact number invalid</p>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="countryInput">Select Country</label>
                        <Select options={countryOptions}
                            styles={selectStyle}
                            name="country"
                            register={register}
                            value={country}
                            onChange={setCountry}
                        />
                    </div>

                    <div className={classes.formField}>
                        <label htmlFor="state">State</label>
                        <input
                            name="state"
                            type='text'
                            className="form-control"
                            defaultValue={Data.state}
                            placeholder="Enter Name"
                            ref={register({ required: { value: true, message: "Please input company's state" } })}
                        />
                        {errors.state && <p className={classes.errorMessage}>{errors.state.message}</p>}
                    </div>

                    <div className={classes.formField}>
                        <label htmlFor="street">Street</label>
                        <input
                            name="street"
                            type="text"
                            className="form-control"
                            defaultValue={Data.street}
                            placeholder="Enter Name"
                            ref={register({ required: { value: true, message: "Please input company's street" } })}
                        />
                        {errors.street && <p className={classes.errorMessage}>{errors.street.message}</p>}
                    </div>

                    <div className={classes.formField}>
                        <label htmlFor="postalcode">Postal Code</label>
                        <input
                            name="postalcode"
                            type="numbers"
                            defaultValue={Data.postal_code}
                            className="form-control"
                            placeholder="Enter Name"
                            ref={register({ required: { value: true, message: "Please input company's postal" } })}
                        />
                        {errors.postalcode && <p className={classes.errorMessage}>{errors.postalcode.message}</p>}
                    </div>
                    <Row>
                        <div style={{ margin: 'auto' }}>
                            <StyledButton text="Submit" type='submit' event={() => { }} />
                            <StyledButton text="Cancel" event={() => { history.push('/dashboard') }} style={{ marginLeft: 20 }} />
                        </div>
                    </Row>
                </form>
            </div>
        </div>
    );
};

export default Company;