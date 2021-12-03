import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import Select from 'react-select';
import axios from 'axios';
import config from '../../Config';
import { useForm, Controller } from 'react-hook-form';
import { decodeToken } from 'react-jwt';
import { Row } from 'react-bootstrap'
//import Components
import colour from '../../Components/Colours/Colours'
import TopBar from '../../Components/TopBar/TopBar'
import StyledButton from '../../Components/StyledButton/StyledButton'
import EmailChip from '../../Components/EmailChip/EmailChip';
import Title from '../../Components/Title/Title';

const SendInvites = () => {
  const { register, handleSubmit, errors, control } = useForm();
  const history = useHistory();
  const token = localStorage.getItem('token')
  if (decodeToken(token).privId > 3) {
    alert('You do not have the privilege to view this page.')
    history.push('/dashboard')
  }
  //states
  const [emailValid, setEmailValid] = useState('')
  const [email, setEmail] = useState({
    items: [],
    value: "",
    error: null
  })

  const company_id = decodeToken(token).companyId
  //Styles
  const useStyles = makeStyles({
    //local style
    formContainer: {
      backgroundColor: colour.c3,
      color: colour.c1,
      borderRadius: "5px",
      boxShadow: "0px 5px 5px rgba(00,00,00,0.2)",
    },
    form: {
      width: '80%',
      margin: 'auto',
      color: 'white',
      padding: '20px'
    },
    formField: {
      marginBottom: 30,
    },
    btnContainer: {
      marginTop: 20,
      marginBottom: 20,
      margin: 'auto'
    },
    errorMessage: {
      color: colour.error
    }
  })
  const classes = useStyles()

  const selectStyle = {
    option: styles => ({ ...styles, color: 'black' }),
  }

  // Handle the form submit of Registration form
  const onSubmit = (data) => {


    if (email.items.length == 0) {
      setEmailValid('empty')
      return
    } else {
      setEmailValid('valid')
    }

    data = { ...data, email: email.items }
    data.company_id = company_id

    axios.post(`${config.baseUrl}/u/user/senduserinvite`,
      data)
      .then(response => {
        alert('Invite has been sent')
        history.push(`/dashboard`);
      }).catch(error => {
        console.log(error)
        if (error.response.status == 500) {
        }
        if (error.response.status == 401) {
          let string = ''
          for (let i = 0; i < error.response.data.length; i++) {
            string += '\n' + error.response.data[i]
          }
          alert(`These these email(s) ${string}\nhas already been registered or already exist in the invite list.`)
        }
      });


  }// End of onSubmit

  return (
    <div>
      <TopBar pageName="Send Invites" />
      <Title title="Send Invites"></Title>
      <div className={classes.formContainer}>
        <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label htmlFor="emailInput">Emails</label>
            <EmailChip email={email} setEmail={setEmail} />
            {emailValid == 'empty' && <p className={classes.errorMessage}>Please insert at least one email.</p>}
          </div>
          <Row>
            <div style={{ margin: 'auto' }}>
              <StyledButton text="Submit" type='submit' event={() => { }} />
              <StyledButton text="Cancel" event={() => { history.push('/manageinvites') }} style={{ marginLeft: 20 }} />
            </div>
          </Row>
        </form>
      </div>
    </div>
  )
};

export default SendInvites;