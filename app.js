/*
 * Shared Workspace Web App
 * SODV1201
 * Brad Killins
 *
 * Phase 1
 *
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

/* SaveUser - saves a user object to the users array in localStorage
 *    @Params - user: the object to store in the users array
 */
const SaveUser = user => {
  //check if users array exists in localStorage
  if (!localStorage.getItem("users")) {
    //if no users array exist:
    let users = []; //create the users array
    users.push(user); //add newUser to users array
    //save users array to localStorage as 'users'
    //using JSON stringify as anything saved in local storage is converted to a string
    localStorage.setItem("users", JSON.stringify(users));
  } else {
    //if users array already exists get users array from storage
    //parse from string back to array using JSON.parse
    let users = JSON.parse(localStorage.getItem("users"));
    users.push(user);
    localStorage.setItem("users", JSON.stringify(users));
  }
};

/* SaveProperty - saves a property object to the properties array in localStorage
 *    @Params - property: the object to store in the properties array
 */
const SaveProperty = property => {
  //check properties array exists in localStorage
  if (!localStorage.getItem("properties")) {
    //if no properties array exist:
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

/* CheckUserExist - checks to see if a given email exists in the users array
 *    @Params - userEmail - the email to check for in the users array
 */
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

/* CreateNewUser - instantiates a new user with values from the login form
 *                 then saves the new user if they don't already exist in array
 */
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
  } else {
    document.querySelector(".formFeedback").innerHTML =
      "User with same email already exists! Please try logging in. <br/> Re-directing to login page in 5 seconds...";
  }
  document.querySelector("#signup").reset();
  setTimeout(() => {
    document.location = "./login.html";
  }, 5000);
};

/* CreateNewProperty - instantiates a new property object and saves it to the
 *                     properties array in local storage, and to currentProperty
 *                     in sessionStorage.
 */
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

/* CreateNewWorkspace - instantiates a new workspace object and saves it to the
 *                      workspaces array in localstorage and sets it to
 *                      currentWorkspace in sessionStorage
 */
const CreateNewWorkspace = () => {
  //get elements from form
  const type = document.querySelector("#type");
  const occ = document.querySelector("#occ").value;
  const smokeYes = document.querySelector("#smokeYes").checked;
  const availDate = document.querySelector("#availDate").value;
  const term = document.querySelector("#term");
  const price = document.querySelector("#price").value;
  const listYes = document.querySelector("#listYes").checked;
  //get selected items from select elements
  const selType = type.options[type.selectedIndex].value;
  const selTerm = term.options[term.selectedIndex].value;

  let list = true;
  let smoke = false;
  if (smokeYes) {
    smoke = true;
  }
  if (!listYes) {
    list = false;
  }

  let newWorkspace = new Workspace(
    selType,
    occ,
    smoke,
    availDate,
    selTerm,
    price,
    list
  );
  newWorkspace.id = GenRanId(16); //generate a random id to track later

  //save Workspace to currentProp
  let currentProp = JSON.parse(sessionStorage.getItem("currentProp"));
  currentProp.workspace.push(newWorkspace);
  //save updated currentProp in sessionStorage
  sessionStorage.setItem("currentProp", JSON.stringify(currentProp));
  //save updated currentProp to properties in localStorage
  let properties = JSON.parse(localStorage.getItem("properties"));
  let index = properties.findIndex(e => e.id === currentProp.id);
  properties[index] = currentProp;
  localStorage.setItem("properties", JSON.stringify(properties));
  //provide user feedback
  document.querySelector(
    ".formFeedback"
  ).innerHTML = `Successfully added Workspace to ${currentProp.address}`;
  document.querySelector("#addWorkspace").reset();
  setTimeout(() => {
    document.querySelector(".formFeedback").innerHTML = "";
  }, 5000);

  //console.log(newWorkspace);
};

/* Login - Checks to see if the given email and password match a stored user
 *         if they do, set user to currentUser in sessionStorage then load menu
 */
