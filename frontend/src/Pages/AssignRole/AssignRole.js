import { React, useState, useEffect } from 'react';
import 'react-phone-input-2/lib/style.css'
import axios from 'axios';
import config from '../../Config.js';
import { makeStyles, Paper, IconButton, Button } from '@material-ui/core';
import { decodeToken } from 'react-jwt';
import Select from 'react-select';
import { Row } from 'react-bootstrap'
import { useHistory } from 'react-router';
import Title from '../../Components/Title/Title'

//components
import TopBar from '../../Components/TopBar/TopBar.js';
import StyledButton from '../../Components/StyledButton/StyledButton'
import colour from '../../Components/Colours/Colours'


const AssignRole = ({ match }) => {
    const token = localStorage.getItem('token')
    const userId = match.params.userId;
    const companyId = decodeToken(token).companyId
    const history = useHistory()

    //states
    const [allRoles, setAllRoles] = useState([])
    const [userRoles, setUserRoles] = useState([])
    const onChange = userRoles => setUserRoles(userRoles);
    useEffect(() => {
        axios.get(`${config.baseUrl}/u/user/checkuser/?userId=${userId}&companyId=${companyId}`, //check if accessed user belongs to the company
            {})
            .then(response => {
                var data = response.data
                if (data.length == 0) {
                    history.push('/dashboard')
                    alert('User does not exist.')
                }
            }).catch(error => {
                console.log(error);
            });
        axios.get(`${config.baseUrl}/u/role/getallroles/${companyId}`, // get all roles from the company
            {})
            .then(response => {
                const rolesData = response.data.data.map(oneData => ({ value: oneData.role_id, label: oneData.name }));
                setAllRoles(allRoles.concat(rolesData));
                axios.get(`${config.baseUrl}/u/role/getuserrole/${userId}`, // get user roles
                    {})
                    .then(response => {
                        var data = response.data.data
                        var userRole = []
                        var roles = []
                        for (var i = 0; i < rolesData.length; i++) { //push all the roles from the company into array to do indexOf function
                            roles.push(rolesData[i].value)
                        }
                        for (var i = 0; i < data.length; i++) {
                            if (roles.indexOf(data[i].role_id) != -1) { //check which roles collides and set them as selected to preselect these roles
                                userRole.push(rolesData[roles.indexOf(data[i].role_id)])
                            }
                        }
                        setUserRoles(userRole) //set user roles
                    }).catch(error => {
                        console.log(error);
                    });
            }).catch(error => {
                console.log(error);
            });

    }, [])

    const useStyles = makeStyles({
        //local style
        formContainer: {
            backgroundColor: colour.c3,
            overflow: 'hidden',
            minHeight: 250
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
            marginTop: 50,
            marginBottom: 20,
            margin: 'auto'
        }
    })
    const classes = useStyles()

    //style for select
    const selectStyle = {
        option: styles => ({ ...styles, color: 'black' }),
        control: base => ({ ...base, minHeight: 100, alignContent: 'flex-start' }),
        multiValueRemove: styles => ({ ...styles, color: 'white' }),
        multiValue: styles => ({ ...styles, backgroundColor: colour.c5 }),
        multiValueLabel: styles => ({ ...styles, color: 'white' }),
    }

    //submit
    const onSubmit = () => {
        axios.put(`${config.baseUrl}/u/role/updateuserrole/${userId}`,
            {
                data: userRoles
            })
            .then(response => {
                alert('Roles has been assigned.')
                history.push(`/manageusers`);
            }).catch(error => {

                if (error.response.status == 500) {
                    alert('err in assigning role');
                }
                window.location.href = '/dashboard'
            });
    }

    return (
        <div>
            <Title title="Assign Role"/>
            <TopBar pageName='Assign Role' />
            <Paper className={classes.formContainer}>
                <form className={classes.form}>
                    <Select
                        closeMenuOnSelect={false}
                        name="Roles"
                        id="Roles"
                        styles={selectStyle}
                        value={userRoles}
                        options={allRoles}
                        onChange={onChange}
                        isMulti
                        maxMenuHeight={125}
                        menuPlacement="auto"
                    />
                </form>
                <Row >
                    <div className={classes.btnContainer}>
                        <Button onClick={() => onSubmit()} className={classes.removeOutline} style={{ backgroundColor: colour.c5, color: colour.c1, marginRight: 10, padding: 10 }}>Submit</Button>
                        <Button onClick={() => history.push(`/manageusers`)} className={classes.removeOutline} style={{ backgroundColor: colour.c5, color: colour.c1, marginLeft: 10, padding: 10 }}>Cancel</Button>
                    </div>
                </Row>
            </Paper>
        </div >
    );
};
export default AssignRole

