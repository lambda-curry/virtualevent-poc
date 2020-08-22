import React from 'react'
import PropTypes from 'prop-types'
import { navigate } from 'gatsby'
import { connect } from 'react-redux'
import Layout from '../components/Layout'
import ScheduleLiteComponent from "../components/ScheduleLiteComponent";
import SummitObject from '../content/summit.json'

const SchedulePage = ({loggedUser}) => {

  let { summit } = SummitObject;

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
            showAllEvents={true}
            eventCount={100}
            onEventClick={ev => navigate(`/a/event/${ev.id}`)}
        />
      </div>
    </Layout>
  )
}

SchedulePage.propTypes = {
  location: PropTypes.object,
}

const mapStateToProps = ({ loggedUserState, userState }) => ({
  loggedUser: loggedUserState,
  user: userState,
});

export default connect(
  mapStateToProps, {}
)(SchedulePage);
