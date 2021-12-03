import React, { useState, useEffect } from 'react';
import { Paper, makeStyles, Modal } from '@material-ui/core';
import colour from '../../Components/Colours/Colours'
import StyledButton from '../../Components/StyledButton/StyledButton'
import axios from 'axios';
import config from '../../Config.js';
import TopBar from '../../Components/TopBar/TopBar';
import { decodeToken } from "react-jwt";
import { useHistory } from 'react-router';
import ModalPopup from '../../Components/ModalPopup/ModalPopup';
import Title from '../../Components/Title/Title'

//table
import MaterialTable from 'material-table'
import tableIcons from '../../Components/MUITableIcons/material.table.icons'



const useStyles = makeStyles({
    //local style
    table: {
        padding: 5,
        backgroundColor: colour.c3,
        boxShadow: "0px 5px 5px rgba(00,00,00,0.2)",
        "& > *": {
            backgroundColor: colour.c3,
            color: colour.c1 + '!important',
            boxShadow: " 0 0 0"
        },
        "& th > span": { color: colour.c1 + '!important' },
        // "& svg": { color: colour.c1 + '!important' },
        "& svg": { fill: colour.c1 },
        "& div": { color: colour.c1, borderBottom: colour.c1 + '!important' },
        "& td ": { color: colour.c1 }
    },
    boxContainer: {
        "& > button": {
            marginRight: 5,
            marginBottom: 5,
            marginTop: 5
        }
    }
})


const ManageUsers = () => {
    const history = useHistory()
    const [userData, setUserData] = useState();
    const token = localStorage.getItem('token')
    const company_id = decodeToken(token).companyId
    if (decodeToken(token).privId > 3) {
        alert('You do not have the privilege to view this page.')
        history.push('/dashboard')
    }
    const eventHandler = (page, id) => {
        history.push(`/${page}/${id}`)
    }
    //get user data
    useEffect(() => {
        axios.get(`${config.baseUrl}/u/user/getalluserdata/${company_id}`,
            {})
            .then(response => {
                setUserData(response.data.data)
            }).catch(error => {
                console.log(error);
            });
    }, []);

    //table col
    const columns = () => [
        {
            title: "id",
            field: "user_id",
            hidden: true,
        },
        {
            title: "Name",
            field: "name",
            editable: 'never',
        },
        {
            title: "Email",
            field: "email",
            defaultSort: 'asc',
        },
        {
            title: "Contact Number",
            field: "contact_number",
        },
        {
            title: "Status",
            field: "user_status",
            lookup: { 0: "Terminated", 1: "Active" }

        },
        {
            title: "Action",
            align: 'left',
            width: '25%',
            render: rowData =>
                <div className={classes.boxContainer}>
                    <ModalPopup rowData={rowData} Data={userData} setData={setUserData} />
                    <StyledButton text="Assign Role" event={() => eventHandler('assignrole', rowData.gu_id)} />
                    <StyledButton text="Edit Details" event={() => eventHandler('edituser', rowData.gu_id)} />
                    <StyledButton text="Reset Password" event={() => eventHandler('resetpassword', rowData.gu_id)} />
                </div>
        }]

    const classes = useStyles()

    return (
        <div>
            <Title title="Manage Users" />
            <TopBar pageName='Manage Users' />
            <Paper className={classes.table}>
                <MaterialTable
                    icons={tableIcons}
                    columns={columns()}
                    data={userData}
                    title=""
                    options={{
                        tableLayout: "auto",
                        draggable: false,
                        headerStyle: {
                            backgroundColor: colour.c3,
                            borderTop: 'solid',
                            borderBottom: 'solid',
                            borderWidth: 2,
                            color: colour.c1
                        },
                        rowStyle: {
                            borderColor: '#ff0000'
                        },
                    }}
                />
            </Paper >
        </div>
    );
};

export default ManageUsers;
