import React, { useState } from "react";
import { connect } from "react-redux";
import LogoutButton from "./LogoutButton";
import Link from "./Link";
import ProfilePopupComponent from "./ProfilePopupComponent";
import { updateProfilePicture, updateProfile } from "../actions/user-actions";
import { getEnvVariable, AUTHORIZED_DEFAULT_PATH } from "../utils/envVariables";
import Content from "../content/navbar.json";

import styles from "../styles/navbar.module.scss";

const Navbar = ({
  isLoggedUser,
  idpProfile,
  logo,
  idpLoading,
  summit,
  updateProfilePicture,
  updateProfile,
}) => {
  const [active, setActive] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const toggleHamburger = () => {
    // toggle the active boolean in the state
    setActive(!active);
  };

  const handleTogglePopup = () => {
    if (showProfile) {
      document.body.classList.remove("is-clipped");
    } else {
      document.body.classList.add("is-clipped");
    }
    setShowProfile(!showProfile);
  };

  // we assume that all pages under /a/* requires auth except /a/schedule
  // item.requiresAuth allows to mark specific pages that are not under /a/* pattern.
  const showItem = (item) => {
    const passPageRestriction = !item.pageRestriction || item.pageRestriction === 'ANY' ||
        (item.pageRestriction === 'EVENT' && item.link.startsWith("/a/event")) ||
        (item.pageRestriction === 'MARKETING' && item.link === "/") ||
        (item.pageRestriction === 'LOBBY' && item.link === "/a/");

    return item.display && (!item.requiresAuth || isLoggedUser) && passPageRestriction;
  };

  const defaultPath = getEnvVariable(AUTHORIZED_DEFAULT_PATH)
    ? getEnvVariable(AUTHORIZED_DEFAULT_PATH)
    : "/a/";
  const navBarActiveClass = active ? styles.isActive : "";

  return (
    <React.Fragment>
      <nav
        className={`${styles.navbar}`}
        role="navigation"
        aria-label="main navigation"
      >
        <div className={styles.navbarBrand}>
          <Link
            to={isLoggedUser ? defaultPath : "/"}
            className={styles.navbarItem}
          >
            {logo && <img src={logo} alt={summit.name} />}
          </Link>

          <button
            className={`link ${styles.navbarBurger} ${styles.burger} ${navBarActiveClass}`}
            aria-label="menu"
            aria-expanded="false"
            data-target="navbarBasicExample"
            onClick={() => toggleHamburger()}
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>
        </div>

        <div
          id="navbarBasicExample"
          className={`${styles.navbarMenu} ${navBarActiveClass}`}
        >
          <div className={styles.navbarStart} />
          <div className={styles.navbarEnd}>
            {Content.items.filter(showItem).map((item, index) => (
              <div className={styles.navbarItem} key={index}>
                <Link to={item.link} className={styles.link}>
                  <span>{item.title}</span>
                </Link>
              </div>
            ))}
            {isLoggedUser && (
              <div className={styles.navbarItem}>
                <button className="link" onClick={() => handleTogglePopup()}>
                  <img
                    alt="profile pic"
                    className={styles.profilePic}
                    src={idpProfile?.picture}
                  />
                </button>
                {showProfile && (
                  <ProfilePopupComponent
                    userProfile={idpProfile}
                    showProfile={showProfile}
                    idpLoading={idpLoading}
                    changePicture={updateProfilePicture}
                    changeProfile={updateProfile}
                    closePopup={() => handleTogglePopup()}
                  />
                )}
              </div>
            )}
            <LogoutButton styles={styles} isLoggedUser={isLoggedUser} />
          </div>
        </div>
      </nav>
    </React.Fragment>
  );
};

const mapStateToProps = ({ summitState }) => ({
  summit: summitState.summit,
});

export default connect(mapStateToProps, {
  updateProfilePicture,
  updateProfile,
})(Navbar);
