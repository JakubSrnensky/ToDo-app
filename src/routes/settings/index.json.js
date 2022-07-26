import clientPromise from '$lib/mongodb-client';
import * as cookie from "cookie";

export async function get({ locals}) {
  try {
  const client = await clientPromise
  const db = client.db("app");
  const getUser = await db.collection("user").find(locals?.user?.data?.userId).toArray();

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

export async function del({locals, request}){
  try {
    const client = await clientPromise
    const db = client.db("app");
    const deleteCookie = await request.json();
    const getUser = await db.collection("cookies").find(locals?.user?.data?.sessionId);
   
    if(deleteCookie);
    if(getUser);
  
    const del = await db.collection("cookies").deleteOne({sessionId: locals?.user?.data?.sessionId});
    
    const cookies = cookie.parse(request.headers.get("cookie") || '');
      
    const headers = {
      "Set-Cookie": cookie.serialize("sessionId", "", {
        expires: new Date(0),
        path: "/"
      })
    }
  
    return{
      headers,
      body: {
        state: "success"
      }
    }

    } catch (err) {
      // 👇️ This runs
      console.log('Error: ', err.message);
  }
}