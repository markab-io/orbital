import React from "react";
import { Register } from "@markab.io/orbital-templates";

const RegisterModule = ({
  onChange,
  onSuccess,
  onSubmit,
  onProviderAuth,
  history,
  onLogin,
  classes,
  bg
}) => {
  return (
    <React.Fragment>
      <Register
        bg={bg}
        onChange={onChange}
        onSuccess={onSuccess}
        onSubmit={onSubmit}
        onProviderAuth={onProviderAuth}
        history={history}
        onLogin={onLogin}
        classes={classes}
      />
    </React.Fragment>
  );
};

export default RegisterModule;
