import { connection } from "../utils/db.js";
import { createActivitiesTable } from "./activityModel.js";
import { createUserTable } from "./userModel.js";


const tableToCreate = [
  { tableName: "User Table", sql: createUserTable },
  {tableName:"User Activities", sql:createActivitiesTable},
 
];

export const createTables = () => {
  for (const table of tableToCreate) {
    connection.query(table.sql, (err) => {
      if (err) throw err;
      console.log(`${table.tableName} created successfully!`);
    });
  }
};