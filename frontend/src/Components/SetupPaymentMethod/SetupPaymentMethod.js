import React, { useState, useEffect } from 'react';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import axios from 'axios';
import config from '../../Config';
import Spinner from 'react-bootstrap/Spinner'
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, makeStyles } from '@material-ui/core/';
import StyledButton from '../StyledButton/StyledButton';
import colour from '../Colours/Colours';

const SetupPaymentMethod = () => {
    const [open, setOpen] = useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const [cardSetupError, setCardSetupError] = useState(null);
    const [cardSetupProcessing, setCardSetupProcessing] = useState(false);
    const [cardSetupDisabled, setCardSetupDisabled] = useState(true);
    const [cardSetupSuccess, setCardSetupSuccess] = useState(false);
    const [setupIntentID, setSetupIntentID] = useState(null);
    const [clientSecret, setClientSecret] = useState(null);
    const token = localStorage.getItem('token')

    const stripe = useStripe();
    const elements = useElements();

    const showHideClassName = open ? "l-Setup-payment-method l-Setup-payment-method--show" : "l-Setup-payment-method l-Setup-payment-method--hidden";

    const CARD_ELEMENT_OPTIONS = {
        hidePostalCode: true,
        style: {
            base: {
                iconColor: '#F1EBEA',
                color: "#32325d",
                fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                fontSmoothing: "antialiased",
                fontSize: "20px",
                "::placeholder": {
                    color: "#32325d",
                },
                color: 'black'
            },
            invalid: {
                color: "#fa755a",
                iconColor: "#fa755a"
            },

        },
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        elements.getElement(CardElement).update({ disabled: true });
        setCardSetupProcessing(() => true);
        if (!stripe || !elements || !clientSecret || !setupIntentID) {
            // Stripe.js has not yet loaded.
            // Make sure to disable form submission until Stripe.js has loaded.
            setCardSetupProcessing(() => false);
            elements.getElement(CardElement).update({ disabled: false });
            setCardSetupError(() => "Error! Please try again later!");
        } else {
            const result = await stripe.confirmCardSetup(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement)
                },
            });

            if (result.error) {
                setCardSetupError(() => result.error.message);
                setCardSetupProcessing(() => false);
                // Display result.error.message in your UI.
                elements.getElement(CardElement).update({ disabled: false });
            } else {
                // The setup has succeeded. Display a success message and send
                // result.setupIntent.payment_method to your server to save the
                // card to a Customer

                // Obtain payment method id
                const paymentMethodID = result.setupIntent.payment_method;

                try {
                    await axios.post(`${config.baseUrl}/u/stripe/paymentmethods`, {
                        paymentMethodID }, { withCredentials: true });

                    elements.getElement(CardElement).clear();
                    setCardSetupSuccess(() => true);
                    setCardSetupProcessing(() => false);
                    setCardSetupError(() => null);

                } catch (error) {
                    console.log(error);
                    const duplicate = error.response?.data.duplicate;
                    if (duplicate) {
                        setCardSetupError(() => error.response.data.message);
                    } else {
                        setCardSetupError(() => "Error! Please try again later!");
                    }
                    setCardSetupProcessing(() => false);

                    elements.getElement(CardElement).update({ disabled: false });

                }

            }
        }
    };

    const handleBtn = () => {
        // Clear stripe element before closing
        if (elements?.getElement(CardElement)) {
            elements.getElement(CardElement).clear();
        }
        handleClose();
        setCardSetupSuccess(() => false);
        setCardSetupProcessing(() => false);
    };

    const handleCardInputChange = async (event) => {
        // Listen for changes in the CardElement
        // and display any errors as the customer types their card details

        if (event.complete) {
            setCardSetupDisabled(() => false);
        } else {
            setCardSetupDisabled(() => true);
        }

        setCardSetupError(event.error ? event.error.message : "");
    };

    useEffect(() => {
        let componentMounted = true;

        (async () => {
            try {
                if (componentMounted) {
                    if (open) {
                        // Retrieve client secret here
                        const setupIntent = await axios.post(`${config.baseUrl}/u/stripe/setupintents`, {}, { withCredentials: true }, {
                        });
                        console.log(setupIntent);
                        setClientSecret(() => setupIntent.data.clientSecret);
                        setSetupIntentID(() => setupIntent.data.setupIntentID);
                    }
                }
            } catch (error) {
                console.log(error);
            }
        })()

        return (() => {
            componentMounted = false;
        });
    }, [open]);

    const useStyles = makeStyles({
        //local style
        titleContainer: {
            backgroundColor: colour.c6,
            color: 'white',
        },
        contentContainer: {
            backgroundColor: colour.c4,
            height: '100px',
            width: '500px'
        },
        textField:{
            marginTop: '10px',
            border: '1px solid black',
            borderRadius: '5px'
        },
        actionContainer:{
            backgroundColor: colour.c3,
        }
    })
    const classes = useStyles()

    return (
        <div>
            <StyledButton text="Add Payment Method" event={() => handleClickOpen()} />
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" onBackdropClick="false">
                <DialogTitle className={classes.titleContainer} id="form-dialog-title">Add Payment Method</DialogTitle>
                <DialogContent className={classes.contentContainer}>
                    <form className={showHideClassName} onSubmit={(event) => handleSubmit(event)}>
                        {
                            cardSetupSuccess ?
                                // Card set up success component
                                <div>
                                    <span>
                                        <svg viewBox="0 0 24 24">
                                            <path strokeWidth="2" fill="none" stroke="#ffffff" d="M 3,12 l 6,6 l 12, -12" />
                                        </svg>
                                    </span>
                                    <h1>Card Added Successfully!</h1>
                                </div>
                                :
                                <div>
                                    <div>
                                        <div className={classes.textField}>
                                            {/* Card input is rendered here */}
                                            <CardElement options={CARD_ELEMENT_OPTIONS} onChange={handleCardInputChange} />
                                        </div>
                                    </div>
                                    {/* Show any error that happens when setting up the payment method */}
                                    {cardSetupError && (
                                        <div className="card-error" role="alert">
                                            {cardSetupError}
                                        </div>
                                    )}

                                </div>
                        }
                    </form>
                </DialogContent>
                <DialogActions className={classes.actionContainer}>
                    {
                        cardSetupSuccess ?
                            <button type="button" onClick={() => handleBtn()}>Close</button>
                            :
                            <div className="c-Setup-payment-method__Btn">
                                <button disabled={cardSetupProcessing || cardSetupDisabled} type="button" className={cardSetupProcessing || cardSetupDisabled ? "c-Btn c-Btn--disabled" : "c-Btn"} onClick={(event) => handleSubmit(event)}>
                                    {cardSetupProcessing ? (
                                        <>
                                            <span> Processing </span>
                                            <Spinner animation="border" role="status" />
                                        </>
                                    ) : (
                                        <>
                                            Save
                                        </>
                                    )}
                                </button>
                                <button disabled={cardSetupProcessing} type="button" onClick={() => handleBtn()}>Cancel</button>
                            </div>
                    }
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default SetupPaymentMethod