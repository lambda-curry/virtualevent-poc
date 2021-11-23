import React from 'react'
import { connect } from 'react-redux'
import { StaticQuery, graphql } from "gatsby"

import FooterMarketing from './FooterMarketing';
import footerContent from '../content/footer.json';
import Link from './Link'
import styles from '../styles/footer.module.scss';

const Footer = ({ summit, marketing }) => {

  if (marketing) {
    return (
      <FooterMarketing />
    )
  } else {
    return (
      <StaticQuery
        query={graphql`
        query FooterQuery {
          summit {
            logo
          }
        }
      `}
        render={data => (
          <React.Fragment>
            {footerContent.columns.filter(col => col.display === false).length === footerContent.columns.length ?
              <React.Fragment>
                {footerContent.logo.display && footerContent.social.display ?
                  <footer className="footer">
                    <div className={`${styles.footerColummns} columns`}>
                      <div className="column is-one-quarter">
                        <img alt="logo" src={summit && summit.logo ?
                          summit.logo
                          :
                          data.summit && data.summit.logo ?
                            data.summit.logo
                            :
                            null
                        } style={{ marginTop: '10px' }} />
                      </div>
                      {footerContent.social.display &&
                        <div className="column is-one-quarter is-offset-half">
                          <h4>{footerContent.social.title}</h4>
                          <div className={styles.socialContainer}>
                            {footerContent.social.networks.map((net, index) => (
                              net.display &&
                              <Link to={net.link} key={index}>
                                <i className={`fa icon is-large ${net.icon}`}></i>
                              </Link>
                            ))}
                          </div>
                        </div>
                      }
                    </div>
                  </footer>
                  : null
                }
              </React.Fragment>
              :
              <footer className="footer">
                {footerContent.logo.display ?
                  <div className="columns">
                    <div className="column is-one-quarter">
                      <img alt="logo" src={summit && summit.logo ?
                        summit.logo
                        :
                        data.summit && data.summit.logo ?
                          data.summit.logo
                          :
                          null
                      } style={{ margin: '10px 0 4rem' }} />
                    </div>
                  </div>
                  : null
                }
                <div className={`${styles.footerColummns} columns`}>
                  <div className="column is-three-quarters">
                    <div className="columns" style={{ flexWrap: 'wrap' }}>
                      {footerContent.columns.map((col, index) => {
                        return (
                          col.display &&
                          <div className={`column is-3 ${index > 0 && index % 3 !== 0 && index !== 0 ? 'is-offset-1' : ''}`} key={index}>
                            <h4>
                              {col.title}
                            </h4>
                            {col.items.map((item, index) => (
                              <Link to={item.link} className={styles.link} key={index}>
                                <h5>{item.title}</h5>
                              </Link>
                            ))}
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {footerContent.social.display &&
                    <div className="column is-one-quarter">
                      <h4>{footerContent.social.title}</h4>
                      <div className={styles.socialContainer}>
                        {footerContent.social.networks.map((net, index) => (
                          net.display &&
                          <Link to={net.link} className={styles.link} key={index}>
                            <i className={`fa icon is-large ${net.icon}`}></i>
                          </Link>
                        ))}
                      </div>
                    </div>
                  }
                </div>
              </footer>
            }
            <div className={styles.legalsBar}>
              {footerContent.legal.map((item, index) => {
                return (
                  <Link to={item.link} className={styles.link} key={index}>
                    <span className={styles.legalItem}>
                      {item.title}
                    </span>
                  </Link>
                )
              })}
              <span className={styles.copyright}>
                All Rights Reserved &copy; 2021
          </span>
            </div>
          </React.Fragment>
        )}
      />
    )
  }
}

const mapStateToProps = ({ summitState }) => ({
  summit: summitState.summit
})

export default connect(mapStateToProps)(Footer)
