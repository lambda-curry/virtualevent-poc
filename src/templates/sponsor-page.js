import React from 'react'
import PropTypes from 'prop-types'
import { navigate } from 'gatsby'
import { connect } from 'react-redux'

import { getAccessToken } from 'openstack-uicore-foundation/lib/methods';

import SponsorHeader from '../components/SponsorHeader'
import AttendanceTrackerComponent from '../components/AttendanceTrackerComponent'
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

import { scanBadge } from '../actions/user-actions'
import { getDisqusSSO } from '../actions/user-actions'

import MarkdownIt from "markdown-it";

export const SponsorPageTemplate = class extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      sponsor: null,
      notFound: null,
      parsedIntro: null,
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
      const parser = new MarkdownIt({
        html: false,
        breaks: true,
        linkify: true,
        xhtmlOut: true,
        typographer: true,
      });
      const parsedIntro = parser.render(sponsor.intro);
      if (sponsor) this.setState({ sponsor: sponsor, tier: tierData, parsedIntro: parsedIntro });
    }
  }

  onEventChange = (ev) => {
    const { eventId } = this.props;
    if (eventId !== `${ev.id}`) {
      navigate(`/a/event/${ev.id}`);
    }
  }

  onBadgeScan = () => {
    const { sponsor: { sponsorId } } = this.state;
    this.props.scanBadge(sponsorId);
  }

  onViewAllEventsClick() {
    navigate('/a/schedule')
  }

  render() {
    const { user } = this.props;
    const { sponsor, tier, notFound, parsedIntro } = this.state;
    let { summit } = SummitObject;

    if (notFound) {
      return <HeroComponent title="Sponsor not found" redirectTo="/a/sponsors" />
    } else {
      const { disqus, liveEvent, schedule, banner } = tier.sponsorPage.widgets || {};
      return (
        <React.Fragment>
          <AttendanceTrackerComponent
            sourceName="SPONSOR"
            sourceId={sponsor.sponsorId}
          />
          <SponsorHeader sponsor={sponsor} tier={tier} scanBadge={() => this.onBadgeScan()} />
          <section className={`section px-0 ${tier.sponsorPage.sponsorTemplate === 'big-header' ? 'pt-5' : 'pt-0'} pb-0`}>
            {sponsor.sideImage &&
              <div className="columns mx-0 mt-0 mb-6">
                <div className={`column is-half px-5 py-0 ${styles.introHalf}`}>
                  {sponsor.title && <h1>{sponsor.title}</h1>}
                  {sponsor.intro && <span dangerouslySetInnerHTML={{ __html: parsedIntro }} />}
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
                    {sponsor.title && <h1>{sponsor.title}</h1>}
                    {sponsor.intro && <span dangerouslySetInnerHTML={{ __html: parsedIntro }} />}
                  </div>
                }
                {liveEvent &&
                  <LiveEventWidgetComponent
                    onEventClick={(ev) => this.onEventChange(ev)}
                    sponsorId={sponsor.companyId}
                    showSponsor={sponsor.companyId ? true : false}
                  />
                }
                {schedule &&
                  <ScheduleLiteComponent
                    onEventClick={(ev) => this.onEventChange(ev)}
                    onViewAllEventsClick={() => this.onViewAllEventsClick()}
                    landscape={false}
                    yourSchedule={false}
                    showNav={false}
                    showAllEvents={false}
                    eventCount={3}
                    sponsorId={sponsor.companyId}
                  />
                }
                {banner && <SponsorBanner sponsor={sponsor} bgColor={sponsor.sponsorColor} scanBadge={() => this.onBadgeScan()} />}
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
                  <DocumentsComponent event={sponsor.documents} />
                }
                {sponsor.columnAds &&
                  <AdvertiseSponsorsComponent ads={sponsor.columnAds} style={{ marginTop: '2em' }} />
                }
              </div>
            </div>
          </section>
        </React.Fragment>
      )
    }
  }
}

const SponsorPage = (
  {
    location,
    user,
    getDisqusSSO,
    scanBadge,
    sponsorId
  }
) => {

  return (
    <Layout location={location}>
      <SponsorPageTemplate
        user={user}
        getDisqusSSO={getDisqusSSO}
        scanBadge={scanBadge}
        sponsorId={sponsorId}
      />
    </Layout>
  )
}

SponsorPage.propTypes = {
  user: PropTypes.object,
  getDisqusSSO: PropTypes.func,
  scanBadge: PropTypes.func,
  sponsorId: PropTypes.string,
}

SponsorPageTemplate.propTypes = {
  user: PropTypes.object,
  getDisqusSSO: PropTypes.func,
  scanBadge: PropTypes.func,
  sponsorId: PropTypes.string,
}

const mapStateToProps = ({ userState }) => ({ user: userState })

export default connect(mapStateToProps, { scanBadge, getDisqusSSO })(SponsorPage);