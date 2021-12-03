//Libraries
import React, { useState, useEffect } from 'react';
import { makeStyles, Paper } from '@material-ui/core';
import moment from 'moment';
import axios from "axios";
import { decodeToken } from 'react-jwt';
import { Row } from "react-bootstrap";

//Components
import config from "../../Config";
import ModalPopupPayment from "../../Components/ModalPopupPayment/ModalPopupPayment";
import colour from '../../Components/Colours/Colours'
import TopBar from '../../Components/TopBar/TopBar';
import Title from '../../Components/Title/Title'

const Dashboard = () => {
  const [planData, setPlanData] = useState([])

  useEffect(() => {
    axios.get(`${config.baseUrl}/u/stripe/plans/`, { withCredentials: true })
      .then(response => {
        console.log(response.data)
        var data = response.data;
        setPlanData(data);

      }).catch(error => {
        console.log(error)
      });
  }, []);

  const useStyles = makeStyles({
    root: {
      height: "auto",
      backgroundColor: colour.c3,
      boxShadow: "0px 5px 5px rgba(00,00,00,0.2)",
      padding: '15px 15px 1px 15px',
      borderRadius: 5,
      marginBottom: 15
    }
  })

  const classes = useStyles()

  console.log(planData)

  return (
    <>
      <Title title="Dashboard" />
      <TopBar pageName='Dashboard' />
      <div className="m-2 p-3" style={{ backgroundColor: colour.c1, }}>
        {planData.length !== 0 &&
          <>
            <h3 className="text-dark">Subscription Plans</h3>
            <hr />
            <div className="d-flex">
              {planData.map(x => {
                return (
                  <>
                    <div className="border w-100 d-flex justify-content-center mr-3">
                      <Row style={{ margin: 20 }} className="d-flex justify-content-center text-center">
                        <div className="my-3">
                          <h4 >
                            {x.name}
                          </h4>
                          <h1>
                            $ {x.price} / Month
                          </h1>
                          <div className="w-100 text-left my-4">
                            <ul>
                              <li>Perk 1</li>
                              <li>Perk 2</li>
                              <li>Perk 3</li>
                              <li>Perk 4</li>
                              <li>Perk 5</li>
                            </ul>
                          </div>
                        </div>
                        <ModalPopupPayment rowData={x} />
                      </Row>
                    </div>
                  </>
                )
              })}
            </div>
          </>
        }
      </div>
    </>
  );
};

export default Dashboard;
