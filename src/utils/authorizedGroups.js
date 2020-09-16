import envVariables from '../utils/envVariables';

let authorizedGroups = envVariables.AUTHZ_USER_GROUPS;
    authorizedGroups = authorizedGroups && authorizedGroups !== '' ? authorizedGroups.split(' ') : [];

const isAuthorizedUser = (groups) => {
  return groups ? groups.some(group => authorizedGroups.includes(group.code)) : false;
}

export default isAuthorizedUser;