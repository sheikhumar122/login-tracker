import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { connection } from "../utils/db.js";

export const Register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user with the same email already exists
    const existingUser = await connection.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Hash the password before saving to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save the user to the database
    await connection.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword]);

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error signing up:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const Login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Check if the user exists
        const verifyemailQuery = "SELECT * FROM users WHERE email = ?";
        connection.query(verifyemailQuery, [email], async (error, results) => {
            if (error) {
                return res.status(500).json({ message: "Database Error" });
            }
            
            if (results.length === 0) {
                return res.status(400).json({ message: "Invalid User" });
            }
            
            // Compare the provided password with the hashed password stored in the database
            const hashedPassword = results[0].password;
            const isPasswordMatched = await bcrypt.compare(password, hashedPassword);
  
            if (isPasswordMatched) {
                // If the password is correct, create a login activity record
                const userId = results[0].id;
                const insertActivityQuery = "INSERT INTO login_activities (user_id) VALUES (?)";
                connection.query(insertActivityQuery, [userId], (activityError, activityResults) => {
                    if (activityError) {
                        console.error("Error inserting login activity:", activityError);
                    }
                });

                // Generate JWT token for authentication
                const payload = {
                    email: results[0].email,
                    userId: results[0].id,
                };
                const jwt_token = jwt.sign(payload, "umar");
               // Set the token as an HTTP cookie
               res.cookie('token', jwt_token, {
                httpOnly: true,
            
            });
                res.send({ jwt_token, message: "Logged In Successfully" });
            } else {
                return res.status(400).json({ message: "Invalid Password" });
            }
        });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};
// GET route to retrieve user details from registration and activities tables
export const Details = async (req, res) => {
    // Retrieve user ID from the authenticated request
    const userId = req.user.userId;

    // Query to retrieve user activities
    const query = `
        SELECT *
        FROM login_activities
        WHERE user_id = ?
    `;

    // Execute the query
    connection.query(query, [userId], (error, results) => {
        if (error) {
            return res.status(500).json({ message: "Database Error" });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "User activities not found" });
        }

        // Send user activities in the response
        res.status(200).json(results);
    });
};





// export const Login = async (req, res, next) => {
//     try {
//       const { email, password } = req.body;
//       console.log(req.body)
//       const verifyemailQuery = "SELECT * from users WHERE email = ?";
//       connection.query(verifyemailQuery, [email], async (error, results) => {
    
//         if (error) {
//           return res.status(500).json({ message: "Database Error" });
//         }
//         console.log(results[0])
//         if (results.length === 0) {
//           return res.status(400).json({ message: "Invalid User" });
//         }
//         const hashedPassword = results[0].password;
//         const isPasswordMatched = await bcrypt.compare(password, hashedPassword);
  
//         if (isPasswordMatched) {
//           const payload = {
//             email: results[0].email,
//           };
//           const jwt_token = jwt.sign(payload, "gyfuyttft");
//           res.send({ jwt_token, message: "LoggedIn Succesfully" });
//         } else {
//           return res.status(400).json({ message: "Invalid Password" });
//         }
//       });
//     } catch (error) {
//       return res.status(400).json({ message: error.message });
//     }
//   };
  
