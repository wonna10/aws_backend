import React, { } from 'react';
import { Button } from '@material-ui/core';
import colour from '../Colours/Colours'


const StyledButton = (props) => {
    return (
        <Button
            style={{
                ...props.style,
                backgroundColor: colour.c5,
                color: colour.c1,
            }}
            onClick={() => props.event()}
            type={props.type}
        >
            {props.text}
        </Button>)
}

export default StyledButton


// template 
// <StyledButton text="btn text" event={() => {}}} />