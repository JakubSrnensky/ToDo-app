import * as cookie from "cookie"
import clientPromise from '$lib/mongodb-client';


export async function handle({ event, resolve }) {

  const dbConnection = await clientPromise;
  const db = dbConnection.db("app");

  const cookies = cookie.parse(event.request.headers.get("cookie") || '');

  event.locals.user = {}
  if (!cookies.sessionId) {
    event.locals.user.authenticated = false;
  
  }

  const userSession = await db.collection('cookies').findOne({ sessionId: cookies.sessionId });
  
  if (userSession) {
      event.locals.user.authenticated = true;
      event.locals.user.data = userSession;
  } else {
    event.locals.user.authenticated = false;    
  }

  const response = await resolve(event)

  return response;
};


export const getSession = (event) => {
  const cookie = event?.locals?.user?.data?.sessionId;

  return cookie ? cookie : null
}