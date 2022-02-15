import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Layout from '../components/Layout';
import PosterGrid from '../components/poster-grid';

import {
    getVoteablePresentations,
    VOTEABLE_PRESENTATIONS_UPDATE_FILTER,
    updateFilter
} from '../actions/presentation-actions';
import {castPresentationVote, uncastPresentationVote} from '../actions/user-actions';
import ScheduleFilters from "../components/ScheduleFilters";
import styles from '../styles/posters-page.module.scss';
import FilterButton from "../components/FilterButton";
import {filterEventsByAccessLevels} from '../utils/authorizedGroups';

const PostersPage = ({
                         location,
                         getVoteablePresentations,
                         posters,
                         votes,
                         castPresentationVote,
                         uncastPresentationVote,
                         summit,
                         colorSettings,
                         filters,
                         userProfile,
                         updateFilter,
                         allPosters
                     }) => {
    const [canVote, setCanVote] = useState(true);
    const [showFilters, setShowfilters] = useState(false);
    // todo: get from url
    const trackGroupId = 0;

    const filterByTrackGroup = (originalEvents, currentTrackGroupId = 0) => {
        if(currentTrackGroupId == 0)
            return originalEvents;
        return originalEvents.filter( (ev) => {
            return ev?.track?.track_groups.includes(currentTrackGroupId);
        });
    }

    const filterProps = {
        summit,
        events: filterByTrackGroup(filterEventsByAccessLevels(allPosters, userProfile), trackGroupId),
        allEvents: filterByTrackGroup(filterEventsByAccessLevels(allPosters, userProfile), trackGroupId),
        filters,
        triggerAction: (action, payload) => {
            updateFilter(payload, VOTEABLE_PRESENTATIONS_UPDATE_FILTER);
        },
        marketingSettings: colorSettings,
        colorSource: '',
    };

    const toggleVote = (presentation, isVoted) => {
        isVoted ? castPresentationVote(presentation) : uncastPresentationVote(presentation);
    };

    useEffect(() => {
        getVoteablePresentations();
    }, []);

    return (
        <Layout location={location}>
            <div className="container">
                {posters &&
                <div className={`${styles.wrapper} ${showFilters ? styles.showFilters : ""}`}>
                    <div className={styles.postersWrapper}>
                        <PosterGrid posters={filterByTrackGroup(filterEventsByAccessLevels(posters, userProfile), trackGroupId)} canVote={canVote} votes={votes} toggleVote={toggleVote}/>
                    </div>
                    <div className={styles.filterWrapper}>
                        <ScheduleFilters {...filterProps} />
                    </div>
                    <FilterButton open={showFilters} onClick={() => setShowfilters(!showFilters)}/>
                </div>
                }
            </div>
        </Layout>
    );
};

PostersPage.propTypes = {};

const mapStateToProps = ({presentationsState, userState, summitState, settingState}) => ({
    userProfile: userState.userProfile,
    posters: presentationsState.voteablePresentations.filteredPresentations,
    allPosters: presentationsState.voteablePresentations.originalPresentations,
    filters: presentationsState.voteablePresentations.filters,
    votes: userState.attendee.presentation_votes,
    summit: summitState.summit,
    colorSettings: settingState.colorSettings,
});

export default connect(mapStateToProps, {
    getVoteablePresentations,
    castPresentationVote,
    uncastPresentationVote,
    updateFilter
})(PostersPage);
