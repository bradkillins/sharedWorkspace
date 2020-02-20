/*
 * Shared Workspace Web App
 * SODV1201
 * Brad Killins
 */

// User constructor
function User(fName, lName, phone, email, pass, type) {
  this.fName = fName;
  this.lName = lName;
  this.phone = phone;
  this.email = email;
  this.pass = pass;
  this.type = type;
}

const SaveUser = user => {
  //check if users array exists in localStorage
  if (!localStorage.getItem("users")) {
    //if no users array exist:
    console.log("Created new users array in localStorage"); //for testing
    let users = []; //create the users array
    users.push(user); //add newUser to users array
    //save users array to localStorage as 'users'
    //using JSON stringify as anything saved in local storage is converted to a string
    localStorage.setItem("users", JSON.stringify(users));
  } else {
    //if users array already exists
    console.log("Add to users array in localStorage");
    //get users array from storage
    //parse from string back to array using JSON.parse
    let users = JSON.parse(localStorage.getItem("users"));
    users.push(user);
    localStorage.setItem("users", JSON.stringify(users));
  }
};

const CheckUserExist = userEmail => {
  if (!localStorage.getItem("users")) {
    return false;
  }
  let users = JSON.parse(localStorage.getItem("users"));
  let index = users.findIndex(user => user.email === userEmail);
  if (index === -1) {
    return false;
  } else {
    return true;
  }
};

//Create new user
const CreateNewUser = () => {
  const fName = document.querySelector("#fName");
  const lName = document.querySelector("#lName");
  const phone = document.querySelector("#userPhone");
  const email = document.querySelector("#userEmail");
  const pass = document.querySelector("#userPass");
  const typeCoworker = document.querySelector("#coworker");
  let type = "coworker";

  if (!typeCoworker.checked) {
    type = "owner";
  }

  let newUser = new User(
    fName.value,
    lName.value,
    phone.value,
    email.value,
    pass.value,
    type
  );

  //   console.log(newUser); //for testing

  //check if new user email already exists in Users array
  if (!CheckUserExist(newUser.email)) {
    SaveUser(newUser);

    document.querySelector(".formFeedback").innerHTML =
      "Successfully created user! <br/> Re-directing to login page in 5 seconds...";
    document.querySelector("#signup").reset();
    /*
  setTimeout(() => {
    document.location = "./login.html";
  }, 5000); */
  } else {
    document.querySelector(".formFeedback").innerHTML =
      "User with same email already exists! Please try logging in. <br/> Re-directing to login page in 5 seconds...";
    document.querySelector("#signup").reset();
  }
};

//Login function
const Login = () => {
  const userEmail = document.querySelector("#userEmail").value;
  const userPass = document.querySelector("#userPass").value;

  if (CheckUserExist(userEmail)) {
    let users = JSON.parse(localStorage.getItem("users"));
    let index = users.findIndex(user => user.email === userEmail);
    console.log("User found at index " + index);
    if (users[index].pass === userPass) {
      console.log("Password OK! :)");
      sessionStorage.clear();
      let currentUser = users[index];
      currentUser.originalIndex = index; //add property originalIndex to track the index of user in users
      sessionStorage.setItem("currentUser", JSON.stringify(currentUser));
      if (currentUser.type === "coworker") {
        document.location = "./coworkerMenu.html";
      } else {
        document.location = "./ownerMenu.html";
      }
    } else {
      //console.log("Incorrect Password!"); //for testing
      document.querySelector(".formFeedback").innerHTML = "Incorrect Password!";
    }
  } else {
    // console.log("User not found"); //for testing
    document.querySelector(".formFeedback").innerHTML = "User not found!";
  }
};

const formListener = (selector, func) => {
  //Only add the event listener if the selector exists on the current page.
  if (document.querySelector(selector))
    document.querySelector(selector).addEventListener(
      "submit",
      event => {
        event.preventDefault(); //Stops the page from refreshing when submitting the form.
        func(); //The function to run when the form is submitted.
      } /*,
      false*/
    );
};

const DisplayUserName = () => {
  const displayName = document.querySelector("#displayUserName");
  let name = JSON.parse(sessionStorage.getItem("currentUser")).fName;
  displayName.innerText = name;
};

//**** Main execution starts here ****

formListener("#signup", CreateNewUser);
formListener("#login", Login);
