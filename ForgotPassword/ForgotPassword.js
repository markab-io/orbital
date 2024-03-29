import React from "react";
import { ForgotPassword } from "@markab.io/orbital-templates";

const ForgotPasswordModule = ({
  classes,
  location,
  history,
  forgotPassword,
  match
}) => {
  return (
    <React.Fragment>
      <ForgotPassword
        classes={classes}
        location={location}
        history={history}
        forgotPassword={forgotPassword}
        match={match}
      />
    </React.Fragment>
  );
};

export default ForgotPasswordModule;