//Login function
const Login = () => {
  const userEmail = document.querySelector("#userEmail").value;
  const userPass = document.querySelector("#userPass").value;

  if (CheckUserExist(userEmail)) {
    let users = JSON.parse(localStorage.getItem("users"));
    let index = users.findIndex(user => user.email === userEmail);
    if (users[index].pass === userPass) {
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

/* ShowOwnerProperties - gets the properties with currentUser email then
 *              fill in the #propertiesTable
 */
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
    let parking = "No";
    if (e.parking) {
      parking = "Yes";
    }
    let transit = "No";
    if (e.transit) {
      transit = "Yes";
    }
    let listed = "No";
    if (e.listed) {
      listed = "Yes";
    }

    let result = `<tbody><tr>
      <td><button name="${e.id}" onclick="EditSelectedProp(this.name, './ownerEdit.html');">Edit</button></td>
      <td>${e.address}</td>
      <td>${e.neighbor}</td>
      <td>${e.sqFeet}</td>
      <td>${parking}</td>
      <td>${transit}</td>
      <td>${listed}</td>
      <td>${e.workspace.length} Workspaces 
      <button name="${e.id}" onclick="EditSelectedProp(this.name, './ownerWorkspace.html');">View/Add/Modify</button></td>
      </tr></tbody>`;
    propertiesTable.insertAdjacentHTML("beforeend", result);
  });
};

/* EditSelectedProp - sets the currentProp
 *    @Params - id: the id of the property to set as current
 *              location: the edit page to load
 */
const EditSelectedProp = (id, location) => {
  //saves selected prop to sessionStorage
  const properties = JSON.parse(localStorage.getItem("properties"));
  const index = properties.findIndex(prop => prop.id === id);
  let currentProp = properties[index];
  sessionStorage.setItem("currentProp", JSON.stringify(currentProp));
  //load edit page
  document.location = location;
};

/* PopulateProp - populates the edit form with the current
 *                Property details
 */
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

/* EditCurrentProp - Takes form input and saves them to the current
 *              property, then updates the saved property in localStorage
 */
const EditCurrentProp = () => {
  //get dom elements of edit form
  const address = document.querySelector("#address").value;
  const neighbor = document.querySelector("#neighborhood").value;
  const sqFeet = document.querySelector("#sqFeet").value;
  const parkingYes = document.querySelector("#parkingYes").checked;
  const transitYes = document.querySelector("#transitYes").checked;
  const listYes = document.querySelector("#listYes").checked;
  //retrieve the currentProp from sessionStorage
  let currentProp = JSON.parse(sessionStorage.getItem("currentProp"));
  //update the currentProp with changes
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

  //retrieve properties from localStorage, then update with edited currentProp
  let properties = JSON.parse(localStorage.getItem("properties"));
  //find the currentProp in properties using its id
  let index = properties.findIndex(e => e.id === currentProp.id);
  properties[index] = currentProp;
  localStorage.setItem("properties", JSON.stringify(properties));
  //send user back to view properties page
  document.location = "./ownerShow.html";
};

/* DeleteCurrentProp - Removes the current property from localStorage
 *                    and clears the currentProp from sessionStorage
 */
const DeleteCurrentProp = () => {
  //retrieve currentProp and properties
  const currentProp = JSON.parse(sessionStorage.getItem("currentProp"));
  let properties = JSON.parse(localStorage.getItem("properties"));
  //get index of currentProp in properties
  const index = properties.findIndex(e => e.id == currentProp.id);
  //remove currentProp from properties
  properties.splice(index, 1);
  //save updated properties to localStorage
  localStorage.setItem("properties", JSON.stringify(properties));
  //clear currentProp from sessionStorage
  sessionStorage.setItem("currentProp", JSON.stringify([]));

  //send user back to My Properties menu
  document.location = "./ownerMenu.html";
};

