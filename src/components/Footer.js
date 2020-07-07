import React from 'react'
import { connect } from 'react-redux'
import { StaticQuery, graphql } from "gatsby"

import footerContent from '../content/footer.json';

import styles from '../styles/footer.module.scss';

const Footer = ({ summit }) => (

  <StaticQuery
    query={graphql`
        query FooterQuery {
          summit {
            logo
          }
        }
      `}
    render={data => (
      <footer className="footer">
        <div className="columns">
          <div className="column is-one-fifth">
            {footerContent.logo.display &&
              <img src={summit && summit.logo ?
                summit.logo
                :
                data.summit && data.summit.logo ?
                  data.summit.logo
                  :
                  null
              } style={{maxHeight: '4rem'}}/>
            }
          </div>
        </div>
        <div className={`${styles.footerColummns} columns`}>
          <div className="column is-three-quarters">
            <div className="columns">
              {footerContent.columns.map((col, index) => {
                return (
                  <div className={`column is-3 ${index > 0 ? 'is-offset-1' : ''}`} key={index}>
                    <h4>
                      {col.title}
                    </h4>
                    {col.items.map((item, index) => (
                      <a href={item.link} key={index}>
                        <h5>{item.title}</h5>
                      </a>
                    ))}
                  </div>
                )
              })}
            </div>
          </div>

          <div className="column is-one-quarter">
            <h4>{footerContent.social.title}</h4>
            <div className={styles.socialContainer}>
              {footerContent.social.networks.map((net, index) => (
                net.display &&
                <a href={net.link} key={index}>
                  <i className={`fa icon is-large ${net.icon}`}></i>
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    )}
  />

)

const mapStateToProps = ({ summitState }) => ({
  summit: summitState.summit
})

export default connect(mapStateToProps)(Footer)
