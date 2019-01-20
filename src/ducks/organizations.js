import {Parse} from 'parse';

import {OrganizationData} from 'models/OrganizationData';
import {send, getAllObjects} from 'utils/server';


export const INIT_END = 'app/organizations/INIT_END';


async function requesOrganizations() {
  const organizations_o = await send(getAllObjects(
    new Parse.Query(OrganizationData.OriginClass)
  ));
  const organizations = [];
  for (let organization_o of organizations_o) {
    const organization = new OrganizationData(organization_o);
    organizations.push(organization);
  }

  return organizations;
}

export function init() {
  return async dispatch => {
    const organizations = await requesOrganizations();

    dispatch({
      type: INIT_END,
      organizations
    });
  };
}

const initialState = {
  organizations: []
};

export default function organizationsReducer(state = initialState, action) {
  switch (action.type) {
    case INIT_END:
      return {
        ...state,
        organizations: action.organizations
      };

    default:
      return state;
  }
}
