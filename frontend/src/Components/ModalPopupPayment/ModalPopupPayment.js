//Libraries
import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, makeStyles } from '@material-ui/core/';
import Select from 'react-select';
import axios from 'axios'

//Components
import StyledButton from '../StyledButton/StyledButton';
import colour from '../Colours/Colours';
import config from '../../Config';
import visa from '../../Images/visa.png';
import amex from '../../Images/amex.png';
import mastercard from '../../Images/mastercard.png';
import SetupPaymentMethod from '../SetupPaymentMethod/SetupPaymentMethod';

const ModalPopupPayment = ({ rowData }) => {
    const [open, setOpen] = useState(false);
    const [userData, setUserData] = useState([]);
    const [disabled, setDisabled] = useState(false);
    const [paymentId, setPaymentId] = useState();
    const [selectOptions, setSelectOptions] = useState([]);
    const [rowDataState, setRowDataState] = useState(rowData)
    const handleClickOpen = () => {
        setOpen(true);
    };

    console.log(rowData)

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        axios.get(`${config.baseUrl}/u/stripe/paymentmethods`, { withCredentials: true })
            .then(response => {
                console.log(response)
                var data = response.data;
                setUserData(data);

                const options = data.map(x =>
                    ({ value: x.stripe_payment_method_id, label: "****" + x.stripe_card_last_four_digit + " Expires " + x.stripe_card_exp_date }));
                setSelectOptions(options)
                console.log(options)

            }).catch(error => {
                console.log(error)
            });
    }, []);

    const onSubmit = () => {
        console.log(rowData.name);
        console.log(paymentId);

        axios.post(`${config.baseUrl}/u/stripe/subscriptions/${rowData.name}`, {
            paymentMethodID: paymentId.value
        }, { withCredentials: true })
            .then(response => {
                alert("worked")
            })
            .catch(error => {
                alert(error)
            })
            ;
    }

    const handleSelectChange = (value) => {
        setPaymentId(value);
        console.log(paymentId)
    }

    const useStyles = makeStyles({
        //local style
        titleContainer: {
            backgroundColor: colour.c6,
            color: 'white',
        },
        contentContainer: {
            backgroundColor: colour.c4,
            width: "100%",
            height: "300px"
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

    return (
        <>
            <StyledButton style={{ width: "75%", height: "auto" }} text="Subscribe" event={() => handleClickOpen()} />
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle className={classes.titleContainer} id="form-dialog-title">Payment Method</DialogTitle>
                <DialogContent className={classes.contentContainer}>
                    {userData &&
                        <>
                            <div className="d-flex justify-content-center text-center">
                                <div className="w-100">
                                    <h6 className="my-3">Choose a payment method or add one</h6>

                                    <div className="w-100 text-left">
                                        <Select
                                            options={selectOptions}
                                            style={selectStyle}
                                            onChange={(value) => {
                                                handleSelectChange(value)
                                            }}
                                        />
                                    </div>

                                </div>
                            </div>
                        </>
                    }
                </DialogContent>
                <DialogActions className={classes.actionContainer}>
                    <div className="mr-4">
                        <SetupPaymentMethod />
                    </div>
                    <StyledButton text="Cancel" event={() => handleClose()} />
                    <StyledButton text="Subscribe" event={() => onSubmit()} />
                </DialogActions>
            </Dialog>
        </>
    );
}

export default ModalPopupPayment