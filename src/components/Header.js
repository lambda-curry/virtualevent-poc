import React from 'react'
import { connect } from 'react-redux'
import { StaticQuery, graphql } from "gatsby"
import Navbar from './Navbar'

const Header = ({ isLoggedUser, location, idpProfile, idpLoading, summit}) => (

  <StaticQuery
    query={graphql`
        query HeaderQuery {
          summit {
            logo
          }
        }
      `}
    render={data => (
      <Navbar isLoggedUser={isLoggedUser} idpProfile={idpProfile} idpLoading={idpLoading} location={location}
        logo={
          summit && summit.logo ?
            summit.logo
            :
            data.summit && data.summit.logo ?
              data.summit.logo
              :
              null
        } />
    )}
  />
)

const mapStateToProps = ({ loggedUserState, summitState, userState }) => ({
  isLoggedUser: loggedUserState.isLoggedUser,
  idpProfile: userState.idpProfile,
  idpLoading: userState.loadingIDP,
  summit: summitState.summit
})

export default connect(mapStateToProps)(Header)