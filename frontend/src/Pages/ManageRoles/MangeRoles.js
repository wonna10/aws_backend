import React, { useState, useEffect } from 'react';
import { makeStyles, Paper, Button } from '@material-ui/core';
import colour from '../../Components/Colours/Colours'
import StyledButton from '../../Components/StyledButton/StyledButton'
import Title from '../../Components/Title/Title'
import axios from 'axios';
import config from '../../Config.js';
import TopBar from '../../Components/TopBar/TopBar';
import { decodeToken } from "react-jwt";
import { useHistory } from 'react-router';
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
        "& div": { color: colour.c1, borderBottom: colour.c1 + '!important' }
    },
    boxContainer: {
        "& > button": {
            marginRight: 10,
            marginBottom: 5,
            marginTop: 5
        }
    },
    btnContainer: {
        backgroundColor: colour.c4,
        paddingBottom: 10,
        float: 'right'
    },
    btn: {
        backgroundColor: colour.c5,
        color: colour.c1,
        '&:hover': {
            backgroundColor: colour.c5,
        }

    }
})

const ManageRoles = () => {
    const token = localStorage.getItem('token')
    const company_id = decodeToken(token).companyId
    const [Data, setData] = useState();
    const history = useHistory();
    if (decodeToken(token).privId > 3) {
        alert('You do not have the privilege to view this page.')
        history.push('/dashboard')
    }
    const eventHandler = (page, id) => {
        history.push(`/${page}/${id}`)
    }

    useEffect(() => {
        axios.get(`${config.baseUrl}/u/role/getallroles/${company_id}`,
            {})
            .then(response => {
                setData(response.data.data)
            }).catch(error => {
                console.log(error);
            });
    }, []);//End of useEffect({function code,[]})

    const columns = () => [
        {
            title: "id",
            field: "role_id",
            hidden: true,
            defaultSort: 'asc',
        },
        {
            title: "Name",
            field: "name",
            editable: 'never',
        },
        {
            title: "Description",
            field: "description",
        },
        {
            title: "Action",
            align: 'center',
            render: rowData => <StyledButton text="Edit Details" event={() => eventHandler('editrole', rowData.role_id)} />
        },

    ];

    const classes = useStyles()

    return (
        <div>
            <Title title= "Manage Role Rights"/>
            <TopBar pageName='Manage Role Rights' />
            <Paper className={classes.table}>
                <MaterialTable

                    icons={tableIcons}
                    columns={columns()}
                    data={Data}
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
                        }
                    }}

                />
            </Paper >
        </div>
    );
}

export default ManageRoles;