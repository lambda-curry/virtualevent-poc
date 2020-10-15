import React from 'react'
import PropTypes from 'prop-types'
import { navigate } from 'gatsby'
import { connect } from 'react-redux'

import SponsorHeader from '../components/SponsorHeader'
import LiveEventWidgetComponent from '../components/LiveEventWidgetComponent'
import ScheduleLiteComponent from '../components/ScheduleLiteComponent'
import AdvertiseSponsorsComponent from '../components/AdvertiseSponsorsComponent'
import DocumentsComponent from '../components/DocumentsComponent'
import DisqusComponent from '../components/DisqusComponent'
import SponsorBanner from '../components/SponsorBanner'
import HeroComponent from '../components/HeroComponent'
import Link from '../components/Link'

import SummitObject from '../content/summit.json'
import Sponsors from '../content/sponsors.json'
import SponsorsTiers from '../content/sponsors-tiers.json'

import Layout from '../components/Layout'

import styles from '../styles/sponsor-page.module.scss'
import envVariables from "../utils/envVariables";
import {AttendanceTracker} from "openstack-uicore-foundation/lib/components";

export const SponsorPageTemplate = class extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      sponsor: null,
      notFound: null,
      tier: null
    }
  }

  componentWillMount() {
    const { sponsorId } = this.props;
    const sponsor = Sponsors.tierSponsors.map(t => t.sponsors.find(s => s.id === parseInt(sponsorId))).filter(e => e !== undefined)[0];
    if (!sponsor) {
      this.setState({ notFound: true });
    } else {
      const tier = Sponsors.tierSponsors.find(t => t.sponsors.find(s => s === sponsor)).tier[0];
      const tierData = SponsorsTiers.tiers.find(t => t.id === tier.value);
      if (sponsor) this.setState({ sponsor: sponsor, tier: tierData });
    }
  }

  onEventChange = (ev) => {
    const { eventId } = this.props;
    if (eventId !== `${ev.id}`) {
      navigate(`/a/event/${ev.id}`);
    }
  }

  render() {
    const { loggedUser, user } = this.props;
    const { sponsor, tier, notFound } = this.state;
    let { summit } = SummitObject;
    const { disqus, liveEvent, schedule, banner } = tier.sponsorPage.widgets;

    if (notFound) {
      return <HeroComponent title="Sponsor not found" redirectTo="/a/sponsors" />
    } else {
      const { disqus, liveEvent, schedule, banner } = tier.sponsorPage.widgets;
      return (
        <>
          <AttendanceTracker
              sourceName="SPONSOR"
              sourceId={sponsor.sponsorId}
              summitId={summit.id}
              apiBaseUrl={envVariables.SUMMIT_API_BASE_URL}
              accessToken={loggedUser.accessToken}
          />
          <SponsorHeader sponsor={sponsor} tier={tier} />
          <section className={`section px-0 ${tier.sponsorPage.sponsorTemplate === 'big-header' ? 'pt-5' : 'pt-0'} pb-0`}>
            {sponsor.sideImage &&
              <div className="columns mx-0 mt-0 mb-6">
                <div className={`column is-half px-5 py-0 ${styles.introHalf}`}>
                  <h1>{sponsor.title}</h1>
                  <span>
                    {sponsor.intro}
                  </span>
                </div>
                <div className="column is-half px-0 py-0">
                  <img src={sponsor.sideImage} className={styles.sideImage} />
                </div>
              </div>
            }
            <div className="columns mx-0 my-0">
              <div className="column is-three-quarters px-5 py-0">
                {!sponsor.sideImage &&
                  <div className={styles.sponsorIntro}>
                    <h1>{sponsor.title}</h1>
                    <span>
                      {sponsor.intro}
                    </span>
                  </div>
                }
                {liveEvent &&
                  <LiveEventWidgetComponent
                    onEventClick={(ev) => this.onEventChange(ev)}
                    sponsorId={sponsor.companyId}
                  />
                }
                {schedule &&
                  <ScheduleLiteComponent
                    accessToken={loggedUser.accessToken}
                    onEventClick={(ev) => this.onEventChange(ev)}
                    onViewAllEventsClick={() => this.onViewAllEventsClick()}
                    landscape={false}
                    showDetails={false}
                    yourSchedule={false}
                    showNav={false}
                    showAllEvents={false}
                    eventCount={3}
                    title="Happening Now"
                    sponsorId={sponsor.companyId}
                  />
                }
                {banner && <SponsorBanner sponsor={sponsor} bgColor={sponsor.sponsorColor} />}
              </div>
              <div className="column is-one-quarter px-5 py-0">
                {sponsor.chatLink &&
                  <div className={styles.videoChatButton}>
                    <Link className={styles.link} to={sponsor.chatLink}>
                      <button className={`${styles.button} button is-large`} style={{ backgroundColor: `${sponsor.sponsorColor}` }}>
                        <b>LIVE VIDEO CHAT!</b>
                      </button>
                    </Link>
                  </div>
                }
                {disqus &&
                  <DisqusComponent disqusSSO={user.disqusSSO} className={styles.disqusContainerSponsor} summit={summit} title="" sponsor={sponsor} />
                }
                {sponsor.documents &&
                  <DocumentsComponent event={sponsor.documents} sponsor={true} />
                }
                {sponsor.columnAds &&
                  <AdvertiseSponsorsComponent ads={sponsor.columnAds} style={{ marginTop: '2em' }} />
                }
              </div>
            </div>
          </section>
        </>
      )
    }
  }
}

const SponsorPage = (
  {
    loggedUser,
    sponsorId,
    user,
    getDisqusSSO
  }
) => {

  return (
    <Layout>
      <SponsorPageTemplate
        loggedUser={loggedUser}
        sponsorId={sponsorId}
        user={user}
        getDisqusSSO={getDisqusSSO}
      />
    </Layout>
  )
}

SponsorPage.propTypes = {
  loggedUser: PropTypes.object,
  sponsorId: PropTypes.string,
  user: PropTypes.object,
  getDisqusSSO: PropTypes.func,
}

SponsorPageTemplate.propTypes = {
  loggedUser: PropTypes.object,
  sponsorId: PropTypes.string,
  user: PropTypes.object,
  getDisqusSSO: PropTypes.func,
}

const mapStateToProps = (
  {
    loggedUserState,
    userState,
  }
) => ({

  loggedUser: loggedUserState,
  user: userState,
})

export default connect(mapStateToProps, {})(SponsorPage);