import React, { Fragment } from "react";

const PageNotFound = () => {
  return (
    <Fragment>
      <h1 className="x-large text-primary">
        <i className="fas fa-exclamation-trangle" /> Page Not Found
      </h1>
      <p className="large">Sorry, this page does not exists</p>
    </Fragment>
  );
};

export default PageNotFound;
