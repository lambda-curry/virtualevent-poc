import React from 'react'
import { connect } from 'react-redux'
import { StaticQuery, graphql } from "gatsby"
import Navbar from './Navbar'

const Header = ({ isLoggedUser, summit, marketing}) => (

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
        <Navbar marketing={marketing} isLoggedUser={isLoggedUser}
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

export default connect(mapStateToProps)(Header)