const { db } = require("./config");
const {
  doc,
  addDoc,
  updateDoc,
  serverTimestamp
} = require("firebase/firestore");

const documentWrite = (collection) => {
  let error = null;

  const documentAdd = async (id, data) => {
    try {
      // set reference
      const docRef = doc(db, collection, id);

      // add data
      await addDoc(docRef, data);
    } catch (err) {
      console.error(err);
      error = "Could not add data to Firebase";
    }
  };

  const documentUpdate = async (id, newData) => {
    try {
      // set reference
      const docRef = doc(db, collection, id);

      // update document
      await updateDoc(docRef, newData);
    } catch (err) {
      console.error(err);
      error = "Could not update the data in Firebase";
    }
  };

  return { documentAdd, documentUpdate, error, serverTimestamp };
};

module.exports = documentWrite;
