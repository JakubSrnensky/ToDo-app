import clientPromise from '$lib/mongodb-client';
import { ObjectId } from 'mongodb';

export async function get({ params, locals }) {
  try {
    const dbConnection = await clientPromise;
    const db = dbConnection.db("app");
    const task = await db.collection("todo").find({_id: ObjectId(params.id)}).toArray();
    const categories = await db.collection("categories").find({userId: ObjectId(locals?.user?.data?.userId)}).toArray();


      return {
        status: 200,
        body: { 
          task,
          categories
        }
      };
 
  } catch (err) {
    // 👇️ This runs
    
    console.log('Error: ', err.message);
  }
}


export async function put ({ params, request}) {
  try {  
    const dbConnection = await clientPromise;
    const db = dbConnection.db("app");
    let toDo = await request.json();
    const toDoFind = await db.collection("todo").find({_id: ObjectId(params.id)}).toArray();


    if(toDoFind){
      const toDoUpdate = await db.collection("todo").updateOne({
          _id: ObjectId(params.id)
        }, {
        $set: {
          descriptionTask: toDo.descriptionTask,
          categoryId: ObjectId(toDo.categoryId),
          dateTask: toDo.dateTask
        }
      })
    }

    return{
      body: {
        state: "success"
      },
      status: 200
    }

  } catch (err) {
    // 👇️ This runs
    
    console.log('Error: ', err.message);
  }
}
