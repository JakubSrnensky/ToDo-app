import clientPromise from '$lib/mongodb-client';
import { ObjectId } from 'mongodb';

export async function get({ locals }) {
  try {
  const client = await clientPromise
  const db = client.db("app");
  const getUser = await db.collection("user").find(locals.user.data.userId).toArray();
  
    return {
      body: {
        getUser
      },
    };
  } catch (err) {
    // 👇️ This runs
    console.log('Error: ', err.message);
}
}

export async function put({request, locals}) {
  try {
    const dbConnection = await clientPromise;
    const db = dbConnection.db("app");
    let userId = await request.json();
    const userDb = await db.collection("user").findOne(locals?.user?.data?.userId);
    
    if(userDb){
      const userSave = await db.collection("user").updateOne(  
      { _id: ObjectId(userDb?._id)}, // Filter
      {$set: {
        name: userId?.name,
        lastname: userId?.lastname
      }});
    }
    
    return { 
      status: 200, 
      body: { 
        userDb,
        state: "success"
      } 
    }
  } catch (err) {
    // 👇️ This runs
    
    console.log('Error: ', err.message);
  }
}
