import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { getGithubRepos } from "../../actions/profile";
import { connect } from "react-redux";


const ProfileGithub = ({ userName, getGithubRepos, repos }) => {
  // useEffect((userName) => getGithubRepos(userName), [getGithubRepos]);
  console.log(userName);
  console.log(repos);

  return <div></div>;
};

ProfileGithub.propTypes = {
  getGithubRepos: PropTypes.func.isRequired,
  userName: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  repos: state.profile.repos,
});

export default connect(mapStateToProps, { getGithubRepos })(ProfileGithub);
