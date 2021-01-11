import React, { Fragment } from "react";
import PropTypes from "prop-types";
import profile from "../../reducers/profile";
import Spinner from "../layout/Spinner";

const ProfileTop = ({
  profile: {
    user: { name, avatar },
    status,
    company,
  },
  loading,
}) => {
  return (
    <Fragment>
      {!loading && !!profile && (
        <Fragment>
          <div>
            <div className="profile-top bg-primary p-2">
              <img className="round-img my-1" src={avatar} alt="" />
              <h1 className="large">{`${name}`}</h1>
              <p className="lead">{`${status} at ${company}`}</p>
              <p>Seattle, WA</p>
              <div className="icons my-1">
                <a href="#" target="_blank" rel="noopener noreferrer">
                  <i className="fas fa-globe fa-2x"></i>
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-twitter fa-2x"></i>
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-facebook fa-2x"></i>
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-linkedin fa-2x"></i>
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-youtube fa-2x"></i>
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-instagram fa-2x"></i>
                </a>
              </div>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

ProfileTop.propTypes = {};

export default ProfileTop;
