import React from 'react'
import { Link } from 'gatsby'

import UserNavbar from './UserNavbar';
import styles from '../styles/navbar.module.scss';

import LogoutButton from './LogoutButton';

import Content from '../content/navbar.json'

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

    let { isLoggedUser, logo } = this.props;

    return (
      <React.Fragment>
        <nav className={`${styles.navbar}`} role="navigation" aria-label="main navigation">
          <div className={styles.navbarBrand}>
            <Link to={isLoggedUser ? '/a/' : '/'} className={styles.navbarItem}>
              {logo &&
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

          <div id="navbarBasicExample" className={`${styles.navbarMenu} ${this.state.navBarActiveClass}`}>
            <div className={styles.navbarStart}>
              {/* <Link to="/a/" className={styles.navbarItem}>
              Home
            </Link> */}
            </div>
            <div className={styles.navbarEnd}>
              {Content.items.map((item, index) => {
                if (!isLoggedUser && item.link.startsWith('/a/')) {
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
              <LogoutButton styles={styles} isLoggedUser={isLoggedUser} />
            </div>
          </div>
        </nav>
        {/* {isLoggedUser && <UserNavbar isLoggedUser={isLoggedUser} />} */}
      </React.Fragment>
    )
  }
}

export default Navbar
