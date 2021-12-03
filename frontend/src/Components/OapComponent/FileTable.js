import MaterialTable from "material-table";
import StyledButton from "../StyledButton/StyledButton";
import colour from "../Colours/Colours";
import { useState, useRef, useEffect, useMemo } from "react";
import Download from "../Functions/Download";
import tableIcons from "../MUITableIcons/material.table.icons";
import { makeStyles, Paper, Button } from "@material-ui/core";

const useStyles = makeStyles({
    table: {
        marginBottom: 30,
        boxShadow: "0px 5px 5px rgba(00,00,00,0.2)",
        "& > *": {
            backgroundColor: colour.c3,
            color: "black"
        },
        "& .MuiTableCell-root": {
            borderBottom: "1px solid"
        },
    },
})


const FileTable = ({ Data, setData, file, setFile, i, x, editable }) => {
    const classes = useStyles()
    const [fileData, setFileData] = useState() //store one file
    const [fileName, setFileName] = useState() // store name
    const hiddenFileInput = useRef(null);
    const [toolbarFlag, setToolbarFlag] = useState(false)

    useEffect(() => {
        if (editable == false) {
            setToolbarFlag(false)
        } else {
            setToolbarFlag(true)
        }
    }, [editable]);


    const handleClick = event => {
        hiddenFileInput.current.click();
    };
    const handleAdd = (i, filedata, filename, tableid) => {
        let currentFile = {
            row: i,
            display_filename: filename,
            tableid: tableid,
            filename: filedata.name,
            file: filedata,
            filetype: filedata.type
        }
        const addedData = [...file]
        addedData.push(currentFile)
        addedData.sort((a, b) => a.row - b.row || a.tableid - b.tableid);
        setFile(addedData)
        resetFileData()
    }
    const handleRemove = (tableid) => {
        const dataDelete = [...file];
        dataDelete.sort((a, b) => a.row - b.row || a.tableid - b.tableid);
        let index = file.findIndex(obj => obj.row == i && obj.tableid == tableid);
        dataDelete.splice(index, 1);
        let indexes = [];
        dataDelete.forEach((obj, innerIndex) => {
            if (obj.row == i) indexes.push(innerIndex)
        });
        for (var j = 0; j < indexes.length; j++) {
            dataDelete[indexes[j]].tableid = j;
        }
        setFile([...dataDelete]);
    }
    const addFiles = (event) => {
        setFileName(event.target.files[0].name)
        setFileData(event.target.files[0])
    };
    const resetFileData = () => {
        setFileName('')
        setFileData()
    }
    const columns = () => [
        {
            title: "id",
            field: "file_id",
            hidden: true,
        },
        {
            title: 'File Name',
            field: "filename",
            sorting: false,
            initialEditValue: '',
            validate: rowData => rowData.filename === '' ? { isValid: false, helperText: 'Required Field' } : true,
        },
        {
            title: 'Details',
            field: 'cloudinary_file_url',
            sorting: false,
            align: 'left',
            initialEditValue: '',
            render: rowData => {
                if (rowData.file_id == undefined) {
                    return (
                        <Button style={{ backgroundColor: colour.c5, color: colour.c1 }} disabled>File Not Yet Uploaded</Button>
                    )
                }
                else {
                    return (
                        <StyledButton text="Download File" event={() => Download(rowData.file_id, rowData.original_file_name)} />
                    )
                }
            },
            editComponent: ({ value, onChange }) => {
                return (
                    <>
                        <div>
                            <StyledButton text="Upload File" event={() => handleClick()} />
                            <input
                                type="file"
                                name="files"
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
                data={Data[i].files}
                title=''
                options={{
                    draggable: false,
                    tableLayout: "auto",
                    search: false,
                    actionsColumnIndex: -1,
                    paging: false,
                    toolbar: toolbarFlag,
                    headerStyle: {
                        backgroundColor: colour.c3,
                        color: colour.c1,
                        borderColor: colour.c1
                    }
                }}
                editable={{
                    onRowAdd: (editable && Data[i].files.length < 3) ? newData =>
                        new Promise((resolve, reject) => {
                            setTimeout(() => {
                                if (fileData != undefined) {
                                    const addedData = [...Data];
                                    addedData[i].files = [...Data[i].files, newData]
                                    setData(prevState => ({
                                        ...prevState,
                                        edited_data: [...addedData]
                                    }));


                                    handleAdd(i, fileData, newData.filename, newData.tableData.id)
                                    resolve();
                                }
                                else {
                                    alert('Please Upload a File')
                                    reject();
                                }
                            }, 300)
                        }) : undefined,
                    onRowDelete: editable ? oldData =>
                        new Promise((resolve, reject) => {
                            setTimeout(() => {
                                const index = oldData.tableData.id;
                                if (oldData.file_id == undefined) { // check and remove uploaded file in current edit session
                                    handleRemove(index)
                                }
                                const dataDelete = [...Data];
                                dataDelete[i].files.splice(index, 1);
                                setData(prevState => ({
                                    ...prevState,
                                    edited_data: [...dataDelete]
                                }));
                                console.log(dataDelete)

                                resolve()
                            }, 300)
                        }) : undefined,
                    onRowAddCancelled: rowData => resetFileData()
                }}
            />
        </Paper>
    )
}

export default FileTable;