import { makeStyles } from "@material-ui/core";
import Chip from '@material-ui/core/Chip';

//components 
import colour from '../Colours/Colours'

//regex
const regexEmail = new RegExp(/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i)
const isValid = (emailstate, setEmail, email) => {
    let error = null;

    if (isInList(emailstate, email)) {
        error = `${email} has already been added.`;
    }

    if (!isEmail(email)) {
        error = `${email} is not a valid email address.`;
    }

    if (error) {
        setEmail({
            items: [...emailstate.items],
            error: error
        })

        return false;
    }

    return true;
}

const isInList = (emailstate, email) => {
    return emailstate.items.includes(email);
}

const isEmail = (email) => {
    return regexEmail.test(email);
}

const EmailChip = ({ email, setEmail }) => {
    const useStyles = makeStyles({
        errorMessage: {
            color: colour.error,
            marginBottom: 0
        },
        chipBox: {
            backgroundColor: colour.c2,
            marginTop: 15,
            borderRadius: 5
        },
        chip: {
            margin: 5
        }
    })
    const classes = useStyles()

    const handleKeyDown = evt => {
        if (["Enter", "Tab", ",", " "].includes(evt.key)) {
            evt.preventDefault();

            var value = email.value.trim();

            if (value && isValid(email, setEmail, value)) {
                setEmail({
                    items: [...email.items, email.value],
                    value: ""
                });
            }
        }
    };

    const handleChange = evt => {
        setEmail({
            value: evt.target.value,
            items: [...email.items],
            error: null
        });
    };

    const handleDelete = item => {
        setEmail({
            items: email.items.filter(i => i !== item),
            value: [...email.value]
        });
    };

    const handlePaste = evt => {
        evt.preventDefault();

        var paste = evt.clipboardData.getData("text");

        var emails = regexEmail.test(paste);

        if (emails) {
            if (!email.items.includes(paste)) {
                setEmail({
                    items: [...email.items, paste]
                });
            }
            else {
                setEmail(prevState => ({
                    ...prevState,
                    error: 'Email is already keyed in'
                }))
            }
        }
        else {
            setEmail(prevState => ({
                ...prevState,
                error: 'Email pasted is not a valid email'
            }))
        }
    };

    return (
        <>
            <input
                className={"input " + (email.error && " has-error")}
                value={email.value}
                placeholder="Type or paste email addresses and press `Enter`..."
                className='form-control'
                onKeyDown={e => handleKeyDown(e)}
                onChange={e => handleChange(e)}
                onPaste={e => handlePaste(e)}
            />
            <div className={classes.chipBox}>
                {email.items.map(item => (
                    <Chip className={classes.chip} label={item} onDelete={() => handleDelete(item)} />
                ))}
            </div>
            {email.error && <p className={classes.errorMessage}>{email.error}</p>}
        </>
    )
}

export default EmailChip
