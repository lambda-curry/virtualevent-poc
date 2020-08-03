import React from 'react'
import { navigate } from "gatsby"

export default class
  LogoutButton extends React.Component {

  onClickLogout() {
    navigate('/auth/logout', {
      state: {
        backUrl: window.location.pathname
      }
    })
  }

  render() {
    let { isLoggedUser, styles } = this.props;

    if (isLoggedUser) {
      return (

        <div className={styles.buttons}>
          {/* <a className={`${styles.userIcon}`}>
            <i className="fa fa-exclamation-circle icon is-medium" style={{fontSize: '1.5rem'}} />
          </a>
          <a className={`${styles.userIcon}`}>
            <i className="fa fa-cog icon is-medium" style={{fontSize: '1.5rem'}} />
          </a>
          <a className={`${styles.userIcon}`}>
            <i className="fa fa-bell icon is-medium" style={{fontSize: '1.5rem'}} />
          </a>           */}
          <a className={`${styles.userIcon}`} title="Logout" onClick={() => this.onClickLogout()}>
            <i className="fa fa-sign-out icon is-medium" style={{fontSize: '1.5rem'}} />
          </a>
        </div>
      );
    } else {
      return null;
    }
  }
}