/* ShowWorkspaces - Builds a table that shows all workspaces in the currentProp
 *                  Displays an appropriate message if no workspaces found.
 */
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
    let type;
    if (e.type === "meet") type = "Meeting Room";
    if (e.type === "office") type = "Private Office";
    if (e.type === "desk") type = "Open Area Desk";

    let smoke = e.smoke ? "Yes" : "No";

    let term;
    if (e.term === "day") term = "1 Day";
    if (e.term === "week") term = "1 Week";
    if (e.term === "month") term = "1 Month";

    let listed = e.listed ? "Yes" : "No";

    let result = `<tbody>
      <tr>
        <td>
          <button 
            name="${e.id}" 
            id="${currentProp.id}" 
            onclick="EditSelectedWorkspace(this.id, this.name);"
            >Edit
          </button>
        </td>
        <td>${type}</td>
        <td>${e.occ}</td>
        <td>${smoke}</td>
        <td>${e.availDate}</td>
        <td>${term}</td>
        <td>${e.price}</td>
        <td>${listed}</td>
      </tr></tbody>`;
    workspacesTable.insertAdjacentHTML("beforeend", result);
  });
};

/* EditSelectedWorkspace - Saves the selected workspace as the currentWorkspace
 *    @Params - propId: the currentProp Id
                workID: tje id of the selected workspace
 */
const EditSelectedWorkspace = (propId, workId) => {
  //retrieve properties from localStorage
  const properties = JSON.parse(localStorage.getItem("properties"));
  //find index of currentProp
  const propIndex = properties.findIndex(prop => prop.id === propId);
  //find index of selected Workspace
  const workIndex = properties[propIndex].workspace.findIndex(
    work => work.id === workId
  );
  //save selected workspace as currentWork, then add propId
  let currentWork = properties[propIndex].workspace[workIndex];
  currentWork.myPropId = propId;
  //save currentWork into sessionStorage
  sessionStorage.setItem("currentWork", JSON.stringify(currentWork));
  //load edit page
  document.location = "./ownerWorkspaceEdit.html";
};

/* PopulateCurrentWork - populates the edit workspace form with data from currentWork
 */
const PopulateCurrentWork = () => {
  //get dom elements from form
  const type = document.querySelector("#type");
  const occ = document.querySelector("#occ");
  const smokeYes = document.querySelector("#smokeYes");
  const smokeNo = document.querySelector("#smokeNo");
  const availDate = document.querySelector("#availDate");
  const term = document.querySelector("#term");
  const price = document.querySelector("#price");
  const listYes = document.querySelector("#listYes");
  const listNo = document.querySelector("#listNo");

  //load currentWork from sessionStorage
  let currentWork = JSON.parse(sessionStorage.getItem("currentWork"));

  //fill in form with values from currentWork
  if (currentWork.type === "meet") type.options[0].selected = true;
  if (currentWork.type === "office") type.options[1].selected = true;
  if (currentWork.type === "desk") type.options[2].selected = true;
  occ.value = currentWork.occ;
  if (currentWork.smoke) {
    smokeYes.checked = true;
  } else {
    smokeNo.checked = true;
  }
  availDate.value = currentWork.availDate;
  if (currentWork.term === "day") term.options[0].selected = true;
  if (currentWork.term === "week") term.options[1].selected = true;
  if (currentWork.term === "month") term.options[2].selected = true;
  price.value = currentWork.price;
  if (currentWork.listed) {
    listYes.checked = true;
  } else {
    listNo.checked = true;
  }
};

/* EditCurrentWork - Gets form input and updates the currentWorkplace
 *                   with new input
 */
const EditCurrentWork = () => {
  //get elements from form
  const type = document.querySelector("#type");
  const occ = document.querySelector("#occ").value;
  const smokeYes = document.querySelector("#smokeYes").checked;
  const availDate = document.querySelector("#availDate").value;
  const term = document.querySelector("#term");
  const price = document.querySelector("#price").value;
  const listYes = document.querySelector("#listYes").checked;
  //get selected items from select elements
  const selType = type.options[type.selectedIndex].value;
  const selTerm = term.options[term.selectedIndex].value;

  //retrieve currentWork from sessionStorage
  let currentWork = JSON.parse(sessionStorage.getItem("currentWork"));
  //update currentWork
  currentWork.type = selType;
  currentWork.occ = occ;
  if (smokeYes) currentWork.smoke = true;
  else currentWork.smoke = false;
  currentWork.availDate = availDate;
  currentWork.term = selTerm;
  currentWork.price = price;
  if (listYes) currentWork.listed = true;
  else currentWork.listed = false;

  //retrieve property that contains current workspace from localStorage
  let properties = JSON.parse(localStorage.getItem("properties"));

  //find index of currentProp
  const propIndex = properties.findIndex(
    prop => prop.id === currentWork.myPropId
  );
  //find index of selected Workspace
  const workIndex = properties[propIndex].workspace.findIndex(
    work => work.id === currentWork.id
  );

  //save updated workspace to properties in localStorage and update currentProp in sessionStorage
  properties[propIndex].workspace[workIndex] = currentWork;
  localStorage.setItem("properties", JSON.stringify(properties));
  sessionStorage.setItem("currentProp", JSON.stringify(properties[propIndex]));

  //send user back to workspaces page
  document.location = "./ownerWorkspace.html";
};

