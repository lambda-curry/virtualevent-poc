import React from 'react'
import { connect } from 'react-redux'
import { navigate } from 'gatsby'
import styles from '../styles/navbar.module.scss';

import LogoutButton from './LogoutButton';
import Link from './Link'
import ProfilePopupComponent from './ProfilePopupComponent';

import { updateProfilePicture, updateProfile } from '../actions/user-actions'

import Content from '../content/navbar.json'
import SummitObject from '../content/summit.json'

import { getEnvVariable, AUTHORIZED_DEFAULT_PATH } from '../utils/envVariables';

const Navbar = class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      active: false,
      showProfile: false,
      navBarActiveClass: '',
    }
  }

  toggleHamburger = () => {
    // toggle the active boolean in the state
    this.setState(
      {
        active: !this.state.active,
      },
      // after state has been updated,
      () => {
        // set the class in state for the navbar accordingly
        this.state.active
          ? this.setState({
            navBarActiveClass: `${styles.isActive}`,
          })
          : this.setState({
            navBarActiveClass: '',
          })
      }
    )
  }

  handlePictureUpdate = (picture) => {
    this.props.updateProfilePicture(picture);
  }

  handleProfileUpdate = (profile) => {
    this.props.updateProfile(profile)
  }

  handleTogglePopup = (profile) => {    
    if (profile) {
      document.body.classList.add('is-clipped');
    } else {
      document.body.classList.remove('is-clipped');
    }
    this.setState({ showProfile: profile })
  }

  goToProfile = () => {
    navigate('/a/profile');
  }

  render() {

    let { isLoggedUser, idpProfile, logo, idpLoading, location } = this.props;
    let { showProfile } = this.state;

    let { summit } = SummitObject
    let defaultPath = getEnvVariable(AUTHORIZED_DEFAULT_PATH) ? getEnvVariable(AUTHORIZED_DEFAULT_PATH) : '/a/';

    return (
      <React.Fragment>
        <nav className={`${styles.navbar}`} role="navigation" aria-label="main navigation">
          <div className={styles.navbarBrand}>
            <Link to={isLoggedUser ? defaultPath : '/'} className={styles.navbarItem}>
              {logo &&
                <img src={logo} alt={summit.name} />
              }
            </Link>

            <a role="button" className={`${styles.navbarBurger} ${styles.burger} ${this.state.navBarActiveClass}`}
              aria-label="menu" aria-expanded="false" data-target="navbarBasicExample"
              onClick={() => this.toggleHamburger()}>
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
            </a>
          </div>

          <div id="navbarBasicExample" className={`${styles.navbarMenu} ${this.state.navBarActiveClass}`}>
            <div className={styles.navbarStart}>
              {/* <Link to="/a/" className={styles.navbarItem}>
              Home
            </Link> */}
            </div>
            <div className={styles.navbarEnd}>
              {Content.items.map((item, index) => {                
                if (!isLoggedUser && item.requiresAuth || isLoggedUser && item.link.startsWith('/a/') && !item.link.startsWith('/a/schedule') && !item.requiresAuth) {
                  return null
                } else {
                  return (
                    item.display &&
                    <div className={styles.navbarItem} key={index}>
                      <Link to={item.link} className={styles.link}>
                        <span>{item.title}</span>
                      </Link>
                    </div>
                  )
                }
              })}
              {isLoggedUser &&
                <div className={styles.navbarItem}>
                  <img onClick={() => this.handleTogglePopup(!showProfile)} className={styles.profilePic} src={idpProfile?.picture} />
                  {showProfile &&
                    <ProfilePopupComponent
                      userProfile={idpProfile}
                      showProfile={showProfile}
                      idpLoading={idpLoading}
                      changePicture={(pic) => this.handlePictureUpdate(pic)}
                      changeProfile={(profile) => this.handleProfileUpdate(profile)}
                      closePopup={() => this.handleTogglePopup(!showProfile)}
                    />
                  }
                </div>
              }
              <LogoutButton styles={styles} isLoggedUser={isLoggedUser} />
            </div>
          </div>
        </nav>
      </React.Fragment>
    )
  }
}

export default connect(null, { updateProfilePicture, updateProfile })(Navbar)
