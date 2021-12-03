const rorSwitchSetData = (type, setData, dataInput) =>{
    switch (type) {
        case "S":
            setData(prevState => ({
                ...prevState,
                edited_strengths: dataInput
            }));
            break;
        case "W":
            setData(prevState => ({
                ...prevState,
                edited_weaknesses: dataInput
            }));
            break;
        case "O":
            setData(prevState => ({
                ...prevState,
                edited_opportunities: dataInput
            }));
            break;
        case "T":
            setData(prevState => ({
                ...prevState,
                edited_threats: dataInput
            }));
            break;
    }
}

export default rorSwitchSetData;