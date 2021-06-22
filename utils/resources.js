import { WebResource, webResourceConverter } from "dbtypes/WebResource";
import firebase from "firebase";
import "firebase/firestore";

export default function ResourcesApi() {
  const db = firebase.firestore();

  async function getAllResources() {
    const querySnapshot = await db.collection("resources").withConverter(webResourceConverter).get();
    const result = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      result.push(new WebResource({ ...data, docId: doc.id }));
    });

    return result;
  }

  return {
    getAllResources,
  };
}
