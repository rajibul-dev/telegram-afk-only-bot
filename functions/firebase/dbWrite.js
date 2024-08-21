const { db } = require("./config");
const {
  doc,
  setDoc,
  deleteDoc,
  serverTimestamp,
} = require("firebase/firestore");

const documentWrite = (collection) => {
  let error = null;

  const documentAdd = async (id, data) => {
    const docRef = doc(db, collection, id);
    try {
      await setDoc(docRef, data);
    } catch (err) {
      console.error(err);
      error = "Could not add data to Firestore.";
    }
  };

  const documentUpdate = async (id, newData) => {
    const docRef = doc(db, collection, id);
    try {
      await setDoc(docRef, newData, { merge: true });
    } catch (err) {
      console.error(err);
      error = "Could not update or merge the data in Firebase.";
    }
  };

  const documentDelete = async (id) => {
    const docRef = doc(db, collection, id);
    try {
      await deleteDoc(docRef).then(() => {
        console.log("Deleted!");
      });
    } catch (err) {
      console.error(err);
      error = "Could not delete document in Firestore.";
    }
  };

  return { documentAdd, documentUpdate, documentDelete, error };
};

module.exports = { documentWrite, serverTimestamp };
