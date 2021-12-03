import tableIcons from '../../Components/MUITableIcons/material.table.icons';
import MaterialTable from 'material-table';
import { makeStyles, Paper } from '@material-ui/core';
import { useState, useEffect, } from "react";

const Tables = ({ type, columns, Data, setData, showEdited, editable, clause }) => {
    const [toolbarFlag, setToolbarFlag] = useState(false)

    useEffect(() => {
        if (editable == false) {
            setToolbarFlag(false)
        } else {
            setToolbarFlag(true)
        }
    }, [editable]);

    const useStyles = makeStyles({
        //local style
        table: {
            marginBottom: 30,
            boxShadow: "0px 5px 5px rgba(00,00,00,0.2)",
            "& > *": {
                backgroundColor: "#7be08e",
                color: "black",
                boxShadow: '0 0 0'
            },
            "& .MuiTableCell-root": {
                borderBottom: "1px solid"
            },
            padding: 5,
            borderRadius: 5,
            backgroundColor: '#7be08e'
        },
        boxContainer: {
            "& > button": {
                marginRight: 10,
                marginBottom: 10,
                marginTop: 10,
            }
        },
    })

    const SwotAndRorSetState = (data) => {
        switch (type) {
            case "S":
                setData(prevState => ({
                    ...prevState,
                    edited_strengths: data
                }));
                break;
            case "W":
                setData(prevState => ({
                    ...prevState,
                    edited_weaknesses: data
                }));
                break;
            case "O":
                setData(prevState => ({
                    ...prevState,
                    edited_opportunities: data
                }));
                break;
            case "T":
                setData(prevState => ({
                    ...prevState,
                    edited_threats: data
                }));
                break;
        }

    }
    const classes = useStyles()
    return (
        <Paper className={classes.table}>
            <MaterialTable
                icons={tableIcons}
                columns={columns}
                data={Data}
                title=''
                editable={{
                    onRowAdd: editable ? newData =>
                        new Promise((resolve, reject) => {
                            setTimeout(() => {
                                if (clause == "swot" || clause == "ror") {
                                    SwotAndRorSetState([...Data, newData])
                                }
                                else {
                                    setData(prevState => ({
                                        ...prevState,
                                        edited_data: [...Data, newData]
                                    }));
                                }
                                resolve();
                            }, 200)
                        }) : undefined,
                    onRowUpdate: editable ? (newData, oldData) =>
                        new Promise((resolve, reject) => {
                            setTimeout(() => {
                                const dataUpdate = [...Data];
                                const index = oldData.tableData.id;
                                dataUpdate[index] = newData;
                                if (clause == "swot" || clause == "ror") {
                                    SwotAndRorSetState([...dataUpdate])
                                }
                                else {
                                    setData(prevState => ({
                                        ...prevState,
                                        edited_data: [...dataUpdate]
                                    }));
                                }

                                resolve();
                            }, 200);
                        }) : undefined,
                    onRowDelete: editable ? oldData =>
                        new Promise((resolve, reject) => {
                            setTimeout(() => {
                                const dataDelete = [...Data];
                                const index = oldData.tableData.id;
                                dataDelete.splice(index, 1);
                                if (clause == "swot" || clause == "ror") {
                                    SwotAndRorSetState([...dataDelete])
                                }
                                else {
                                    setData(prevState => ({
                                        ...prevState,
                                        edited_data: [...dataDelete]
                                    }));
                                }

                                resolve()
                            }, 200)
                        }) : undefined,
                }}
                options={{
                    actionsColumnIndex: -1,
                    tableLayout: "auto",
                    search: false,
                    paging: false,
                    toolbar: toolbarFlag,
                    draggable: false,
                    headerStyle: {
                        backgroundColor: "#7be08e",
                        color: "black",
                    },
                    rowStyle: (data, index) => {
                        if (showEdited) {
                            if (data.edited == 1) {
                                return { backgroundColor: "#ffff33" }
                            }
                            return { backgroundColor: "#7be08e" };
                        }
                    },
                }}

            />
        </Paper>
    )
}

export default Tables;