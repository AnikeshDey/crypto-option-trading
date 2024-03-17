
import React from "react";
import "./ToggleSwitch.css";
  
const ToggleSwitch = ({ checked, handleChange }) => {
  return (
    <div className="container" onClick={handleChange}>
      <div className="toggle-switch">

        {
          checked == true ?
          <input type="checkbox" className="checkbox" checked={true} />
          :
          <input type="checkbox" className="checkbox" checked={false} />
        }
        {/* {
          checked ?
          <input type="checkbox" className="checkbox" defaultChecked />
          :
          <input type="checkbox" className="checkbox" checked={false} />
        } */}
          
              {/* <input type="checkbox" className="checkbox" defaultChecked /> */}
          
        
        <label className="label">
          <span className="inner" />
          <span className="switch" />
        </label>
      </div>
    </div>
  );
};
  
export default ToggleSwitch;