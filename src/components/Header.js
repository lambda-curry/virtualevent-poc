import React from 'react'
import { connect } from 'react-redux'
import { StaticQuery, graphql } from "gatsby"
import LogoutButton from './LogoutButton'
import { handleResetReducers } from '../state/event-actions'

const Header = ({ isLoggedUser, summit, handleResetReducers }) => (

  <StaticQuery
    query={graphql`
        query HeadingQuery {
          summit {
            logo
          }
        }
      `}
    render={data => (
      <header>
        <div className="header">
          {summit.logo ?
            <img src={summit.logo} alt="Show Logo" />
            :
            data.summit.logo ?
              <img src={data.summit.logo} alt="Show Logo" />
              :
              <img src="/img/opendevbadge-nav.png" alt="Show Logo" />
          }
          <LogoutButton isLoggedUser={isLoggedUser} clearState={handleResetReducers} />
        </div>
      </header>
    )}
  />
)

const mapStateToProps = ({ loggedUserState, summitState }) => ({
  isLoggedUser: loggedUserState.isLoggedUser,
  summit: summitState.summit
})

export default connect(mapStateToProps, { handleResetReducers })(Header)