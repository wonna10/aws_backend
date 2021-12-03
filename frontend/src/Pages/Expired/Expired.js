import React, { } from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import colour from '../../Components/Colours/Colours'
import Title from '../../Components/Title/Title'

const useStyles = makeStyles({
    missing: {
        color: colour.c1
    }
})


const MissingPage = () => {
    const classes = useStyles()

    return (
        <>
            <Title title="Expired Session Page" />
            <Typography className={classes.missing} variant="h1">Session has expired, please re-login.</Typography>
        </>
    );
};

export default MissingPage;