import React from 'react'
import { connect } from 'react-redux'
import { Link, StaticQuery, graphql } from "gatsby"
import { handleResetReducers } from '../actions/event-actions'
import Navbar from './Navbar'

const Header = ({ isLoggedUser, summit, handleResetReducers }) => (

  <StaticQuery
    query={graphql`
        query HeaderQuery {
          summit {
            logo
          }
        }
      `}
    render={data => (
      <header>
        <Navbar isLoggedUser={isLoggedUser} clearState={handleResetReducers}
          logo={
            summit && summit.logo ?
              summit.logo
              :
              data.summit && data.summit.logo ?
                data.summit.logo
                :
                null
          } />
      </header>
    )}
  />
)

const mapStateToProps = ({ loggedUserState, summitState }) => ({
  isLoggedUser: loggedUserState.isLoggedUser,
  summit: summitState.summit
})

export default connect(mapStateToProps, { handleResetReducers })(Header)