import Select from 'react-select'

const SelectHandler = (props) => {
    return (
        <div>
            <p><b>To be Approved By:</b></p>
            <Select
                styles={{
                    menu: provided => ({ ...provided, zIndex: 9999, color: 'black' }),
                }}
                options={props.handlerList}
                name="handler"
                onChange={props.setHandler}
            />
        </div>
    )
}

export default SelectHandler;