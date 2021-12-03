import React, { useState, useRef } from 'react';
import { makeStyles, Paper, TextField } from '@material-ui/core';
import colour from '../Colours/Colours'
import StyledButton from '../StyledButton/StyledButton'
import axios from 'axios';
import { useHistory } from 'react-router';
import moment from 'moment';
import MaterialTable from 'material-table'
import tableIcons from '../MUITableIcons/material.table.icons'
import Download from '../Functions/Download';
import config from '../../Config.js';
const useStyles = makeStyles({
    //local style
    table: {
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
    titleTextField: {
        width: 100,
        "& .MuiInputBase-root.Mui-disabled": {
            color: 'white',
        },
    },
    editDescriptionTextField: {
        width: 250,
        "& .MuiInputBase-root.Mui-disabled": {
            color: 'white',
        },
    },
    renderDescriptionTextField: {
        width: 300,
        "& .MuiInputBase-root.Mui-disabled": {
            color: 'white',
        },
    },
})

const OrganisationChart = (props) => {
    const history = useHistory()
    const [file, setFile] = useState([]);
    const [fileName, setFileName] = useState('No File Choosen');
    const hiddenFileInput = useRef(null);
    const handleClick = event => {
        hiddenFileInput.current.click();
    };
    const addFiles = (event) => {
        setFile(event.target.files[0])
        setFileName(event.target.files[0].name)
    };
    const resetFile = () => {
        setFileName('')
        setFile([])
    }
    const submitData = (data) => {
        const formData = new FormData();
        formData.append(`file`, file);
        formData.append(`filename`, file.name);
        formData.append(`filetype`, file.type);
        formData.append('company_id', props.company_id);
        formData.append('submitted_by', props.user_id);
        formData.append('title', data.title);
        formData.append('description', data.description)

        axios.post(`${config.baseUrl}/u/org/submitorg/`, formData);
        resetFile()
        setTimeout(function () {
            if (props.toggleSetData) {
                props.setToggleSetData(false)
            }
            else {
                props.setToggleSetData(true)
            }
        }, 3000);
    }

    const deleteData = (id) => {
        axios.delete(`${config.baseUrl}/u/org/deleteorg/${id}`,
            {})
            .then(response => {

            }).catch(error => {
                console.log(error);
            });
    }
    const classes = useStyles()
    const columns = () => [
        {
            title: "id",
            field: "org_id",
            hidden: true,
        },
        {
            title: 'Title',
            field: "title",
            sorting: false,
            initialEditValue: '',
            render: rowData => {
                return (
                    <TextField className={classes.titleTextField}
                        type="text"
                        wrap="hard"
                        white-space='pre-wrap'
                        value={rowData.title}
                        InputProps={{ disableUnderline: true }}
                        multiline
                        disabled
                    />
                );
            },
            editComponent: ({ value, onChange }) => {
                return (
                    <TextField className={classes.titleTextField}
                        type="text"
                        onChange={e => onChange(e.target.value)}
                        wrap="hard"
                        white-space='pre-wrap'
                        value={value}
                        multiline
                    />
                );
            },
            validate: rowData => rowData.title === '' ? { isValid: false, helperText: 'Required Field' } : true,
        },
        {
            title: 'Description',
            field: "description",
            sorting: false,
            initialEditValue: '',
            render: rowData => {
                return (
                    <TextField className={classes.renderDescriptionTextField}
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
                    <TextField className={classes.editDescriptionTextField}
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
        {
            title: 'Submitted By',
            field: "submitted_by_name",
            sorting: false,
            editable: 'never',
            initialEditValue: props.user_name,
        },
        {
            title: 'Submitted On',
            field: "submitted_on",
            sorting: false,
            editable: 'never',
            initialEditValue: moment().format('MM/DD/YYYY'),
            render: rowData => {
                return moment(rowData.submitted_on).format('MM/DD/YYYY')
            }
        },
        {
            title: 'Details',
            field: 'cloudinary_file_url',
            sorting: false,
            align: 'left',
            initialEditValue: '',
            render: rowData => {
                return (
                    <StyledButton text="Download File" event={() => Download(rowData.file_id, rowData.original_file_name)} />
                )
            },
            editComponent: ({ value, onChange }) => {
                return (
                    <>
                        <div>
                            <StyledButton text="Upload File" event={() => handleClick()} />
                            <input
                                type="file"
                                ref={hiddenFileInput}
                                onChange={addFiles}
                                style={{ display: 'none' }}
                            />
                        </div>
                        <span>{fileName}</span>
                    </>
                )
            },
        },
    ];

    return (
        <Paper className={classes.table}>
            <MaterialTable
                icons={tableIcons}
                columns={columns()}
                data={props.Data}
                title='Organisation Chart'
                editable={{
                    onRowAdd: props.editable ? newData =>
                        new Promise((resolve, reject) => {
                            setTimeout(() => {
                                if (file.length != 0) {
                                    resolve();
                                    submitData(newData);
                                }
                                else {
                                    alert('Please Upload a File')
                                    reject();
                                }
                            }, 300)
                        }) : undefined,
                    onRowDelete: props.editable ? oldData =>
                        new Promise((resolve, reject) => {
                            setTimeout(() => {
                                const dataDelete = [...props.Data];
                                deleteData(oldData.org_id)
                                const index = oldData.tableData.id;
                                dataDelete.splice(index, 1);
                                props.setData([...dataDelete]);
                                resolve()
                            }, 300)
                        }) : undefined,
                    onRowAddCancelled: rowData => resetFile()
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

export default OrganisationChart;