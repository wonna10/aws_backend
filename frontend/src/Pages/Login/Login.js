//Reference:https://github.com/mohanramphp/auth-using-react
import React, { useState, useEffect } from 'react';
import { makeStyles, Button } from '@material-ui/core';
import { useHistory } from "react-router-dom";
import axios from 'axios';
import Title from '../../Components/Title/Title'
import config from '../../Config.js';
import { useForm } from "react-hook-form";
import { saveUserDataToLocalStore } from '../../Utils/Common.js';
import Cookies from 'universal-cookie';
import moment from 'moment'
//import Components
import colour from '../../Components/Colours/Colours'
import styles from './Login.module.css';
import img from '../../Images/iso-2-1-logo-black-and-white.png';

function Login() {
  const { register, handleSubmit, errors } = useForm();
  const history = useHistory();
  const cookies = new Cookies();

  //states
  const [errSpaceA, setErrSpaceA] = useState(54)
  const [errSpaceB, setErrSpaceB] = useState(54)

  //errSpace Change
  useEffect(() => {
    if (errors.email) {
      setErrSpaceA(30)
    } else {
      setErrSpaceA(54)
    }
    if (errors.password) {
      setErrSpaceB(30)
    } else {
      setErrSpaceB(54)
    }
  }, [errors.email, errors.password])

  //Styles
  const useStyles = makeStyles({
    //local style
    shadow: {
      boxShadow: "0px 5px 5px rgba(00,00,00,0.2)"
    },
    formContainer: {
      backgroundColor: colour.c3,
      color: colour.c1,
      borderRadius: "5px",
      boxShadow: "0px 5px 5px rgba(00,00,00,0.2)",
    },
    form: {
      width: '95%',
      margin: 'auto',
      color: 'black',
      padding: '20px'
    },
    errorMessage: {
      color: colour.error,
    },

  })
  const classes = useStyles()

  //Submit
  const onSubmit = (data) => {
    console.log(data)
    axios.post(`${config.baseUrl}/u/user/signin`,
      { email: data.email, password: data.password }, { withCredentials: true })
      .then(response => {
        alert('Login success')
        console.log(response.data)
        console.log(response.data.token);
        const token = response.data.token;
        saveUserDataToLocalStore(token, response.data.displayName);
        history.push('/dashboard');
      }).catch(error => {
        console.dir(error);
        if ((error.response != null) && (error.response.request.status === 401)) {
          alert('Email or password is wrong')
        } else if ((error.response != null) && (error.response.request.status === 400)) {
          alert('Account or Company has been terminated')
        } else if (error.message != null) {
          alert('Err')
        } else {
          alert('Something went wrong. Please try again later.');
        }
      });
  }


  return (
    <div className={styles.bg}>
      <Title title="Login"></Title>
      <div className={`d-flex flex-column align-items-center justify-content-center h-100 w-100`}>
        <div className={`my-auto d-inline-flex border rounded ${styles.shadow}`}>
          <div className={`${styles.loginFormContainer} `}>
            <div className="m-5 p-3">
              <legend style={{ textAlign: "center", fontSize: "18" }}>Login</legend>
              <hr />
              <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3">
                  <label htmlFor="email" >Email</label>
                  <input
                    type="text"
                    name="email"
                    placeholder='Email'
                    className='form-control'
                    ref={register({ required: { value: true } })}
                  />
                  {errors.email && <p className={classes.errorMessage}>Please input email</p>}
                </div>
                <div className="mb-3">
                  <label htmlFor="password" >Password</label>
                  <input
                    type="password"
                    name="password"
                    placeholder='Password'
                    className='form-control'
                    ref={register({ required: { value: true } })}
                  />
                  {errors.password && <p className={classes.errorMessage}>Please input password</p>}
                </div>
                <div className="d-flex justify-content-end ">
                  <a href="/EmailRequest" className="text-dark">Forget Password?</a>
                </div>
                <Button
                  className={`mt-3 ${styles.shadow}`}
                  type='submit'
                  style={{
                    backgroundColor: colour.c5,
                    color: colour.c1,
                    width: '100%',
                  }}
                >Login</Button>
              </form>
            </div>
          </div>
          <div className="p-3 d-inline-flex flex-wrap flex-column align-items-center text-white" style={{ backgroundColor: "#0c3658", borderLeft: "1px solid #fff", height: "500px" }}>
            <h3 className="p-3">eISO Company Login</h3>
            <img className="mt-5 p-3 " src={img} style={{ width: "auto", maxWidth: "300px" }} alt="Logo" />
          </div>
        </div>
      </div>
    </div>


    // <div className={styles.bg}>
    //   <Title title="Login"></Title>
    //   <div className={classes.shadow} style={{
    //     position: 'absolute',
    //     top: '50%',
    //     left: '50%',
    //     transform: 'translate(-50%, -50%)',
    //     width: '450px',
    //     backgroundColor: colour.c3,
    //     borderRadius: 15,
    //     color: colour.c1
    //   }}>
    //     <div style={{ backgroundColor: colour.c6, borderRadius: "15px 15px 0px 0px", width: "100%" }}>
    //       <h1 style={{ paddingTop: 10, paddingBottom: 10, textAlign: 'center' }}>eISO System</h1>
    //     </div>
    //     <div>
    //       <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
    //         <div style={{ marginBottom: errSpaceA }}>
    //           <label htmlFor="email" className={classes.label}>Email</label>
    //           <input
    //             type="text"
    //             name="email"
    //             placeholder='Email'
    //             className='form-control'
    //             ref={register({ required: { value: true } })}
    //           />
    //           {errors.email && <p className={classes.errorMessage}>Please input email</p>}
    //         </div>
    //         <div style={{ marginBottom: errSpaceB }}>
    //           <label htmlFor="password" className={classes.label}>Password</label>
    //           <input
    //             type="password"
    //             name="password"
    //             placeholder='Password'
    //             className='form-control'
    //             ref={register({ required: { value: true } })}
    //           />
    //           {errors.password && <p className={classes.errorMessage}>Please input password</p>}
    //           <a href="/ForgetPassword" style={{ display: "block", marginTop: "5px", textDecoration: "none" }}>Forget Password</a>

    //         </div>
    //         <Button
    //           className={classes.shadow}
    //           type='submit'
    //           style={{
    //             backgroundColor: colour.c5,
    //             color: colour.c1,
    //             width: '100%',
    //             fontSize: '1.2rem'
    //           }}
    //         >Login</Button>
    //       </form>
    //     </div>
    //   </div>
    // </div >
  );
}
export default Login;