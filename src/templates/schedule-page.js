import React from 'react'
import PropTypes from 'prop-types'
import { navigate } from 'gatsby'
import { connect } from 'react-redux'
import Layout from '../components/Layout'
import ScheduleLiteComponent from "../components/ScheduleLiteComponent";


const SchedulePage = ({summit, loggedUser}) => {

  return (
    <Layout>
      <div className="container">
        <h1>Schedule</h1>
        <hr/>
        <ScheduleLiteComponent
            accessToken={loggedUser.accessToken}
            landscape={true}
            showNav={true}
            showFilters={true}
            eventCount={100}
            onEventClick={ev => navigate(`/a/event/${ev}`)}
        />
      </div>
    </Layout>
  )
}

SchedulePage.propTypes = {
  location: PropTypes.object,
}

const mapStateToProps = ({ loggedUserState, summitState, userState }) => ({
  loggedUser: loggedUserState,
  summit: summitState.summit,
  user: userState,
});

export default connect(
  mapStateToProps, {}
)(SchedulePage);
