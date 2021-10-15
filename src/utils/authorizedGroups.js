import {
  getEnvVariable,
  AUTHZ_USER_GROUPS,
  AUTHZ_SESSION_BADGE,
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

const getUserBadgeFeatureIds = (summit_tickets) => {
    return summit_tickets?.reduce((result, item) => {
        const newFeatureIds = item?.badge?.features?.map(f => f.id).filter(fid => !result.includes(fid)) || [];
        return [...result, ...newFeatureIds];
    }, []) || [];
};

const getUserAccessLevelIds = (summit_tickets) => {
    return summit_tickets?.reduce((result, item) => {
        const newAccessLevels = item?.badge?.type?.access_levels?.map(al => al.id).filter(aln => !result.includes(aln)) || [];
        return [...result, ...newAccessLevels];
    }, []) || [];
};

const processAuthSessionBadge = () => {
    const authSessionBadgeEnv = getEnvVariable(AUTHZ_SESSION_BADGE) || "";

    if (!authSessionBadgeEnv) return [];

    return authSessionBadgeEnv
        .split("|")
        .map(item => {
            const itemArray = item?.split(":");
            const eventId = parseInt(itemArray[0]);
            const featuresNeeded = itemArray[1].split(",").map(parseInt);
            return { eventId, featuresNeeded };
        });
}

export const isAuthorizedBadge = (event, summit_tickets) => {
    let allowed = true;
    const userFeatures = getUserBadgeFeatureIds(summit_tickets);
    const userAccessLevels = getUserAccessLevelIds(summit_tickets);
    const badgeGatedEvents = processAuthSessionBadge(); // TODO move this out of here and run only once
    const authzSession = badgeGatedEvents.find(ev => ev.eventId === event?.id);
    const trackAccessLevelIds = event?.track?.allowed_access_levels.map(aal => aal.id) || [];

    if (authzSession) {
        allowed = authzSession.featuresNeeded.some(featId => userFeatures.includes(featId));
    }

    if (trackAccessLevelIds.length > 0) {
        allowed = allowed && trackAccessLevelIds.some(tal => userAccessLevels.includes(tal));
    }

    return allowed;
};
