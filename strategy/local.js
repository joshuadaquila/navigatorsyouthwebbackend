const passport = require("passport");
const { Strategy } = require("passport-local");
const db = require("../database/userdb");

console.log("Currently in local strategy");

// passport.serializeUser((req, done) => {
//   console.log("Serializing user");
//   // Here, user.id should be the unique identifier for the user
//   console.log(req);
//   done(null, req.username); // Assuming user.id exists
// });

passport.serializeUser((user, done) => {
  console.log("Serializing user");
  done(null, user);

  console.log("Serailizing " + user);
});

passport.deserializeUser(async(id, done)=>{
  console.log("Deserializing...");
  done(null, id);
})


passport.use(
  new Strategy(
    {
      usernameField: 'username',
    }, 
    async (username, password, done) => {

      // Example authentication logic
      // if (username === "admin" && password === "12345") {
      //   console.log("Authentication Success!");
      //   const user = { id: 1, username: "admin" }; // Mocking a user object
      //   done(null, user); // Pass the user object to done
      // } else {
      //   console.log("Authentication Failed!");
      //   done(null, false); // Indicate authentication failure
      // }
      
      const userFind = await db.findOne({username});
      if(userFind){
        console.log("Im looking for the user.")
        if(userFind.password === password){
          console.log("Authenticated succesfully");
          const user = { id: userFind._id, username: userFind.username }; // Mocking a user object
          done(null, user);
        }else{
          console.log("Authentication Failed!");
          done(null, false);
        }
      }else{
        done(null, false);
      }
    } 
  )
);
