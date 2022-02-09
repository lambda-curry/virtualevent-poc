import {
  getEnvVariable,
  AUTHZ_USER_GROUPS,
} from "./envVariables";

export const isAuthorizedUser = (groups) => {
  let authorizedGroups = getEnvVariable(AUTHZ_USER_GROUPS);
  authorizedGroups =
    authorizedGroups && authorizedGroups !== ""
      ? authorizedGroups.split(" ")
      : [];
  return groups
    ? groups.some((group) => authorizedGroups.includes(group.code))
    : false;
};

export const userHasAccessLevel = (summitTickets, accessLevel) => {
    if (summitTickets) {
        return summitTickets
            .some(t => t?.badge?.type?.access_levels.map(al => al.name).includes(accessLevel));
    }

    return false;
};

export const getUserAccessLevelIds = (summit_tickets) => {
    return summit_tickets?.reduce((result, item) => {
        const newAccessLevels = item?.badge?.type?.access_levels?.map(al => al.id).filter(aln => !result.includes(aln)) || [];
        return [...result, ...newAccessLevels];
    }, []) || [];
};

export const isAuthorizedBadge = (event, summit_tickets) => {
    let allowed = true;
    const userAccessLevels = getUserAccessLevelIds(summit_tickets);
    const trackAccessLevelIds = event?.track?.allowed_access_levels.map(aal => aal.id) || [];

    if (trackAccessLevelIds.length > 0) {
        allowed = trackAccessLevelIds.some(tal => userAccessLevels.includes(tal));
    }

    return allowed;
};

export const filterEventsByAccessLevels = (originalEvents , user) => {
    console.log(`filterEventsByAccessLevels originalEvents ${originalEvents.length} user ${user.email}`);
    if (isAuthorizedUser(user.groups)) {
        console.log(`filterEventsByAccessLevels originalEvents ${originalEvents.length} user ${user.email} is Auth`);
        return originalEvents;
    }
    let summitTickets = user.summit_tickets;
    let res =  originalEvents.filter((ev) => {
        return isAuthorizedBadge(ev, summitTickets);
    });

    console.log(`filterEventsByAccessLevels originalEvents ${originalEvents.length} user ${user.email} filtered ${res.length}`);
    return res;
}