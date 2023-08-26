const { db } = require("./config");
const { doc, getDoc } = require("firebase/firestore");

const documentRead = (collection, docID) => {
  let document = null;
  let error = null;

  // set reference
  const docRef = doc(db, collection, docID);

  // get document
  getDoc(
    docRef,
    (resDoc) => {
      document = { ...resDoc.data(), id: resDoc.id };
      error = null;
    },
    (err) => {
      console.error(err);
      error = "Could not fetch the data from Firebase";
    }
  );

  return { document, error };
};

module.exports = documentRead;
