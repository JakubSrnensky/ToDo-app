import clientPromise from '$lib/mongodb-client';
import { ObjectId } from 'mongodb';


export async function post ({locals, request}) {
  try {
    const dbConnection = await clientPromise;
    const db = dbConnection.db("app");
    const collection = db.collection("categories");
    let category = await request.json();
    const categoryDb = await collection.findOne({
      nameCategory: category?.nameCategory
    });


    if(categoryDb){
      const mergeData = db.collection("categories").aggregate([{ 
        $lookup: { 
          from: "todo", 
          localField: "_id", 
          foreignField: "categoryId", 
          as: "todos", 
        },  
      },{ 
        $addFields: { todoCount: { $size: "$todos" } }
      },{
        $match: { userId: locals.user.data.userId }
      }])
      const categoryData = await mergeData.toArray();
  
      return {
        body: {
          categoryData,
          state: "failed"
        }
      }
    }

    const categoryDbCreate = await collection.insertOne({
        nameCategory: category?.nameCategory,
        colorCategory: category?.colorCategory,
        userId: locals.user.data.userId
      });
 
    
    const mergeData = db.collection("categories").aggregate([{ 
      $lookup: { 
        from: "todo", 
        localField: "_id", 
        foreignField: "categoryId", 
        as: "todos", 
      },  
    },{ 
      $addFields: { todoCount: { $size: "$todos" } }
    },    {
      $match: { userId: locals.user.data.userId }
    }])
    const categoryData = await mergeData.toArray();

    return { 
      body: {
        categoryData,
        state: "success"
      },
      status: 200
    }

  } catch (err) {
    // 👇️ This runs
    console.log('Error: ', err.message);
  }
}

//delete
export async function del ({request}) {
  try {
    const dbConnection = await clientPromise;
    const db = dbConnection.db("app");
    const collection = db.collection("categories");
    let category = await request.json();
        

    const categoryDb = await collection.deleteOne({_id: ObjectId(category)});


    const mergeData = db.collection("categories").aggregate([{ 
      $lookup: { 
        from: "todo", 
        localField: "_id", 
        foreignField: "categoryId", 
        as: "todos", 
      },  
    },{ 
      $addFields: { todoCount: { $size: "$todos" } }
    }])
    const categoryData = await mergeData.toArray();
 
    return { 
      body: {
        categoryData,
        state: "success"
      },
      status: 200
    }

  } catch (err) {
    // 👇️ This runs
    console.log('Error: ', err.message);
  }
}


export async function get({locals}) {
  try {
  const client = await clientPromise
  const db = client.db("app");

  const mergeData = db.collection("categories").aggregate([{ 
    $lookup: { 
      from: "todo", 
      localField: "_id", 
      foreignField: "categoryId", 
      as: "todos", 
    },  
  },{ 
    $addFields: { todoCount: { $size: "$todos" } }
  },    {
    $match: { userId: locals.user.data.userId }
  }])
  const categoryData = await mergeData.toArray();
  
    return {
      body: {
        categoryData,
      },
    };
  } catch (err) {
    // 👇️ This runs
    console.log('Error: ', err.message);
  }
}