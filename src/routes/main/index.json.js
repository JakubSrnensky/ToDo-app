import clientPromise from '$lib/mongodb-client';
import { ObjectId } from 'mongodb';


export async function get({locals}) {
  try {


  const client = await clientPromise
  const db = client.db("app");
  const getUser = await db.collection("user").find(locals?.user?.data?.userId).toArray();
  const todoData = await db.collection("todo").find({userId: ObjectId(locals?.user?.data?.userId)}).toArray();
  const numberTasks = todoData.length;

  const mergeData = db.collection("todo").aggregate([{ 
    $lookup: { 
      from: "categories", 
      localField: "categoryId", 
      foreignField: "_id", 
      as: "category", 
    },  
  },{ 
    $unwind: "$category",
  },
  {
    $match: { userId: locals?.user?.data?.userId }
  }])
 
  const dataCategoryTodo = await mergeData.toArray();


  const mergeDataCategories = db.collection("categories").aggregate([{ 
    $lookup: { 
      from: "todo", 
      localField: "_id", 
      foreignField: "categoryId", 
      as: "todos", 
    },  
  },{ 
    $addFields: { todoCount: { $size: "$todos" } }
  },
  {
    $match: { userId: locals?.user?.data?.userId }
  }])

  const categoryData = await mergeDataCategories.toArray();

    return {
      body: {
        dataCategoryTodo,
        categoryData,
        getUser,
        numberTasks
      },
      status: 200
    };
  } catch (err) {
    // 👇️ This runs
    console.log('Error: ', err.message);
  }
}


export async function del ({request, locals}) {
  try {
    const dbConnection = await clientPromise;
    const db = dbConnection.db("app");
    const collection = db.collection("todo");
    let toDo = await request.json();

    const toDoDb = await collection.deleteOne({_id: ObjectId(toDo.id)});

    const mergeData = db.collection("todo").aggregate([{ 
      $lookup: { 
        from: "categories", 
        localField: "categoryId", 
        foreignField: "_id", 
        as: "category", 
      },  
    },{ 
      $unwind: "$category",
    }])
    const dataCategoryTodo = await mergeData.toArray();



    const mergeDataCategories = db.collection("categories").aggregate([{ 
      $lookup: { 
        from: "todo", 
        localField: "_id", 
        foreignField: "categoryId", 
        as: "todos", 
      },  
    },{ 
      $addFields: { todoCount: { $size: "$todos" } }
    },
    {
      $match: { userId: locals?.user?.data?.userId }
    }])
  
    const categoryData = await mergeDataCategories.toArray();
  
 
    return { 
      body: {
        dataCategoryTodo,
        categoryData,
        message: "Task byl smazán",
        state: "success"
      },
      status: 200
    }

  } catch (err) {
    // 👇️ This runs
    console.log('Error: ', err.message);
  }
}

