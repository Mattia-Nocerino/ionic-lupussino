import * as functions from "firebase-functions";

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

export const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});

export const uppercaseRoomName = functions.database.ref("/rooms")
    .onCreate((snapshot) => {
      const roomData = snapshot.val();
      const name = roomData.name.toUppercase();
      return snapshot.ref.update({name});
    });
