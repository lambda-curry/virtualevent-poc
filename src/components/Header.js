import React from 'react'
import { connect } from 'react-redux'
import Navbar from './Navbar'

import SummitObject from '../content/summit.json';

const Header = ({ isLoggedUser, marketing }) => (

  <header>
    <Navbar marketing={marketing} isLoggedUser={isLoggedUser}
      logo={
        SummitObject.summit.logo ?
          '/img/Nintendo.svg'
          :
          SummitObject.summit.logo
      } />
  </header>
)

const mapStateToProps = ({ loggedUserState }) => ({
  isLoggedUser: loggedUserState.isLoggedUser
})

export default connect(mapStateToProps)(Header)