import React from 'react';
import { makeStyles } from '@material-ui/core';
import colour from '../Colours/Colours'

const TopBar = (pageInfo) => {
    const page = pageInfo.pageName
    const useStyles = makeStyles({
        container: {
            borderRadius: 5,
            height: 55,
            width: '100%',
            backgroundColor: colour.c6,
            paddingLeft: 10,
            color: colour.c1,
            marginBottom: 15,
            boxShadow: "0px 5px 5px rgba(00,00,00,0.2)",
        }
    })
    const classes = useStyles()

    return (
        <div className={classes.container}>
            <h1>{page}</h1>
        </div>
    )
}

export default TopBar