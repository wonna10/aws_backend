import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import { decodeToken } from 'react-jwt';

import TopBar from '../../Components/TopBar/TopBar';
import config from '../../Config';
import SetupPaymentMethod from '../../Components/SetupPaymentMethod/SetupPaymentMethod';
import visa from '../../Images/visa.png';
import amex from '../../Images/amex.png';
import mastercard from '../../Images/mastercard.png';
import StyledButton from '../../Components/StyledButton/StyledButton';
import colour from '../../Components/Colours/Colours';
import Title from '../../Components/Title/Title';


// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY);

function App() {
  const [userData, setUserData] = useState([]);
  const [userSubscription, setUserSubscription] = useState([]);
  const token = localStorage.getItem('token');

  const options = {
    // passing the client secret obtained in step 2
    clientSecret: '{{CLIENT_SECRET}}',
    // Fully customizable with appearance API.
    appearance: {/*...*/ },
  };

  const handleDeletePayment = (id) => {
    console.log(id)
    if (window.confirm("Are you sure you want to delete?")) {
      axios.delete(`${config.baseUrl}/u/stripe/paymentmethods/${id}`, { withCredentials: true })
        .then(response => {
          window.location.reload();
        }).catch(error => {
          alert("Something went wrong. Please try again later.");
          console.log(error);
        });
    }
  }

  const handleDeleteSubscription = () => {
    if (window.confirm("Are you sure you want to delete?")) {
      // /api/u/stripe/subscriptions/

      axios.delete(`${config.baseUrl}/u/stripe/subscriptions`, { withCredentials: true })
        .then(response => {
          window.location.reload();
        }).catch(error => {
          alert("Something went wrong. Please try again later.");
          console.log(error);
        });
    }
  }

  useEffect(() => {
    axios.get(`${config.baseUrl}/u/stripe/paymentmethods`, { withCredentials: true })
      .then(response => {
        // console.log(response)
        var data = response.data;
        setUserData(data);
      }).catch(error => {
        console.log(error)
      });

    axios.get(`${config.baseUrl}/u/stripe/subscription`, { withCredentials: true })
      .then(response => {
        console.log(response.data)
        var data = response.data;
        setUserSubscription(data);
      }).catch(error => {
        console.log(error)
      });
  }, []);

  return (
    <>
      <Title title="Payment Methods" />
      <TopBar pageName="Payment Method" />
      <div className="m-2 p-3" style={{ backgroundColor: colour.c1 }}>
        <div>
          <div className="my-3 d-flex justify-content-between">
            <h3>My Payment Methods</h3>
            <SetupPaymentMethod />
          </div>
          <hr />
          {!userData &&
            <div className="d-flex justify-content-center">
              <h6>
                You have yet to add a payment method.
              </h6>
            </div>
          }
          {userData &&
            <>
              {userData.map(x => {
                return (
                  <>
                    <div className="border d-flex justify-content-between mt-3">
                      <span className="d-flex" >
                        <div className="m-3" style={{ backgroundColor: "white" }}>
                          {x.stripe_card_type === "visa" && <img className="p-3" src={visa} style={{ width: "auto", maxWidth: "100px" }} alt="Logo"></img>}
                          {x.stripe_card_type === "amex" && <img className="p-3" src={amex} style={{ width: "auto", maxWidth: "100px" }} alt="Logo"></img>}
                          {x.stripe_card_type === "mastercard" && <img className="p-3" src={mastercard} style={{ width: "auto", maxWidth: "100px" }} alt="Logo"></img>}
                        </div>
                        <div className="m-3">
                          <p className="text-dark"> **** **** **** {x.stripe_card_last_four_digit} </p>
                          <p className="text-dark">Expires {x.stripe_card_exp_date}</p>
                        </div>
                      </span>
                      <div className="d-flex align-items-center m-4">
                        <StyledButton text="Remove" event={() => handleDeletePayment(x.stripe_payment_method_id)} />
                      </div>
                    </div>
                  </>
                )
              })}
            </>
          }
          <hr />
        </div>

        <div className="my-3">
          <h3>My Subscriptions</h3>
          <hr style={{ border: "1px solid dark" }} />
          {userSubscription.length === 0 &&
            <div className="d-flex justify-content-center">
              <h6>
                You have no subscriptions.
              </h6>
            </div>
          }
          {userSubscription.map(x => {
            return (
              <>
                <div className="border d-flex justify-content-between mt-3">
                  <span className=" m-3" >
                    <h5>Plan: {x.name} </h5>
                    <h5 >Status: {x.stripe_status}</h5>
                  </span>
                  <div className="d-flex align-items-center m-4">
                    <StyledButton text="Remove" event={() => handleDeleteSubscription()} />
                  </div>
                </div>
              </>
            )
          })}
        </div>
      </div>
    </>
  );
};

export default App;