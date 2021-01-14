import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { getGithubRepos } from "../../actions/profile";
import { connect } from "react-redux";
import Spinner from "../layout/Spinner";

const ProfileGithub = ({ userName, getGithubRepos, repos }) => {
  useEffect(() => {
    getGithubRepos(userName);
  }, [getGithubRepos, userName]);

  console.log(repos);
  return (
    <div className="profile-github">
      <h2 className="text-primary my-1">Github Repos</h2>
      {!repos ? (
        <Spinner />
      ) : (
        repos.map((repo) => (
          <div key={repo.id} className="repo bg-white p-1 my-1">
            <div>
              <h4>
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {repo.name}
                </a>
              </h4>
              <p>{repo.description}</p>
            </div>
            <div>
              <ul>
                <li className="badge badge-primary">
                  Stars: {repo.stargazers_count}
                </li>
                <li className="badge badge-dark">
                  Watchers: {repo.watchers_count}
                </li>
                <li className="badge badge-light">
                  Watchers: {repo.forks_count}
                </li>
              </ul>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

ProfileGithub.propTypes = {
  getGithubRepos: PropTypes.func.isRequired,
  userName: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  repos: state.profile.repos,
});

export default connect(mapStateToProps, { getGithubRepos })(ProfileGithub);
