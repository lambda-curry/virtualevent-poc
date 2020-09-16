import envVariables from '../utils/envVariables';

let authorizedGroups = envVariables.AUTHZ_USER_GROUPS;
    authorizedGroups = authorizedGroups && authorizedGroups !== '' ? authorizedGroups.split(' ') : [];

let authorizedSessionPerBadge = envVariables.AUTHZ_SESSION_BADGE;
    authorizedSessionPerBadge = authorizedSessionPerBadge.split('|').map((session => {
      let id = session.split(':')[0];      
      let values = session.split(':')[1].split(',');
      let sessionObject = { sessionId: id, authorizedBadges: values };
      return sessionObject
    }));

export const isAuthorizedUser = (groups) => {
  return groups ? groups.some(group => authorizedGroups.includes(group.code)) : false;
}

export const isAuthorizedBadge = (session, badge) => {
  const authzSession = authorizedSessionPerBadge.find(s => s.sessionId === session) 
  if (authzSession) {
      return authzSession.authorizedBadges.includes(badge);
  } else {
    return true;
  }  
} 