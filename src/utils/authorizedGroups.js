import envVariables from '../utils/envVariables';

let authorizedGroups = envVariables.AUTHZ_USER_GROUPS;
    authorizedGroups = authorizedGroups && authorizedGroups !== '' ? authorizedGroups.split(' ') : [];

const authorizedUser = (groups) => {  
  return groups.some(group => authorizedGroups.includes(group.code));
}

export default authorizedUser;