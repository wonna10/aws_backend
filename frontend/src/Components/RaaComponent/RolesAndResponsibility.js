import React from 'react';
import { makeStyles, Paper, TextField } from '@material-ui/core';
import colour from '../Colours/Colours'
import axios from 'axios';
import MaterialTable from 'material-table'
import tableIcons from '../MUITableIcons/material.table.icons'
import config from '../../Config.js';

const useStyles = makeStyles({
    //local style
    table: {
        marginTop: 30,
        margin: 'auto',
        boxShadow: "0px 5px 5px rgba(00,00,00,0.2)",
        "& > *": {
            backgroundColor: colour.c3,
            color: colour.c1 + '!important'
        },
        "& th > span": { color: colour.c1 + '!important' },
        // "& svg": { color: colour.c1 + '!important' },
        "& svg": { fill: colour.c1 },
        "& div": { color: colour.c1, borderBottom: colour.c1 + '!important' },
        "& td": { color: colour.c1 },
        borderRadius: 5,
        padding: 5,
        backgroundColor: colour.c3,
        "& .MuiPaper-elevation2": {
            boxShadow: "0 0 0"
        }
    },
    nameTextField: {
        width: 100,
        "& .MuiInputBase-root.Mui-disabled": {
            color: 'white',
        },
    },
    descriptionTextField: {
        width: 800,
        "& .MuiInputBase-root.Mui-disabled": {
            color: 'white',
        },
    },
})



const RolesAndResponsibility = (props) => {
    const classes = useStyles()

    const submitData = (data, company_id) => {
        axios.post(`${config.baseUrl}/u/role/createrole/${company_id}`, data)
            .then(response => {
    
            }).catch(error => {
                console.log(error);
            });
            setTimeout(function () {
                if (props.toggleSetData) {
                    props.setToggleSetData(false)
                }
                else {
                    props.setToggleSetData(true)
                }
            }, 1000);
    }
    
    const updateData = (data) => {
        axios.put(`${config.baseUrl}/u/role/updaterole/${data.role_id}`, data)
            .then(response => {
    
            }).catch(error => {
                console.log(error);
            });
    }
    
    const deleteData = (data) => {
        axios.delete(`${config.baseUrl}/u/role/deleterole/${data.role_id}`,
            {})
            .then(response => {
    
            }).catch(error => {
                console.log(error);
            });
    }
    const columns = () => [
        {
            title: "id",
            field: "role_id",
            hidden: true,
        },
        {
            title: 'Name',
            field: "name",
            sorting: false,
            initialEditValue: '',
            render: rowData => {
                return (
                    <TextField className={classes.nameTextField}
                        type="text"
                        wrap="hard"
                        white-space='pre-wrap'
                        value={rowData.name}
                        InputProps={{ disableUnderline: true }}
                        multiline
                        disabled
                    />
                );
            },
            editComponent: ({ value, onChange }) => {
                return (
                    <TextField className={classes.nameTextField}
                        type="text"
                        onChange={e => onChange(e.target.value)}
                        wrap="hard"
                        white-space='pre-wrap'
                        value={value}
                        multiline
                    />
                );
            },
            validate: rowData => rowData.name === '' ? { isValid: false, helperText: 'Required Field' } : true,
        },
        {
            title: 'Description',
            field: "description",
            sorting: false,
            initialEditValue: '',
            render: rowData => {
                return (
                    <TextField className={classes.descriptionTextField}
                        type="text"
                        wrap="hard"
                        white-space='pre-wrap'
                        value={rowData.description}
                        InputProps={{ disableUnderline: true }}
                        multiline
                        disabled
                    />
                );
            },
            editComponent: ({ value, onChange }) => {
                return (
                    <TextField className={classes.descriptionTextField}
                        type="text"
                        onChange={e => onChange(e.target.value)}
                        wrap="hard"
                        white-space='pre-wrap'
                        value={value}
                        multiline
                    />
                );
            },
            validate: rowData => rowData.description === '' ? { isValid: false, helperText: 'Required Field' } : true,
        },
    ];

    return (
        <Paper className={classes.table}>
            <MaterialTable
                icons={tableIcons}
                columns={columns()}
                data={props.Data}
                title='Roles And Responsibility'
                editable={{
                    onRowAdd: props.editable ? newData =>
                        new Promise((resolve, reject) => {
                            setTimeout(() => {
                                submitData(newData, props.company_id);
                                props.setData([...props.Data, newData]);
                                resolve();
                            }, 300)
                        }) : undefined,
                    onRowUpdate: props.editable ? (newData, oldData) =>
                        new Promise((resolve, reject) => {
                            setTimeout(() => {
                                updateData(newData)
                                const dataUpdate = [...props.Data];
                                const index = oldData.tableData.id;
                                dataUpdate[index] = newData;
                                props.setData([...dataUpdate]);
                                resolve();

                            }, 300)
                        }) : undefined,
                    onRowDelete: props.editable ? oldData =>
                        new Promise((resolve, reject) => {
                            setTimeout(() => {
                                const dataDelete = [...props.Data];
                                const index = oldData.tableData.id;
                                dataDelete.splice(index, 1);
                                props.setData([...dataDelete]);
                                deleteData(oldData)
                                resolve()
                            }, 300)
                        }) : undefined,
                }}
                options={{
                    draggable: false,
                    tableLayout: "auto",
                    search: false,
                    actionsColumnIndex: -1,
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
        </Paper>
    )
}

export default RolesAndResponsibility;