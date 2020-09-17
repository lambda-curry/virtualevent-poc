import envVariables from '../utils/envVariables';

let authorizedGroups = envVariables.AUTHZ_USER_GROUPS;
    authorizedGroups = authorizedGroups && authorizedGroups !== '' ? authorizedGroups.split(' ') : [];

    
let authorizedSessionPerBadge = envVariables.AUTHZ_SESSION_BADGE;    
    authorizedSessionPerBadge = authorizedSessionPerBadge && authorizedSessionPerBadge !== '' ? authorizedSessionPerBadge.split('|').map((session => {
      let id = session.split(':')[0];      
      let values = session.split(':')[1].split(',');
      let sessionObject = { sessionId: id, authorizedBadges: values };
      return sessionObject
    })) : [];

export const isAuthorizedUser = (groups) => {
  return groups ? groups.some(group => authorizedGroups.includes(group.code)) : false;
}

export const isAuthorizedBadge = (session, summit_tickets) => {
  
  let badges = [];

  summit_tickets.map(t => {
    t.badge.features.map(feature => {
      if (!badges.some(e => e === feature.id)) {
        badges.push(feature.id);
      }
    })
  });

  const authzSession = authorizedSessionPerBadge.find(s => s.sessionId === session) 
  if (authzSession) {
      return authzSession.authorizedBadges.some(b => {        
        return badges.includes(parseInt(b))
      });
  } else {
    return true;
  }  
} 