/* DeleteCurrentWork - Removes the currentWorkspace from it's property's workspace array
 *                     in localStorage and clears the currentWorkspace form sessionStorage
 */
const DeleteCurrentWork = () => {
  //get currentWork from sessionStorage and properties from localStorage
  let currentWork = JSON.parse(sessionStorage.getItem("currentWork"));
  let properties = JSON.parse(localStorage.getItem("properties"));
  let propIndex = properties.findIndex(
    prop => prop.id === currentWork.myPropId
  );
  let workIndex = properties[propIndex].workspace.findIndex(
    work => work.id === currentWork.id
  );

  properties[propIndex].workspace.splice(workIndex, 1);
  localStorage.setItem("properties", JSON.stringify(properties));
  sessionStorage.setItem("currentProp", JSON.stringify(properties[propIndex]));
  sessionStorage.setItem("currentWork", JSON.stringify([]));

  document.location = "./ownerWorkspace.html";
};

//displays the current user name in #displayUserName
const DisplayUserName = () => {
  const displayName = document.querySelector("#displayUserName");
  const name = JSON.parse(sessionStorage.getItem("currentUser")).fName;
  displayName.innerText = name;
};

//displays the current property address in #titleProp
const DisplayPropName = () => {
  const displayTitle = document.querySelector("#titleProp");
  const title = JSON.parse(sessionStorage.getItem("currentProp")).address;
  displayTitle.innerText = title;
};

/* GenRanId - a pseudo random alpha-numeric character generator
 *    @Params - length: how many random characters to generate
 */
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

/* SaveAvailWorkspaces - Builds an array of all available workspaces
 *               and saves it as "availWorkspaces" in sessionStorage
 */
const SaveAvailWorkspaces = () => {
  //retrieve properties
  const properties = JSON.parse(localStorage.getItem("properties"));
  let availProps = properties.filter(e => e.listed);
  let availWork = [];
  availProps.forEach(prop => {
    prop.workspace.forEach(work => {
      if (work.listed) {
        work.address = prop.address;
        work.neighbor = prop.neighbor;
        work.sqFeet = prop.sqFeet;
        work.parking = prop.parking;
        work.transit = prop.transit;
        work.owner = prop.owner;
        availWork.push(work);
      }
    });
  });
  sessionStorage.setItem("availWorkspaces", JSON.stringify(availWork));
  sessionStorage.setItem("displayWorkspaces", JSON.stringify(availWork));
};

/* PopulateWorkTables - shows all workspaces within the dataset in a table
 *    @Params - dataset: the array of workspaces to display in table
 */
