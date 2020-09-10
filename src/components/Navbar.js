import React from 'react'

import UserNavbar from './UserNavbar';
import styles from '../styles/navbar.module.scss';

import LogoutButton from './LogoutButton';

import Link from './Link'
import Content from '../content/navbar.json'

import SummitObject from '../content/summit.json'

import envVariables from '../utils/envVariables'

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

    let { isLoggedUser, logo, marketing } = this.props;

    let { summit } = SummitObject
    let defaultPath = envVariables.AUTHORIZED_DEFAULT_PATH ? envVariables.AUTHORIZED_DEFAULT_PATH : '/a/';

    console.log('is marketing', marketing)

    return (
      <React.Fragment>
        <nav className={`${styles.navbar}`} role="navigation" aria-label="main navigation">
          <div className={`${styles.navbarBrand} ${marketing ? `${styles.navbarBrandHalfColor}` : ``}`}>
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

          <div id="navbarBasicExample" className={`${styles.navbarMenu} ${marketing ? `${styles.navbarMenuHalfColor}` : ``} ${this.state.navBarActiveClass}`}>
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
                    <div className={`${styles.navbarItem} ${marketing ? `${styles.navbarItemHalfColor}` : ``}`} key={index}>
                      <Link to={item.link} className={`${styles.link} ${marketing ? `${styles.linkHalfColor}`:``}`}>
                        <span>{item.title}</span>
                      </Link>
                    </div>
                  )
                }
              })}
              <LogoutButton styles={styles} marketing={marketing} isLoggedUser={isLoggedUser} />
            </div>
          </div>
        </nav>
        {/* {isLoggedUser && <UserNavbar isLoggedUser={isLoggedUser} />} */}
      </React.Fragment>
    )
  }
}

export default Navbar
