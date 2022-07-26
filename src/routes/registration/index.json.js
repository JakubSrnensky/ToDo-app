import clientPromise from '$lib/mongodb-client';
import * as cookie from "cookie";
import { v4 as uuidv4 } from "uuid";

export async function post ({ locals, request }) {
  try {
    const dbConnection = await clientPromise;
    const db = dbConnection.db("app");
    const collection = db.collection("user");
    let user = await request.json();
    const userDb = await collection.findOne({
      login: user?.login
    });
 

    if(userDb){
      return {
        body: {
          state: "failed"
        }
      }
    }

    const userDbCreate = await collection.insertOne(user);
  
    if(userDbCreate){
      const sessionId = uuidv4();

      const duplicateUser = await db.collection('cookies').findOne({ sessionId: locals?.user?.data?.sessionId });
    
          await db.collection('cookies').insertOne({
              sessionId,
              userId: userDbCreate?.insertedId
          });
    
    const headers = {
      "Set-Cookie": cookie.serialize("sessionId", sessionId, {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/"
      })
    }

    
    return {
      status: 200,
      headers,
      body: {
        userDbCreate,
        state: "success"
      }
    }
  }
  } catch (err) {
    // 👇️ This runs
    console.log('Error: ', err.message);
  }
}