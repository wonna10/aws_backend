import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import Select from 'react-select'
import { Paper, makeStyles, Button } from '@material-ui/core';
import { decodeToken } from "react-jwt";
import { useForm } from "react-hook-form";
import { Row } from 'react-bootstrap';
import config from '../../Config';
import colour from '../../Components/Colours/Colours';
import TopBar from '../../Components/TopBar/TopBar';
import Title from '../../Components/Title/Title'



const EditRole = ({ match }) => {
    const { register, handleSubmit, errors, watch, setValue } = useForm();
    const history = useHistory();
    const token = localStorage.getItem('token')
    const company_id = decodeToken(token).companyId
    const role_id = match.params.roleId;
    if (decodeToken(token).privId > 3) {
        alert('You do not have the privilege to view this page.')
        history.push('/dashboard')
    }
    const [Data, setData] = useState({
        name: null,
        description: null,
        swot_rights: null,
        ip_rights: null,
        ror_rights: null,
        qms_rights: null,
        policy_rights: null,
        oap_rights: null,
        raa_rights: null,
        scope_rights: null,
        nr_rights: null,
        td_rights: null,
    })

    const defaultValue = (data, roleData) => {
        if (data == undefined) {
            return roleData
        }
    }


    const handlingOptions = [
        { value: 0, label: 'No Permission' },
        { value: 1, label: 'Can Edit' },
        { value: 2, label: 'Can Handle' },
        { value: 3, label: 'Can do both' },
    ];

    const options = [
        { value: 0, label: 'No Permission' },
        { value: 1, label: 'Can Edit' },
    ]

    useEffect(() => {
        axios.get(`${config.baseUrl}/u/role/checkrole/?roleId=${role_id}&companyId=${company_id}`,
            {})
            .then(response => {
                var data = response.data
                if (data.length == 0) {
                    history.push('/dashboard')
                    alert('Role does not exist.')
                }
            }).catch(error => {
                console.log(error);
            });

        axios.get(`${config.baseUrl}/u/role/getonerole/${role_id}`,
            {})
            .then(response => {
                var data = response.data.data
                setData({
                    name: data[0].name,
                    description: data[0].description,
                    swot_rights: handlingOptions[data[0].swot_rights],
                    ip_rights: handlingOptions[data[0].ip_rights],
                    ror_rights: handlingOptions[data[0].ror_rights],
                    qms_rights: handlingOptions[data[0].qms_rights],
                    policy_rights: handlingOptions[data[0].policy_rights],
                    oap_rights: handlingOptions[data[0].oap_rights],
                    raa_rights: options[data[0].raa_rights],
                    scope_rights: options[data[0].scope_rights],
                    nr_rights: options[data[0].nr_rights],
                    td_rights: options[data[0].td_rights],
                })
            }).catch(error => {
                console.log(error);
            });
    }, []);//End of useEffect({function code,[]})

    // Handle the form submit of role form
    const onSubmit = (data, e) => {
        axios.put(`${config.baseUrl}/u/role/updaterolerights/${role_id}`,
            {
                data: Data
            }
        )
            .then(response => {
                alert('Role has been updated.')
                history.push(`/manageroles`);
            }).catch(error => {
                if (error.response.status == 500) {
                    alert("Error!")
                }
            });
    } //End of onSubmit

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
        formGroup: {
            margin: 25
        },
        btnContainer: {
            marginTop: 75,
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
            <Title title= "Edit Role Rights"/>
            <TopBar pageName='Edit Role Rights' />
            <Paper className={classes.formContainer}>
                <form className={classes.form} onSubmit={handleSubmit(onSubmit)} noValidate autoComplete="off">
                    <div className={classes.formGroup}>
                        <label htmlFor="nameInput">Name</label>
                        <input
                            id="nameInput"
                            name="name"
                            defaultValue={Data.name}
                            type="text"
                            className="form-control"
                            ref={register()}
                            disabled
                        />
                    </div>
                    <div className={classes.formGroup}>
                        <label htmlFor="descriptionInput">Description</label>
                        <input
                            id="descriptionInput"
                            name="description"
                            defaultValue={Data.description}
                            type="text"
                            className="form-control"
                            ref={register()}
                            disabled
                        />
                    </div>
                    <div className={classes.formGroup}>
                        <label htmlFor="scopeInput">Scope Rights</label>
                        <Select
                            id="scopeInput"
                            options={options}
                            name="raa_rights"
                            ref={register()}
                            value={Data.scope_rights}
                            onChange={(value) => {
                                setData(prevState => ({
                                    ...prevState,
                                    scope_rights: value
                                }))
                            }}
                            styles={selectStyle}
                        />
                    </div>
                    <div className={classes.formGroup}>
                        <label htmlFor="nrInput">Normative References Rights</label>
                        <Select
                            id="nrInput"
                            options={options}
                            name="nr_rights"
                            ref={register()}
                            value={Data.nr_rights}
                            styles={selectStyle}
                            onChange={(value) => {
                                setData(prevState => ({
                                    ...prevState,
                                    nr_rights: value
                                }))
                            }}
                        />
                    </div>
                    <div className={classes.formGroup}>
                        <label htmlFor="tdInput">Terms and Definitions</label>
                        <Select
                            id="tdInput"
                            options={options}
                            name="td_rights"
                            ref={register()}
                            value={Data.td_rights}
                            styles={selectStyle}
                            onChange={(value) => {
                                setData(prevState => ({
                                    ...prevState,
                                    td_rights: value
                                }))
                            }}
                        />
                    </div>
                    <div className={classes.formGroup}>
                        <label htmlFor="sowtInput">SWOT Analysis Rights</label>
                        <Select
                            options={handlingOptions}
                            id="swotInput"
                            name="swot_rights"
                            ref={register()}
                            value={Data.swot_rights}
                            styles={selectStyle}
                            onChange={(value) => {
                                setData(prevState => ({
                                    ...prevState,
                                    swot_rights: value
                                }))
                            }}
                        />
                    </div>
                    <div className={classes.formGroup}>
                        <label htmlFor="ipInput">Interested Parties Rights</label>
                        <Select
                            id="ipInput"
                            options={handlingOptions}
                            name="ip_rights"
                            ref={register()}
                            value={Data.ip_rights}
                            styles={selectStyle}
                            onChange={(value) => {
                                setData(prevState => ({
                                    ...prevState,
                                    ip_rights: value
                                }))
                            }}
                        />
                    </div>
                    <div className={classes.formGroup}>
                        <label htmlFor="qmsInput">Scope of QMS Rights</label>
                        <Select
                            id="qmsInput"
                            options={handlingOptions}
                            name="qms_rights"
                            ref={register()}
                            value={Data.qms_rights}
                            styles={selectStyle}
                            onChange={(value) => {
                                setData(prevState => ({
                                    ...prevState,
                                    qms_rights: value
                                }))
                            }}
                        />
                    </div>
                    <div className={classes.formGroup}>
                        <label htmlFor="policyInput">Policy Rights</label>
                        <Select
                            id="policyInput"
                            options={handlingOptions}
                            name="policy_rights"
                            ref={register()}
                            value={Data.policy_rights}
                            styles={selectStyle}
                            onChange={(value) => {
                                setData(prevState => ({
                                    ...prevState,
                                    policy_rights: value
                                }))
                            }}
                        />
                    </div>
                    <div className={classes.formGroup}>
                        <label htmlFor="raaInput">Responsibility & Authority Rights</label>
                        <Select
                            id="raaInput"
                            options={options}
                            name="raa_rights"
                            ref={register()}
                            value={Data.raa_rights}
                            styles={selectStyle}
                            onChange={(value) => {
                                setData(prevState => ({
                                    ...prevState,
                                    raa_rights: value
                                }))
                            }}
                        />
                    </div>
                    <div className={classes.formGroup}>
                        <label htmlFor="rorInput">Register of Risk and Opportunities Rights</label>
                        <Select
                            id="rorInput"
                            options={handlingOptions}
                            name="ror_rights"
                            ref={register()}
                            value={Data.ror_rights}
                            styles={selectStyle}
                            onChange={(value) => {
                                setData(prevState => ({
                                    ...prevState,
                                    ror_rights: value
                                }))
                            }}
                        />
                    </div>
                    <div className={classes.formGroup}>
                        <label htmlFor="oapInput">Objective Achievement Rights</label>
                        <Select
                            id="oapInput"
                            options={handlingOptions}
                            name="oap_rights"
                            ref={register()}
                            value={Data.oap_rights}
                            styles={selectStyle}
                            onChange={(value) => {
                                setData(prevState => ({
                                    ...prevState,
                                    oap_rights: value
                                }))
                            }}
                        />
                    </div>
                    <Row >
                        <div className={classes.btnContainer}>
                            <Button type="submit" style={{ backgroundColor: colour.c5, color: colour.c1, marginRight: 10, padding: 10 }}>Submit</Button>
                            <Button onClick={() => history.push(`/manageroles`)} className={classes.removeOutline} style={{ backgroundColor: colour.c5, color: colour.c1, marginLeft: 10, padding: 10 }}>Cancel</Button>
                        </div>
                    </Row>
                </form>
            </Paper>
        </div>
    );
}

export default EditRole;