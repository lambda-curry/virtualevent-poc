import moment from "moment-timezone";
import { epochToMomentTimeZone } from "openstack-uicore-foundation/lib/methods";
import { isString } from "lodash";
import { getEnvVariable, SCHEDULE_EXCLUDING_TAGS } from "./envVariables";
import {getUserAccessLevelIds} from './authorizedGroups';

const groupByDay = (events) => {
  let groupedEvents = [];
  events.forEach(ev => {
    const day = moment.unix(ev.start_date).format("MM/DD/YYYY");
    const currentValue = groupedEvents[day] || [];
    groupedEvents[day] = [ev, ...currentValue];
  });

  return groupedEvents;
};

const sortSchedule = (events) => {
  return events.map(day => {
    return day.sort((a, b) => a.id - b.id);
  });
};

export const sortEvents = (events) => {
  let sortedEvents = groupByDay(events);
  sortedEvents = sortSchedule(sortedEvents);
  return sortedEvents;
};

const userHasAccessToEvent = (event, userAccessLevels) => {
  const trackAccessLevelIds = event?.track?.allowed_access_levels.map(aal => aal.id) || [];

  if (trackAccessLevelIds.length > 0) {
    return trackAccessLevelIds.some(tal => userAccessLevels.includes(tal));
  }

  return false;
}

export const filterEventsByAccessLevel = (events, summitTickets) => {
  const userAccessLevels = getUserAccessLevelIds(summitTickets);

  // if user has no access levels we can't show any event.
  if (userAccessLevels.length === 0) return [];

  return events.filter(ev => userHasAccessToEvent(ev, userAccessLevels));
};

export const filterEventsByTags = (events) => {
  const excludingTagsVar = getEnvVariable(SCHEDULE_EXCLUDING_TAGS);
  const excludingTags = excludingTagsVar?.split("|") || null;

  return excludingTags
      ? events.filter(ev => !ev.tags?.map(t => t.tag).some(tag => excludingTags.includes(tag)))
      : events;
};

const filterMyEvents = (myEvents, events) => {
  const myEventsIds = myEvents?.map(ev => ev.id) || [];
  return events.filter(ev =>  myEventsIds.includes(ev.id));
};

export const preFilterEvents = (events, filters, summitTimezone, userProfile, filterByAccessLevel, filterByMySchedule) => {
  const {summit_tickets = [], schedule_summit_events = []} = userProfile || {};
  let result = [...events];

  if (filterByMySchedule) {
    result = filterMyEvents(schedule_summit_events, result);
  }

  if (filterByAccessLevel) {
    result = filterEventsByAccessLevel(result, summit_tickets);
  }

  return getFilteredEvents(result, filters, summitTimezone);
};

export const getFilteredEvents = (events, filters, summitTimezone) => {
  return events.filter((ev) => {
    let valid = true;

    if (filters.date?.values.length > 0) {
      const dateString = epochToMomentTimeZone(
        ev.start_date,
        summitTimezone
      ).format("YYYY-MM-DD");
      valid = filters.date.values.includes(dateString);
      if (!valid) return false;
    }

    if (filters.level?.values.length > 0) {
      valid = filters.level.values.includes(ev.level.toLowerCase());
      if (!valid) return false;
    }

    if (filters.track?.values.length > 0) {
      valid = filters.track.values.includes(ev.track.id);
      if (!valid) return false;
    }

    if (filters.speakers?.values.length > 0) {
      valid =
        ev.speakers?.some((s) => filters.speakers.values.includes(s.id)) ||
        filters.speakers.values.includes(ev.moderator?.id);
      if (!valid) return false;
    }

    if (filters.tags?.values.length > 0) {
      valid = ev.tags?.some((t) => filters.tags.values.includes(t.id));
      if (!valid) return false;
    }

    if (filters.venues?.values.length > 0) {
      valid = filters.venues.values.includes(ev.location?.id);
      if (!valid) return false;
    }

    if (filters.track_groups?.values.length > 0) {
      valid = ev.track?.track_groups.some((tg) =>
        filters.track_groups.values.includes(tg)
      );
      if (!valid) return false;
    }

    if (filters.event_types?.values.length > 0) {
      valid = filters.event_types.values.includes(ev.type.id);
      if (!valid) return false;
    }

    if (filters.company?.values.length > 0) {
      const lowerCaseCompanies = filters.company.values;
      valid =
        ev.speakers?.some((s) =>
          lowerCaseCompanies.includes(s.company?.toLowerCase())
        ) ||
        lowerCaseCompanies.includes(ev.moderator?.company?.toLowerCase()) ||
        ev.sponsors?.some((s) =>
          lowerCaseCompanies.includes(s.name.toLowerCase())
        );

      if (!valid) return false;
    }

    if (filters.title?.values && isString(filters.title.values)) {
      valid = ev.title
        .toLowerCase()
        .includes(filters.title.values.toLowerCase());
      if (!valid) return false;
    }

    return true;
  });
};

export const syncFilters = (newFilters, currentFilters) => {
  // new filters are the source of truth
  Object.entries(newFilters).forEach(([key, value]) => {
    value.values = [];
    value.options = [];

    if(currentFilters.hasOwnProperty(key)) {
      // copy over values and options if they exists
      const filter = currentFilters[key];
      if(filter.hasOwnProperty("values"))
        value.values = filter.values;
      if(filter.hasOwnProperty("options"))
        value.options = filter.options;
    }
  });
  return newFilters;
}