const PopulateWorkTable = dataset => {
  //load the dataset from sessionStorage
  const workspaces = JSON.parse(sessionStorage.getItem(dataset));
  if (!workspaces.length) {
    document.querySelector(
      "#noWorkspaces"
    ).innerHTML = `Sorry there are no available workspaces. Try changing the filter settings. 
      <br/> There also may not be any Workspaces available.`;
  }

  const table = document.querySelector("#availWorkTable");
  let body =
    //table headers
    `<tbody>
        <tr>
            <th>
                Address<button onclick="Sort('address', 'asc');">&uarr;</button
                ><button onclick="Sort('address', 'des');">&darr;</button>
            </th>
            <th>
                Neighborhood<button onclick="Sort('neighbor', 'asc');">&uarr;</button
                ><button onclick="Sort('neighbor', 'des');">&darr;</button>
            </th>
            <th>
                Type<button onclick="Sort('type', 'asc');">&uarr;</button
                ><button onclick="Sort('type', 'des');">&darr;</button>
            </th>
            <th>
                Occupancy<button onclick="Sort('occ', 'asc');">&uarr;</button
                ><button onclick="Sort('occ', 'des');">&darr;</button>
            </th>
            <th>
                SqFeet<button onclick="Sort('sqFeet', 'asc');">&uarr;</button
                ><button onclick="Sort('sqFeet', 'des');">&darr;</button>
            </th>
            <th>
                Term<button onclick="Sort('term', 'asc');">&uarr;</button
                ><button onclick="Sort('term', 'des');">&darr;</button>
            </th>
            <th>
                Price<button onclick="Sort('price', 'asc');">&uarr;</button
                ><button onclick="Sort('price', 'des');">&darr;</button>
            </th>
            <th>
                Available Date<button onclick="Sort('availDate', 'asc');">&uarr;</button
                ><button onclick="Sort('availDate', 'des');">&darr;</button>
            </th>
            <th>
                Parking Garage<button onclick="Sort('parking', 'asc');">&uarr;</button
                ><button onclick="Sort('parking', 'des');">&darr;</button>
            </th>
            <th>
                Smoking<button onclick="Sort('smoke', 'asc');">&uarr;</button
                ><button onclick="Sort('smoke', 'des');">&darr;</button>
            </th>
            <th>
                Transit<button onclick="Sort('transit', 'asc');">&uarr;</button
                ><button onclick="Sort('transit', 'des');">&darr;</button>
            </th>
            <th>Contact</th>
        </tr>
    </tbody>`;

  workspaces.forEach(workspace => {
    const address = workspace.address;
    const neighbor = workspace.neighbor;
    let type = workspace.type;
    const occ = workspace.occ;
    const sqFeet = workspace.sqFeet;
    let term = workspace.term;
    const price = workspace.price;
    const availDate = workspace.availDate;
    const parking = workspace.parking;
    const smoke = workspace.smoke;
    const transit = workspace.transit;
    const owner = workspace.owner;

    if (type === "meet") type = "Meeting Room";
    if (type === "office") type = "Private Office";
    if (type === "desk") type = "Desk in Open Area";

    if (term === "day") term = "Day";
    if (term === "week") term = "Week";
    if (term === "month") term = "Month";

    body += `<tbody>
                <tr>
                    <td>${address}</td>
                    <td>${neighbor}</td>
                    <td>${type}</td>
                    <td>${occ}</td>
                    <td>${sqFeet}</td>
                    <td>${term}</td>
                    <td>$${price}</td>
                    <td>${availDate}</td>
                    <td>${parking ? "Yes" : "No"}</td>
                    <td>${smoke ? "Yes" : "No"}</td>
                    <td>${transit ? "Yes" : "No"}</td>
                    <td><button id="${owner}" onclick="ShowOwnerInfo(this.id);">View</button></td>
                </tr>
            </tbody>`;
  });
  table.innerHTML = body;
};

/* FirstLoadWorkTable - run on load of coworkerShow, sets availWorkspaces
 *                      then populates the table
 */
const FirstLoadWorkTable = () => {
  //
  SaveAvailWorkspaces();
  PopulateWorkTable("availWorkspaces");
};

/* InsertFilterInput - Dynamically changes the filterTerm input depending
 *                     on the filterBy selection
 */
