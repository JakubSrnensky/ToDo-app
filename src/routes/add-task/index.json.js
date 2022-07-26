import clientPromise from '$lib/mongodb-client';
import { ObjectId } from 'mongodb';
  
export async function post ({locals, request}) {
  
  const dbConnection = await clientPromise;
  const db = dbConnection.db("app");
  const collection = db.collection("todo");
  let toDo = await request.json();
  const toDoDb = await collection.insertOne({
    descriptionTask: toDo.descriptionTask,
    categoryId: ObjectId(toDo.categoryId),
    userId: locals.user.data.userId,
    dateTask: toDo.dateTask
  });

  return{
    body: {
      message: "Task byl vytvořen",
      state: "success"
    },
    status: 200
  }
}


export async function get({locals}) {
  try {
  const client = await clientPromise
  const db = client.db("app");
  const categoryData = await db.collection("categories").find({userId: ObjectId(locals?.user?.data?.userId)}).toArray();
 
    return {
      body: {
        categoryData
      },
    };
  } catch (err) {
    // 👇️ This runs
    console.log('Error: ', err.message);
  }
}