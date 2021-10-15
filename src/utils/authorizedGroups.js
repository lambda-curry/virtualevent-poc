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

export const isAuthorizedBadge = (event, summit_tickets) => {
    let allowed = true;
    const userAccessLevels = getUserAccessLevelIds(summit_tickets);
    const trackAccessLevelIds = event?.track?.allowed_access_levels.map(aal => aal.id) || [];

    if (trackAccessLevelIds.length > 0) {
        allowed = trackAccessLevelIds.some(tal => userAccessLevels.includes(tal));
    }

    return allowed;
};