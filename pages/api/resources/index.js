import { webResourceConverter } from "dbtypes/WebResource";
import { getFirebaseAdmin } from "next-firebase-auth";

export default async (req, res) => {
  try {
    const db = getFirebaseAdmin().firestore();
    const querySnapshot = await db.collection("resources").withConverter(webResourceConverter).get();
    const result = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      result.push(new WebResource({ ...data, docId: doc.id }));
    });

    console.log("***");
    console.log(result);

    return res.status(200).json({ data: result });
  } catch (e) {
    console.log(e);
    return res.status(500).json({});
  }
};
