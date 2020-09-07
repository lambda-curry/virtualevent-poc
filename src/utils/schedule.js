import moment from 'moment-timezone'

const groupByDay = (events) => {
  let groupedEvents = [];
  if (events?.length > 0) {
    events.map((e, index) => {
      let day = moment.unix(e.start_date).format('MM/DD/YYYY');
      let oldDay = groupedEvents.find(e => e.date === day);
      let newDay = oldDay ? { date: day, events: [e, ...oldDay.events] } : { date: day, events: [e] }
      groupedEvents = oldDay ? groupedEvents.filter(e => e.date !== day) : groupedEvents;
      groupedEvents.push(newDay);
    })
  }
  return groupedEvents;
}

const sortSchedule = (schedule) => {
  const sorted = schedule.map(day => {
    return { date: day.date, events: day.events.sort((a, b) => a.start_date - b.start_date) };
  });
  return sorted;
}

export const sortEvents = (events) => {
  let sortedEvents = groupByDay(events);
  sortedEvents = sortSchedule(sortedEvents);
  return sortedEvents;
}

export const getNextEvent = (schedule, now) => {

  let formattedNow = moment.unix(now).format('MM/DD/YYYY');

  const day = schedule.find(day => day.date === formattedNow);

  const event = day.events.reduce((prev, curr) => {
    if (curr.start_date > now) {
      return (Math.abs(curr.start_date - now) < Math.abs(prev.start_date - now) ? curr : prev);
    } else {
      return prev
    };
  });

  if (event.start_date > now) {
    return event;
  } else {
    return null;
  }
}

export const getNextEventByTrack = () => {

}