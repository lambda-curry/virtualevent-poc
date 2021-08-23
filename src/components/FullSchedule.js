import React from "react";
import { connect } from "react-redux";
import { addToSchedule, removeFromSchedule } from "../actions/user-actions";
import { getShareLink, callAction } from "../actions/schedule-actions";
import {needsLogin} from "../utils/alerts";

// these two libraries are client-side only
import Schedule from "full-schedule-widget/dist";
import "full-schedule-widget/dist/index.css";

const FullSchedule = ({
  summit,
  events,
  filters,
  view,
  colorSource,
  className,
  userProfile,
  colorSettings,
  homeSettings,
  addToSchedule,
  removeFromSchedule,
  callAction,
  ...rest
}) => {

  if (!summit) return null;

  const componentProps = {
    title: "Schedule",
    events: events,
    summit: summit,
    view: view,
    marketingSettings: colorSettings,
    userProfile: userProfile,
    triggerAction: (action, payload) => {
      switch (action) {
        case "ADDED_TO_SCHEDULE": {
          return addToSchedule(payload.event);
        }
        case "REMOVED_FROM_SCHEDULE": {
          return removeFromSchedule(payload.event);
        }
        default:
          return callAction(action, payload);
      }
    },
    colorSource: colorSource,
    withThumbs: false,
    defaultImage: homeSettings.schedule_default_image,
    getShareLink: () => getShareLink(filters, view),
    showSendEmail: false,
    onStartChat: null,
    onEventClick: () => {},
    needsLogin: needsLogin,
    ...rest,
  };

  return (
      <div className={className || "schedule-container"}>
        <Schedule {...componentProps} />
      </div>
  );
};

const mapStateToProps = ({ userState, summitState, scheduleState, settingState }) => ({
  userProfile: userState.userProfile,
  colorSettings: settingState.colorSettings,
  homeSettings: settingState.homeSettings,
  summit: summitState.summit,
  events: scheduleState.events,
  filters: scheduleState.filters,
  view: scheduleState.view,
  colorSource: scheduleState.colorSource,
});

export default connect(mapStateToProps, {
  addToSchedule,
  removeFromSchedule,
  callAction
})(FullSchedule);
