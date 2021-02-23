import React, { useContext } from 'react';
import DataAreaContext from "../../../utils/DataAreaContext";

function HeaderAuthenticated() {
  const { loginDataObj } = useContext(DataAreaContext);

  return(
    <>
    <div className="welcome-div">Welcome, { loginDataObj.email }</div>
    </>
  )
}

export default HeaderAuthenticated;