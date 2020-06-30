import React from 'react'
import { Link } from 'gatsby'
import github from '../img/github-icon.svg'
import logo from '../img/logo.svg'

import styles from '../styles/navbar.module.scss';
import LogoutButton from './LogoutButton';

const Navbar = class extends React.Component {
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

    let { isLoggedUser, clearState, logo } = this.props;

    return (
      <nav className={`${styles.navbar} ${styles.isBlack}`} role="navigation" aria-label="main navigation">
        <div className={styles.navbarBrand}>
          <Link to="/a/" className={styles.navbarItem}>
            { logo && 
            <img src={logo} alt="Show Logo" />
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

        <div id="navbarBasicExample" className={`${styles.navbarMenu} ${styles.isBlack} ${this.state.navBarActiveClass}`}>
          <div className={styles.navbarStart}>
            {/* <Link to="/a/" className={styles.navbarItem}>
              Home
            </Link> */}
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

export default Navbar
