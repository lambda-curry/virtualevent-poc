import React from 'react'
import { Link } from 'gatsby'

import styles from '../styles/navbar.module.scss';
import LogoutButton from './LogoutButton';

const UserNavbar = class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      active: false,
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

  render() {

    let { isLoggedUser, clearState } = this.props;

    return (
      <nav className={`${styles.navbar} ${styles.userNavbar}`} role="navigation" aria-label="main navigation">
        <div className={styles.navbarBrand}>
        </div>

        <div id="navbarBasicExample" className={`${styles.navbarMenu} ${this.state.navBarActiveClass}`}>
          <div className={styles.navbarStart}>
            <a role="button" className={`${styles.navbarBurger} ${styles.burger} ${styles.userBurger}`}
              aria-label="menu" aria-expanded="false" data-target="navbarBasicExample"
            >
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
            </a>
            <div className={styles.navbarItem}>
              <a className={`${styles.button} ${styles.isLarge} ${styles.lobbyButton}`} onClick={() => { this.props.clearState(); }}>
                <strong>Lobby</strong>
              </a>
            </div>
          </div>
          <div className={styles.navbarEnd}>
            <div className={styles.navbarItem}>
              <LogoutButton styles={styles} isLoggedUser={isLoggedUser} clearState={clearState} />
            </div>
          </div>
        </div>
      </nav>
    )
  }
}

export default UserNavbar
