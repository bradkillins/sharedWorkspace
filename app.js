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

//Property Constructor
function Property(address, neighbor, sqFeet, parking, transit, listed) {
  this.address = address;
  this.neighbor = neighbor;
  this.sqFeet = sqFeet;
  this.parking = parking;
  this.transit = transit;
  this.listed = listed;
  this.workspace = [];
}

//Workspace Constructor
function Workspace(type, occ, smoke, availDate, term, price, listed) {
  this.type = type;
  this.occ = occ;
  this.smoke = smoke;
  this.availDate = availDate;
  this.term = term;
  this.price = price;
  this.listed = listed;
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

const SaveProperty = property => {
  //check properties array exists in localStorage
  if (!localStorage.getItem("properties")) {
    //if no properties array exist:
    console.log("Created new properties array in localStorage"); //for testing
    let properties = []; //create the properties array
    properties.push(property); //add newProperty to properties array
    //save properties array to localStorage as 'properties'
    //using JSON stringify as anything saved in local storage is converted to a string
    localStorage.setItem("properties", JSON.stringify(properties));
  } else {
    //if properties array already exists
    console.log("Add to properties array in localStorage");
    //get properties array from storage
    //parse from string back to array using JSON.parse
    let properties = JSON.parse(localStorage.getItem("properties"));
    properties.push(property);
    localStorage.setItem("properties", JSON.stringify(properties));
  }
};

//checks to see if a given email exists in the users array
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
  const fName = document.querySelector("#fName").value;
  const lName = document.querySelector("#lName").value;
  const phone = document.querySelector("#userPhone").value;
  const email = document.querySelector("#userEmail").value;
  const pass = document.querySelector("#userPass").value;
  const typeCoworker = document.querySelector("#coworker");
  let type = "coworker";

  if (!typeCoworker.checked) {
    type = "owner";
  }

  const newUser = new User(fName, lName, phone, email, pass, type);

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

//Create new Property

const CreateNewProperty = () => {
  const address = document.querySelector("#address").value;
  const neighbor = document.querySelector("#neighborhood").value;
  const sqFeet = document.querySelector("#sqFeet").value;
  const parkingYes = document.querySelector("#parkingYes").checked;
  const transitYes = document.querySelector("#transitYes").checked;
  const listYes = document.querySelector("#listYes").checked;
  let parking = false;
  let transit = false;
  let listed = true;
  if (parkingYes) {
    parking = true;
  }
  if (transitYes) {
    transit = true;
  }
  if (!listYes) {
    listed = false;
  }

  const newProperty = new Property(
    address,
    neighbor,
    sqFeet,
    parking,
    transit,
    listed
  );
  newProperty.id = GenRanId(12); //generate a random id for newProperty to refer to later
  let currentOwner = JSON.parse(sessionStorage.getItem("currentUser"));
  newProperty.owner = currentOwner.email; //track who created this property
  SaveProperty(newProperty);
  document.querySelector(".formFeedback").innerHTML =
    "Successfully created property!";
  document.querySelector("#addProperty").reset();
  setTimeout(() => {
    document.querySelector(".formFeedback").innerHTML = "";
  }, 5000);
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

const ShowOwnerProperties = () => {
  const currentOwner = JSON.parse(sessionStorage.getItem("currentUser"));
  const allProperties = JSON.parse(localStorage.getItem("properties"));
  if (!allProperties) {
    localStorage.setItem("properties", JSON.stringify([]));
  }
  const ownerProperties = allProperties.filter(
    property => property.owner === currentOwner.email //only select properties owned by current user
  );

  if (!ownerProperties.length) {
    document.querySelector(
      "#noProperties"
    ).innerHTML = `I'm sorry ${currentOwner.fName}, but there are no properties saved under you're account.\n
    Please <a href="./ownerAdd.html">Add a Property</a>`;
  }

  const propertiesTable = document.querySelector("#propertiesTable");
  ownerProperties.forEach(e => {
    let result = `<tbody><tr>
      <td><button name="${e.id}" onclick="EditSelectedProp(this.name, './ownerEdit.html');">Edit</button></td>
      <td>${e.address}</td>
      <td>${e.neighbor}</td>
      <td>${e.sqFeet}</td>
      <td>${e.parking}</td>
      <td>${e.transit}</td>
      <td>${e.listed}</td>
      <td><button name="${e.id}" onclick="EditSelectedProp(this.name, './ownerWorkspace.html');">View/Add/Modify</button></td>
      </tr></tbody>`;
    propertiesTable.insertAdjacentHTML("beforeend", result);
  });
};

//allows an owner to edit a selected property
const EditSelectedProp = (id, location) => {
  //saves selected prop to sessionStorage
  const properties = JSON.parse(localStorage.getItem("properties"));
  const index = properties.findIndex(prop => prop.id === id);
  let currentProp = properties[index];
  sessionStorage.setItem("currentProp", JSON.stringify(currentProp));
  //load edit page
  document.location = location;
};

//populates the edit form with the current Property details
const PopulateProp = () => {
  //get form elements
  const address = document.querySelector("#address");
  const neighbor = document.querySelector("#neighborhood");
  const sqFeet = document.querySelector("#sqFeet");
  const parkingYes = document.querySelector("#parkingYes");
  const parkingNo = document.querySelector("#parkingNo");
  const transitYes = document.querySelector("#transitYes");
  const transitNo = document.querySelector("#transitNo");
  const listYes = document.querySelector("#listYes");
  const listNo = document.querySelector("#listNo");
  //populate form with current values
  const currentProp = JSON.parse(sessionStorage.getItem("currentProp"));
  address.value = currentProp.address;
  neighbor.value = currentProp.neighbor;
  sqFeet.value = currentProp.sqFeet;
  if (currentProp.parking) {
    parkingYes.checked = true;
  } else {
    parkingNo.checked = true;
  }
  if (currentProp.transit) {
    transitYes.checked = true;
  } else {
    transitNo.checked = true;
  }
  if (currentProp.listed) {
    listYes.checked = true;
  } else {
    listNo.checked = true;
  }
};

const EditCurrentProp = () => {
  const address = document.querySelector("#address").value;
  const neighbor = document.querySelector("#neighborhood").value;
  const sqFeet = document.querySelector("#sqFeet").value;
  const parkingYes = document.querySelector("#parkingYes").checked;
  const transitYes = document.querySelector("#transitYes").checked;
  const listYes = document.querySelector("#listYes").checked;

  let currentProp = JSON.parse(sessionStorage.getItem("currentProp"));
  currentProp.address = address;
  currentProp.neighbor = neighbor;
  currentProp.sqFeet = sqFeet;
  if (parkingYes) {
    currentProp.parking = true;
  } else {
    currentProp.parking = false;
  }
  if (transitYes) {
    currentProp.transit = true;
  } else {
    currentProp.transit = false;
  }
  if (listYes) {
    currentProp.listed = true;
  } else {
    currentProp.listed = false;
  }

  //console.log(currentProp);
  //retrieve properties from localStorage, then update with edited currentProp
  let properties = JSON.parse(localStorage.getItem("properties"));
  let index = properties.findIndex(e => e.id === currentProp.id);
  properties[index] = currentProp;
  localStorage.setItem("properties", JSON.stringify(properties));
  //send user back to view properties page
  document.location = "./ownerShow.html";
};

const ShowWorkspaces = () => {
  const currentProp = JSON.parse(sessionStorage.getItem("currentProp"));

  if (!currentProp.workspace.length) {
    document.querySelector(
      "#noWorkspaces"
    ).innerHTML = `There are no Workspaces for the Property at ${currentProp.address}`;
  }

  document.querySelector("#titleProp").innerText = currentProp.address;

  const workspacesTable = document.querySelector("#workspacesTable");
  currentProp.workspace.forEach(e => {
    let result = `<tbody><tr>
      <td><button name="${e.id}">Edit</button></td>
      <td>${e.type}</td>
      <td>${e.occ}</td>
      <td>${e.smoke}</td>
      <td>${e.availDate}</td>
      <td>${e.term}</td>
      <td>${e.price}</td>
      <td>${e.listed}</td>
      </tr></tbody>`;
    workspacesTable.insertAdjacentHTML("beforeend", result);
  });
};

const FormListener = (selector, func) => {
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

//displays the current user name in the menu bar when logged in
const DisplayUserName = () => {
  const displayName = document.querySelector("#displayUserName");
  let name = JSON.parse(sessionStorage.getItem("currentUser")).fName;
  displayName.innerText = name;
};

//a pseudo random character generator
const GenRanId = length => {
  const charSet =
    "abcdefghijklmnopqrstuvwyxz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let id = "";
  for (let i = 0; i < length; i++) {
    id += charSet[Math.floor(Math.random() * charSet.length)];
  }
  return id;
};

//**** Main execution starts here ****

FormListener("#signup", CreateNewUser);
FormListener("#login", Login);
FormListener("#addProperty", CreateNewProperty);
FormListener("#editProperty", EditCurrentProp);
