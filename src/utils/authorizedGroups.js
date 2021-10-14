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

export const getUserBadges = (summit_tickets) => {
    let badges = [];

    if (summit_tickets) {
        summit_tickets
            .filter((t) => t.badge)
            .forEach((t) => {
                t.badge.features.forEach((feature) => {
                    if (!badges.some((e) => e === feature.id)) {
                        badges.push(feature.id);
                    }
                });
            });
    }

    return badges;
};

export const userHasAccessLevel = (summitTickets, accessLevel) => {
    if (summitTickets) {
        return summitTickets
            .some(t => t?.badge?.type?.access_levels.map(al => al.name).includes(accessLevel));
    }

    return false;
};

export const isAuthorizedBadge = (session, summit_tickets) => {
    let authorizedSessionPerBadge = getEnvVariable(AUTHZ_SESSION_BADGE);
    authorizedSessionPerBadge =
        authorizedSessionPerBadge && authorizedSessionPerBadge !== ""
            ? authorizedSessionPerBadge.split("|").map((session) => {
                const id = session.split(":")[0];
                const values = session.split(":")[1].split(",");
                return { sessionId: id, authorizedBadges: values };
            })
            : [];

    let badges = getUserBadges(summit_tickets);

    const authzSession = authorizedSessionPerBadge.find(
        (s) => s.sessionId === session
    );
    if (authzSession) {
        return authzSession.authorizedBadges.some((b) => {
            return badges.includes(parseInt(b));
        });
    }
    // we are allowed to enter
    return true;
};