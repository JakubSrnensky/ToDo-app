import clientPromise from '$lib/mongodb-client';
import * as cookie from "cookie";
import { v4 as uuidv4 } from "uuid";


  
export async function post ({locals, request}) {
  
  const dbConnection = await clientPromise;
  const db = dbConnection.db("app");
  const collection = db.collection("user");
  let user = await request.json();
  const userDb = await collection.findOne({
    id: user?._id,
    login: user?.login,
    password: user?.password
  });
 
  if(!userDb){
    return {
      body: {
        state: "failed"
      }
    }
  }

  const sessionId = uuidv4();

 
    const duplicateUser = await db.collection('cookies').findOne({ sessionId: locals?.user?.data?.sessionId });
  
    if (duplicateUser) {
        await db.collection('cookies').updateOne({ userId: userDb._id }, { $set: { sessionId } });
    } else {
        await db.collection('cookies').insertOne({
            sessionId,
            userId: userDb._id
        });
    }
   
  const headers = {
    "Set-Cookie": cookie.serialize("sessionId", sessionId, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/"
    })
  }

  return{
    status: 200,
    headers,
    body: {
      state: "success"
    }
  }
}