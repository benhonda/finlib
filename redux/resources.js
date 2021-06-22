import ResourcesApi from "utils/resources";

// Actions
const SET = "finlib/resources/SET";

// Reducer
export default function reducer(resources = [], action = {}) {
  switch (action.type) {
    case SET:
      return action.resources;
    default:
      return resources;
  }
}

// Action Creators
export const setResources = (a) => ({ type: SET, resources: a });

// Side Effects
export const loadResources = async () => {
  const resourcesApi = ResourcesApi();
  console.log("INFO: Fetching resources");
  const resources = await resourcesApi.getAllResources();

  return setResources(resources);
};
