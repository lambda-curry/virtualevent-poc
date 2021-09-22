import moment from 'moment-timezone'
import {epochToMomentTimeZone} from "openstack-uicore-foundation/lib/methods";
import {isString} from "lodash";

const groupByDay = (events) => {
  let groupedEvents = [];
  events.forEach((e, index) => {
    const day = moment.unix(e.start_date).format('MM/DD/YYYY');
    groupedEvents[day] = groupedEvents[day] && groupedEvents[day].length > 0 ? [e, ...groupedEvents[day]] : [e];
  });
  return groupedEvents;
};

const sortSchedule = (events) => {
  return events.map((day, index) => {
    return day.sort((a, b) => a.id - b.id);
  })
};

export const sortEvents = (events) => {
  let sortedEvents = groupByDay(events);
  sortedEvents = sortSchedule(sortedEvents);
  return sortedEvents;
};

export const getFilteredEvents = (events, filters, summitTimezone) => {

  return events.filter(ev => {
    let valid = true;

    if (filters.date?.values.length > 0) {
      const dateString = epochToMomentTimeZone(ev.start_date, summitTimezone).format('YYYY-MM-DD');
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
      valid = ev.speakers?.some(s => filters.speakers.values.includes(s.id)) || filters.speakers.values.includes(ev.moderator?.id);
      if (!valid) return false;
    }

    if (filters.tags?.values.length > 0) {
      valid = ev.tags?.some(t => filters.tags.values.includes(t.id));
      if (!valid) return false;
    }

    if (filters.venues?.values.length > 0) {
      valid = filters.venues.values.includes(ev.location?.id);
      if (!valid) return false;
    }

    if (filters.track_groups?.values.length > 0) {
      valid = ev.track?.track_groups.some(tg => filters.track_groups.values.includes(tg));
      if (!valid) return false;
    }

    if (filters.event_types?.values.length > 0) {
      valid = filters.event_types.values.includes(ev.type.id);
      if (!valid) return false;
    }

    if (filters.company?.values.length > 0) {
      const lowerCaseCompanies = filters.company.values;
      valid = ev.speakers?.some(s => lowerCaseCompanies.includes(s.company?.toLowerCase())) ||
          lowerCaseCompanies.includes(ev.moderator?.company?.toLowerCase()) ||
          ev.sponsors?.some(s => lowerCaseCompanies.includes(s.name.toLowerCase()));

      if (!valid) return false;
    }

    if (filters.title?.values && isString(filters.title.values)) {
      valid = ev.title.toLowerCase().includes(filters.title.values.toLowerCase());
      if (!valid) return false;
    }

    return true;
  });
};