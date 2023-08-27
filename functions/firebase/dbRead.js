const { db } = require("./config");
const {
  getDoc,
  doc,
  collection,
  query,
  where,
  getDocs
} = require("firebase/firestore");

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

const queryCollectionEqualRead = async (col, property, value) => {
  let document = [];
  let error = null;

  const colRef = collection(db, col);

  const colQuery = query(colRef, where(property, "==", value));

  try {
    const querySnapshot = await getDocs(colQuery);

    querySnapshot.forEach((doc) => {
      const id = doc.id;
      const data = doc.data();
      document.push({ ...data, id });
    });
  } catch (err) {
    console.error(err);
    error = "Could not query the data.";
  }

  return { document, error };
};

module.exports = { documentRead, queryCollectionEqualRead };
