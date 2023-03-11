
// CONSTANTS & VARIABLES
let authorizedUsers = [
   {userName: 'admin', password: 'Admin', type: 'admin'},
   {userName: 'developer', password: "Developer.123", type: 'developer'}
]

// FUNCTIONS
const checkPassword = (user, password) => {
   authorizedUsers.forEach((el, i) => {
      if ( user === el.userName && password === el.password) {
         console.log(user, password);
         window.location.replace('./admin.html');
      }
   });
}

const initLogin = () => {
   let userName = document.getElementById("user").value;
   let password = document.getElementById("password").value;
   console.log(userName, password);

   checkPassword(userName, password);
}