const InsertFilterInput = () => {
  const filSelect = document.querySelector("#filterBy");
  const insertPoint = document.querySelector("#filterTermInput");
  let insertInput;
  if (filSelect.options[filSelect.selectedIndex].value === "none") {
    insertInput = `<label for="filterTerm">Filter Term: </label>
        <input type="text" id="filterTerm" disabled />`;
  }

  if (
    filSelect.options[filSelect.selectedIndex].value === "address" ||
    filSelect.options[filSelect.selectedIndex].value === "neighbor"
  ) {
    insertInput = `<label for="filterTerm">Filter Term: </label>
            <input type="text" id="filterTerm" required maxlength="100" />`;
  }

  if (filSelect.options[filSelect.selectedIndex].value === "type") {
    insertInput = `<label for="filterTerm">Filter Type: </label>
      <select name="filterTerm" id="filterTerm">
        <option value="meet">Meeting Room</option>
        <option value="office">Private Office</option>
        <option value="desk">Open Area Desk</option>
      </select>`;
  }

  if (
    filSelect.options[filSelect.selectedIndex].value === "occ" ||
    filSelect.options[filSelect.selectedIndex].value === "sqFeet"
  ) {
    insertInput = `<label for="filterTerm">Filter Term: </label>
        <input type="number" id="filterTerm" required min="1" />`;
  }

  if (filSelect.options[filSelect.selectedIndex].value === "term") {
    insertInput = `<label for="filterTerm">Term: </label>
      <select name="filterTerm" id="filterTerm">
        <option value="day">1 Day</option>
        <option value="week">1 Week</option>
        <option value="month">1 Month</option>
      </select>`;
  }

  if (filSelect.options[filSelect.selectedIndex].value === "availDate") {
    insertInput = `<label for="filterTerm">This Date: </label>
      <input type="date" id="filterTerm" required />`;
  }

  if (
    filSelect.options[filSelect.selectedIndex].value === "parking" ||
    filSelect.options[filSelect.selectedIndex].value === "smoke" ||
    filSelect.options[filSelect.selectedIndex].value === "transit"
  ) {
    insertInput = `Select:
    <label for="filterTermYes"
      >Yes
      <input
        type="radio"
        class="radio"
        id="filterTermYes"
        name="filterTerm"
        checked
    /></label>
    <label for="filterTermNo"
      >No 
      <input 
        type="radio" 
        class="radio" 
        id="filterTermNo" 
        name="filterTerm"
    /></label>`;
  }

  insertPoint.innerHTML = insertInput;
};

/* FilterReady - Gets the selected filerBy and filerTerm, then
 *      feeds that to the Filter function
 */
const FilterReady = () => {
  document.querySelector("#noWorkspaces").innerHTML = "";
  //get filterBy and filterTerm from DOM
  const filSelect = document.querySelector("#filterBy");
  const filterBy = filSelect.options[filSelect.selectedIndex].value;

  let filterInput;
  //input box only filterBy options
  if (
    filterBy === "address" ||
    filterBy === "neighbor" ||
    filterBy === "occ" ||
    filterBy === "sqFeet" ||
    filterBy === "availDate"
  ) {
    filterInput = document.querySelector("#filterTerm").value;
  }
  //select list filterBy options
  if (filterBy === "type" || filterBy === "term") {
    let filSelect = document.querySelector("#filterTerm");
    filterInput = filSelect.options[filSelect.selectedIndex].value;
  }

  if (
    filterBy === "parking" ||
    filterBy === "smoke" ||
    filterBy === "transit"
  ) {
    document.querySelector("#filterTermYes").checked
      ? (filterInput = true)
      : (filterInput = false);
  }

  //run the filter
  Filter(filterBy, filterInput);
};

/* Filter - Filters the workspace table by a column and term then updates the table
 *    @Params - filterBy: the column to filter
 *              filterInput: the term/input to filter for
 */
const Filter = (filterBy, filterInput) => {
  //retrieve availWorkspaces from sessionStorage
  const originalData = JSON.parse(sessionStorage.getItem("availWorkspaces"));
  console.log("filterBy = " + filterBy);
  console.log("filterInput = " + filterInput);
  let filteredData;

  if (filterBy === "none") {
    filteredData = originalData;
  } else if (
    filterBy === "parking" ||
    filterBy === "smoke" ||
    filterBy === "transit"
  ) {
    filteredData = originalData.filter(e => e[filterBy] === filterInput);
  } else {
    filteredData = originalData.filter(e =>
      e[filterBy].toLowerCase().includes(filterInput.toLowerCase())
    );
  }

  //store filtered data in displayWorkspaces
  sessionStorage.setItem("displayWorkspaces", JSON.stringify(filteredData));
  //display the filtered data
  PopulateWorkTable("displayWorkspaces");
};

