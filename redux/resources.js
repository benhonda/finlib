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


// IMPLEMENTATION, should you need it:
// const router = useRouter();
// const dispatch = useDispatch();
// const resourcesFromRedux = useSelector((state) => state.resources);

// console.log(AuthUser);
// console.log(props);

// const dispatchLoadResources = useCallback(async () => {
//   try {
//     // TODO start loading here
//     const load = await loadResources();
//     if (load !== undefined) {
//       dispatch(load);
//       // TODO end loading here
//     }
//   } catch (e) {
//     console.error(e);
//   }
// }, [dispatch]);

// useEffect(() => {
//   if (!resourcesFromRedux || resourcesFromRedux?.length === 0) dispatchLoadResources();
// }, [dispatchLoadResources, resourcesFromRedux]);