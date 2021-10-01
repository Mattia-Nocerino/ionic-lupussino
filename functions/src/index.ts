import * as functions from "firebase-functions";

export const uppercaseRoomName = functions
    .region("europe-west1")
    .database.ref("/rooms/{roomId}")
    .onCreate((snapshot, context) => {
      const roomId = context.params.roomId;
      const roomData = snapshot.val();
      const name = "x " + roomData.name + " x";

      console.log(`Il nome della stanza è ${name} e il suo id è ${roomId}`);
      return snapshot.ref.update({name: name});
    });