/* Sort - Sorts the workspaces being displayed in the table by a column
 *    @Params - sortBy: the column to sort by
 *            - order: either ascending or descending
 */
const Sort = (sortBy, order) => {
  let currentDisplay = JSON.parse(sessionStorage.getItem("displayWorkspaces"));

  if (order === "asc") {
    if (
      sortBy === "address" ||
      sortBy === "neighbor" ||
      sortBy === "type" ||
      sortBy === "term" ||
      sortBy === "availDate"
    ) {
      currentDisplay.sort((a, b) => {
        if (a[sortBy] > b[sortBy]) return 1;
        else if (a[sortBy] < b[sortBy]) return -1;
        else return 0;
      });
    }

    if (sortBy === "parking" || sortBy === "smoke" || sortBy === "transit") {
      currentDisplay.sort((a, b) => {
        if (a[sortBy] && !b[sortBy]) return 1;
        else if (!a[sortBy] && b[sortBy]) return -1;
        else return 0;
      });
    }

    if (sortBy === "occ" || sortBy === "sqFeet" || sortBy === "price") {
      currentDisplay.sort((a, b) => {
        if (parseFloat(a[sortBy]) > parseFloat(b[sortBy])) return 1;
        else if (parseFloat(a[sortBy]) < parseFloat(b[sortBy])) return -1;
        else return 0;
      });
    }
  } else {
    if (
      sortBy === "address" ||
      sortBy === "neighbor" ||
      sortBy === "type" ||
      sortBy === "term" ||
      sortBy === "availDate"
    ) {
      currentDisplay.sort((a, b) => {
        if (a[sortBy] > b[sortBy]) return -1;
        else if (a[sortBy] < b[sortBy]) return 1;
        else return 0;
      });
    }

    if (sortBy === "parking" || sortBy === "smoke" || sortBy === "transit") {
      currentDisplay.sort((a, b) => {
        if (a[sortBy] && !b[sortBy]) return -1;
        else if (!a[sortBy] && b[sortBy]) return 1;
        else return 0;
      });
    }

    if (sortBy === "occ" || sortBy === "sqFeet" || sortBy === "price") {
      currentDisplay.sort((a, b) => {
        if (parseFloat(a[sortBy]) > parseFloat(b[sortBy])) return -1;
        else if (parseFloat(a[sortBy]) < parseFloat(b[sortBy])) return 1;
        else return 0;
      });
    }
  }
  sessionStorage.setItem("displayWorkspaces", JSON.stringify(currentDisplay));
  PopulateWorkTable("displayWorkspaces");
};

/* ShowOwnerInfo - Displays the owner contact info in a popUp
 *
 */
const ShowOwnerInfo = email => {
  document.querySelector("#popUp").classList.remove("popUpHide");
  const popUpMsg = document.querySelector("#popMsg");
  const users = JSON.parse(localStorage.getItem("users"));
  let owner;
  users.forEach(user => {
    if (user.email === email) owner = user;
  });
  let info = `Owner: ${owner.fName} ${owner.lName}\n
              Phone: ${owner.phone}\n
              Email: ${owner.email}`;
  console.log(info);
  popUpMsg.innerText = info;
};

/* ClosePopup - closes the popUp
 */
const ClosePopup = () => {
  document.querySelector("#popUp").classList.add("popUpHide");
};

/* FormListener - adds an event listener to the form with selector listening
 *              for submit, then blocks the page from refreshing and runs a function.
 *    @Params - selector: the selector of the form to add listener
 *              func: the name of the function to run * do not include ()
 */
const FormListener = (selector, func) => {
  //Only add the event listener if the selector exists on the current page.
  if (document.querySelector(selector))
    document.querySelector(selector).addEventListener("submit", event => {
      event.preventDefault(); //Stops the page from refreshing when submitting the form.
      func(); //The function to run when the form is submitted.
    });
};

FormListener("#signup", CreateNewUser);
FormListener("#login", Login);
FormListener("#addProperty", CreateNewProperty);
FormListener("#editProperty", EditCurrentProp);
FormListener("#addWorkspace", CreateNewWorkspace);
FormListener("#editWorkspace", EditCurrentWork);
FormListener("#filterForm", FilterReady);
