import { getEnvVariable, AUTHZ_USER_GROUPS, AUTHZ_SESSION_BADGE } from './envVariables';

export const isAuthorizedUser = (groups) => {
  let authorizedGroups = getEnvVariable(AUTHZ_USER_GROUPS);
      authorizedGroups = authorizedGroups && authorizedGroups !== '' ? authorizedGroups.split(' ') : [];
  return groups ? groups.some(group => authorizedGroups.includes(group.code)) : false;
}

export const getUserBadges = (summit_tickets) => {
  let badges = [];

  if (summit_tickets) {
    summit_tickets.map(t => {
      t.badge.features.map(feature => {
        if (!badges.some(e => e === feature.id)) {
          badges.push(feature.id);
        }
      })
    });
  }

  return badges;
}

export const isAuthorizedBadge = (session, summit_tickets) => {

  let authorizedSessionPerBadge = getEnvVariable(AUTHZ_SESSION_BADGE);
    authorizedSessionPerBadge = authorizedSessionPerBadge && authorizedSessionPerBadge !== '' ? authorizedSessionPerBadge.split('|').map((session => {
      let id = session.split(':')[0];
      let values = session.split(':')[1].split(',');
      let sessionObject = { sessionId: id, authorizedBadges: values };
      return sessionObject
    })) : [];

  let badges = getUserBadges(summit_tickets);

  const authzSession = authorizedSessionPerBadge.find(s => s.sessionId === session)
  if (authzSession) {
    return authzSession.authorizedBadges.some(b => {
      return badges.includes(parseInt(b))
    });
  } else {
    return true;
  }
} 