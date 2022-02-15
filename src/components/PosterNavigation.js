import React from 'react'
import { connect } from "react-redux";
import Link from './Link'
import { getSponsorURL } from '../utils/urlFormating'

import styles from '../styles/poster-components.module.scss'

const PosterNavigation = ({ sponsorsState, tiers }) => {
  let renderButton = false;
  return (
    <>
      <div className={`columns mx-0 my-0 py-5 ${styles.navigationContainer}`}>
        <button className={styles.navigationButton}>
          Previous Poster
        </button>
        <button className={styles.navigationButton}>
          View All
        </button>
        <button className={styles.navigationButton}>
          Next Poster
        </button>
      </div>
      {sponsorsState.map((s, tierIndex) => {
        const sponsors = s.sponsors;
        const tier = tiers.find(t => t.id === s.tier[0].value);
        if (!tier) return null;
        const template = 'poster-detail';
        if (sponsors?.length > 0) {
          renderButton = true;
          switch (template) {
            case 'poster-detail': {
              return (
                <div className={`${styles.otherPosters}`} key={tierIndex}>
                  <span className={styles.title}><b>More like this</b></span>
                  <div className={styles.postersContainer}>
                    {sponsors.map((sponsor, index) => {
                      return (
                        sponsor.usesSponsorPage ?
                          <Link className={styles.poster} to={`/a/sponsor/${getSponsorURL(sponsor.id, sponsor.name)}`} key={`${s.tier.label}-${index}`}>
                            <img src={sponsor.logo} alt={sponsor.name} />
                          </Link>
                          :
                          <img className={styles.poster} src={sponsor.logo} alt={sponsor.name} />
                      )
                    })}
                  </div>
                </div>
              )
            }
            default:
              return null;
          }
        } else {
          return null;
        }
      })}
    </>
  )
};

const mapStateToProps = ({ sponsorState }) => ({
  sponsorsState: sponsorState.sponsors,
  tiers: sponsorState.tiers,
  lobbyButton: sponsorState.lobbyButton
});

export default connect(mapStateToProps, {})(PosterNavigation);