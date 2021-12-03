import React, { useState, useEffect } from 'react';
import { makeStyles, Paper, Button } from '@material-ui/core';
import colour from '../../Components/Colours/Colours'
import StyledButton from '../../Components/StyledButton/StyledButton'
import { Row, Col } from 'react-bootstrap';
import axios from 'axios';
import config from '../../Config.js';
import TopBar from '../../Components/TopBar/TopBar';
import { decodeToken } from "react-jwt";
import { useHistory } from 'react-router';
import Title from '../../Components/Title/Title'

//table
import MaterialTable from 'material-table'
import tableIcons from '../../Components/MUITableIcons/material.table.icons'


const ManageInvites = () => {
    const token = localStorage.getItem('token')
    const company_id = decodeToken(token).companyId
    const [userData, setUserData] = useState();
    const history = useHistory();

    if (decodeToken(token).privId > 3) {
        alert('You do not have the privilege to view this page.')
        history.push('/dashboard')
    }

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
            "& table tbody tr td.MuiTableCell-body": { colour: colour.c1 }
        },
        boxContainer: {
            "& > button": {
                marginRight: 10,
                marginBottom: 5,
                marginTop: 5
            }
        },
    })
    const classes = useStyles()

    useEffect(() => {
        axios.get(`${config.baseUrl}/u/user/getuserinvitelist/${company_id}`,
            {})
            .then(response => {
                setUserData(response.data)
            }).catch(error => {
                console.log(error);
            });
    }, []);//End of useEffect({function code,[]})

    const resendInvite = (email, company_id, priv_id) => {
        axios.post(`${config.baseUrl}/u/user/resendinvite/`,
            {
                data: {
                    email: email,
                    company_id: company_id,
                    priv_id: priv_id
                }
            })
            .then(response => {
                alert('Invite has been resend.')
            }).catch(error => {
                console.log(error);
            });
    }

    const deleteInvite = (email) => {
        axios.delete(`${config.baseUrl}/u/user/deleteinvite/${email}`,
            {
            })
            .then(response => {
                alert('Invite has been deleted')
                setUserData(userData.filter((data) => { return data.email != email }))
            }).catch(error => {
                console.log(error);
            });
    }

    const columns = () => [
        {
            title: "Email",
            field: "email",
        },
        {
            title: "company_id",
            field: "company_id",
            hidden: true
        },
        {
            title: "priv_id",
            field: "priv_id",
            hidden: true
        },
        {
            title: "Action",
            align: 'center',
            render: rowData =>
                <div className={classes.boxContainer}>
                    <StyledButton text="Resend Invite Link" event={() => resendInvite(rowData.email, rowData.company_id, rowData.priv_id)} />
                    <StyledButton text="Delete Invite Link" event={() => deleteInvite(rowData.email)} />
                </div>
        },

    ];



    return (
        <div className='manageinvite'>
            <Title title= "Manage Invite Link"/>
            <TopBar pageName='Manage Invite Link' />
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
                            borderColor: '#ff0000',
                            color: colour.c1
                        },
                    }}

                />
                <Row style={{ margin: 'auto' }}>
                    <Col>
                        <div>
                            <StyledButton style={{ marginTop: 10, marginBottom: 10 }} text="Send Invites" event={() => history.push('/sendinvites')}></StyledButton>
                        </div>
                    </Col>
                </Row>
            </Paper >
        </div>
    );
}

export default ManageInvites;