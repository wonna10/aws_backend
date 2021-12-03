import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, makeStyles } from '@material-ui/core/';
import Select from 'react-select';
import StyledButton from '../StyledButton/StyledButton';
import colour from '../Colours/Colours';
import axios from 'axios'
import config from '../../Config';


const ModalPopup = ({ rowData, Data, setData }) => {
    const [open, setOpen] = useState(false);
    const [rowDataState, setRowDataState] = useState(rowData)
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const onSubmit = () => {
        let status = rowDataState.user_status
        let reason = rowDataState.reason
        if (status == 1) {
            reason = ""
            setRowDataState(prevState => ({
                ...prevState,
                reason: ""
            }))
        }
        axios.put(`${config.baseUrl}/u/user/updateuserstatus/${rowData.user_id}`,
            {
                data: {
                    status: status,
                    reason: reason
                }
            })
            .then(response => {
                const index = Data.findIndex(obj => obj.user_id === rowData.user_id);
                const changedData = [...Data];
                changedData[index].user_status = rowDataState.user_status
                setData(changedData)


            }).catch(error => {
                console.log(error);
            });
        handleClose()
    }

    const useStyles = makeStyles({
        //local style
        titleContainer: {
            backgroundColor: colour.c4,
            color: 'white',
        },
        contentContainer: {
            backgroundColor: colour.c3,
            height: "275px",
        },
        actionContainer: {
            backgroundColor: colour.c3,
        },
        text: {
            color: 'white',
        },
        selectContainer: {
            marginTop: 30
        },
        disabledReasonTextField: {
            marginTop: 20,
            width: 545,
            "& .MuiInputBase-root.Mui-disabled": {
                color: 'white',
                borderColor: 'black'
            },
            "& .MuiFormLabel-root.Mui-disabled ": {
                color: 'white'
            },
            "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                borderColor: "black"
            },
        },
        reasonTextField: {
            marginTop: 20,
            width: 545,
            "& .MuiInputBase-root.Mui-disabled": {
                color: 'white',
                borderColor: 'black'
            },
            "& .MuiFormLabel-root.Mui-disabled ": {
                color: 'white'
            },
            "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                borderColor: "white"
            },
        },
    })
    const classes = useStyles()

    const selectStyle = {
        option: styles => ({ ...styles, color: 'black' }),
        menu: provided => ({ ...provided, zIndex: 9999 }),
    }

    const options = [
        { value: 0, label: 'Terminated' },
        { value: 1, label: 'Active' },
    ]

    return (
        <>
            <StyledButton text="Terminate/Activate" event={() => handleClickOpen()} />
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle className={classes.titleContainer} id="form-dialog-title">Terminate/Activate User</DialogTitle>
                <DialogContent className={classes.contentContainer}>
                    <DialogContentText className={classes.text}>
                        To terminate this user, means that this user will not be able to login to their accounts.
                    </DialogContentText>
                    <Select className={classes.selectContainer}
                        options={options}
                        value={options[rowDataState.user_status]}
                        onChange={e => setRowDataState(prevState => ({
                            ...prevState,
                            user_status: e.value
                        }))}
                        styles={selectStyle}
                    />
                    {(rowDataState.user_status == 1 &&
                        <TextField className={classes.disabledReasonTextField}
                            InputLabelProps={{ shrink: true }}
                            disabled
                            multiline
                            rows={3}
                            rowsMax={3}
                            label="Reason"
                            value=""
                            variant="outlined"
                        />
                    )}
                    {(rowDataState.user_status == 0 &&
                        <TextField className={classes.reasonTextField}
                            InputLabelProps={{ shrink: true }}
                            multiline
                            rows={3}
                            rowsMax={3}
                            autoFocus={true}
                            label="Reason"
                            onChange={e => setRowDataState(prevState => ({
                                ...prevState,
                                reason: e.target.value
                            }))}
                            value={rowDataState.reason}
                            variant="outlined"
                        />
                    )}
                </DialogContent>
                <DialogActions className={classes.actionContainer}>
                    <StyledButton text="Cancel" event={() => handleClose()} />
                    <StyledButton text="Save" event={() => onSubmit()} />
                </DialogActions>
            </Dialog>
        </>
    );
}

export default ModalPopup