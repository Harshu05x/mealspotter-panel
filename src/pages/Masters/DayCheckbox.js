import React from "react";
const DayCheckBox = props =>  {

    return (
        <div className="form-check form-check-success mb-3">
            <input
                type="checkbox"
                className="form-check-input"
                id={`DeliveryDay${props.day}`}
                checked={props.data && props.data.length > 0 && props.data.indexOf(props.day) !== -1}
                onChange={(e) => props.onChange(e.target.value)}
                value={props.day}
            />
            <label
                className="form-check-label"
                htmlFor={`DeliveryDay${props.day}`}
            >
                {props.label}
            </label>
        </div>
    )

}
export default DayCheckBox;