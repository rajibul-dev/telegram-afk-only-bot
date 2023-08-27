const { db } = require("./config");
const { getDoc, doc } = require("firebase/firestore");

const documentRead = async (col, docID) => {
  let document = null;
  let error = null;

  // set reference
  const docRef = doc(db, col, docID);

  // get document
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    document = data;
  } else {
    error = "Document not found.";
  }

  return { document, error };
};

module.exports = documentRead;
