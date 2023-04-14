let inputField1 = document.createElement("input");
let inputField2 = document.createElement("input");

let routeList;

let hashParams = null;
let accessToken = localStorage.getItem("access_token");


//Stores token right after verification from the dashboard page
if (!window.location.pathname.includes("generate_review")) {
  //extracts everything after "#" in url
  hashParams = new URLSearchParams(window.location.hash.substr(1));
  accessToken = hashParams.get("access_token"); //save token to variable
  localStorage.setItem("access_token", accessToken);
}

let rootPath = "";
let fileName = "";
let foundFiles = false;
let storeToken = "";

// const urlParams = new URLSearchParams(window.location.search);
// const contractId = urlParams.get('contract_id');
// localStorage.setItem('contractId', contractId);
// let contract_id = localStorage.getItem('contractId');

//! Dropbox credentials

const dropboxClientId = "gsw6a2m0r2u44lt"; //hd: gsw6a2m0r2u44lt //me: lqp7zeiwcl5toer
const clientSecret = "nwpi7lk0yyp2v44"; //HD: nwpi7lk0yyp2v44 //me:4jcwnu9bagjrc89
const redirectHomeUrl = "https://hyperiondev.cogrammar.com/reviewer/dashboard/"; // your redirect URI http://localhost:3000/testRoute/index.html

// get access token from local storage
let getStoredToken = localStorage.getItem("access_token");
//console.log("getStoredToken", getStoredToken);

let dbx = new Dropbox.Dropbox({
  clientId: dropboxClientId,
  clientSecret: clientSecret,
  accessToken: accessToken,
});

//Don't check token on review page
if (window.location.pathname.includes("generate_review")) {
  createUI()
} else {
  checkToken(dbx);
}

//! 1 Check token validity
function checkToken(dbx) {
  console.log(`%c Checking token`, "color: #f078c0");
   dbx.usersGetCurrentAccount()
    .then(function (response) {
      console.log(`%c Access token is still valid`, 'color: #7cb518')
      window.location.pathname.includes("generate_review") && createUI();
    })
    .catch(function (error) {
      alert("Access token expired or is invalid. Proceeding to auth.")
      console.log(`%c Access token expired or is invalid`, 'color: #f94144')
      //localStorage.removeItem("access_token");
      auth2Flow();
    });
}

//! Step 1.1: If needed, get access
function auth2Flow() {
  console.log(`%c  Auth2Flow`, "color: red");
  // Remove the token from the URL
  //replaceState() method modifies the browser's history object
  history.replaceState({}, document.title, window.location.href.split("#")[0]);

  // Redirect the user to the authorization URL
  const authUrl =
    "https://www.dropbox.com/oauth2/authorize" +
    "?response_type=token" +
    "&client_id=" +
    dropboxClientId +
    "&redirect_uri=" +
    encodeURIComponent(redirectHomeUrl);
  window.location.href = authUrl;
}

// Step 3: Handle redirect from Dropbox auth page
if (window.location.pathname === "http://localhost:3000/testRoute/index.html") {
  const hashParams = new URLSearchParams(window.location.hash.substr(1));
  const accessToken = hashParams.get("access_token");
  console.log(`%c  Token stored to localStorage`, "color: red");
  // save token to local storage
  localStorage.setItem("access_token", accessToken);

  if (accessToken) {
    // Send the access token back to the auth tab
    chrome.runtime.sendMessage({ token: accessToken });
    // Close this tab
    window.close();
  }
}

//! Step 2:  Create Floating the UI elements
function createUI() {
  console.log(`%c Creating UI`, "color: red");
  // Create the floating element properties
  routeList = document.createElement("div");
  routeList.className = "DBXFF-query-results";
  routeList.textContent = "Route List";
  const inputContainer = document.createElement("div");
  inputContainer.className = "DBXFF-main-input-container";

  const floatingElement = document.createElement("div");
  //const header = document.createElement("h1");
  //header.innerText = "Floating Element";
  floatingElement.className = "DBXFF-box-layout DBXFF-slide-in-left";

  //create the toggle button
  let slideBtn = document.createElement("div");
  slideBtn.className = "DBXFF-slide-btn ";
  slideBtn.textContent = "Toggle Slide";
  slideBtn.addEventListener("click", () => {
    floatingElement.classList.toggle("DBXFF-slide-out-left");
    slideBtn.classList.toggle("toggleBtn");
  });

  inputField1.id = "DBXFF-myInputField1";
  inputField1.type = "text";
  inputField1.placeholder = "Student number";

  inputField2.id = "DBXFF-myInputField2";
  inputField2.type = "text";
  inputField2.placeholder = "Task name / PDF name";

  floatingElement.prepend(slideBtn);
  //floatingElement.appendChild(header);
  inputContainer.appendChild(inputField1);
  inputContainer.appendChild(inputField2);

  inputContainer.appendChild(routeList);
  floatingElement.appendChild(inputContainer);

  document.body.appendChild(floatingElement);

  // Call function to get page values and update UI elements

  extractStudentNumber(); //! Step 2.1 : Call function to "Extract the student number"
}

//! Extracts the task name from the page elements
function extractTaskName(studentNumber) {
  console.log(`%c  Extracting Student Name`, "color: red");
  // Find all h6 elements containing the word "Task"
  let h6Tags = [...document.querySelectorAll("h6")].filter((task) =>
    task.textContent.includes("Task")
  );

  // Loop through each h6 element and extract the text after "-"
  h6Tags.forEach((task) => {
    const text = task.textContent?.trim();
    const index = text.indexOf("-") + 1;

    let result;

    // If the text contains "-", extract the text after "-" and check if it contains ":"
    if (index !== 0) {
      result = text.substring(index)?.trim();

      // If the result contains ":", extract the text after the last ":" instead
      if (result.includes(":")) {
        const lastIndex = result.lastIndexOf(":") + 1;
        result = result.substring(lastIndex)?.trim();
      }
    }

    inputField2.value = result;
    filesSearch(studentNumber, result);
  });
}

//! Extract the student number from the page elements
function extractStudentNumber() {
  console.log(`%c  Extracting St Number`, "color: red");
  // Select all h6 elements on the page
  const h6Element = [...document.querySelectorAll("h6")].filter((task) =>
    task.textContent.includes("Student number")
  );
  const studentNumber = h6Element[0]?.textContent?.split(":")[1]?.trim();
  inputField1.value = studentNumber;

  extractTaskName(studentNumber); //! Step 2.1 :  Call function to "Extracts the task name"
}

//! Step 3 Find a specific file by name - Display results
//if more then one root folder exists for example "myFolder and myFolder (1)...",
//first search for my myFolder, then using an incrementor to control the value
//between the brackets, and making up to 3 searches each time adding its results to the UI

async function filesSearch(studentNumber, taskName) {
 
  let inc = 0;
  console.log(`%c Searching for files ${inc}`, "color: #5390d9");

  let retry = inc;
  const query = taskName;
  const path = inc > 0 ? studentNumber + ` (${retry})` : studentNumber;

  // Call the Dropbox API to search for a file
  await dbx
    .filesSearchV2({
      query: query,
      options: {
        path: "/" + path,
        //file_extensions: [".pdf"],
        max_results: 5,
      },
    })
    .then(function (response) {
      inc++; //after 1rst request look for a 2nd folder
      let results = response.result.matches;

      //if results are 0 and we did 3 searches already? stop
      if (results.length === 0 && inc >= 3) {
        currentRouteUI.innerHTML = `No files files with name ${fileName} was found`;
        return;
      } else {
        if (!foundFiles) {
          //foundFiles = true;
          console.log(`%c  making request: ${inc}`, "color: red");
          results.forEach((item, i) => {
            let btnAndListContainer = document.createElement("div");
            btnAndListContainer.className = "DBXFF-btnAndListContainer";
            let foundRes = document.createElement("p");
            foundRes.textContent = item.metadata.metadata.path_display;
            console.log('item', item)

            let dlIcon = document.createElement("img");
            let linkIcon = document.createElement("img");
            linkIcon.title = "Open Folder in dropbox";
            linkIcon.src = chrome.runtime.getURL("images/externalLink.png");
            linkIcon.addEventListener("click", async (e) => {
              console.log('item: ',item)

              let str = item.metadata.metadata.path_display;

              // Find the last index of "/"
              let lastSlashIndex = str.lastIndexOf("/");

              // Remove everything after the last "/"
              let newStr = str.substring(0, lastSlashIndex);

              // Replace all spaces with "%20"
              let link = "https://www.dropbox.com/work/HyperionDev%20Reviewers/"+newStr.replace(" ", "%20")

              // Open the folder URL in a new tab
              window.open(link, "_blank");
            });  
            //linkIcon.href = createExternalLink(folderPath)
            let type = document.createElement("img");
            type.alt = item.metadata.metadata.name;
            dlIcon.src = chrome.runtime.getURL("images/dlFOlder.png");
            dlIcon.alt = "dl-icon";
            dlIcon.className = "DBXFF-dl-icon-list";
            dlIcon.title =
              "Download " +
              item.metadata.metadata.name
                .slice(0)
                .substring(item.metadata.metadata.name.lastIndexOf("/") + 1);
            dlIcon.addEventListener("click", async (e) => {
              e.stopPropagation(); //prevent the route from being selected
              //! Download selected Folder or file
              downloadFolder(item.metadata.metadata); //folder
            });

            btnAndListContainer.appendChild(dlIcon);
            btnAndListContainer.appendChild(linkIcon);
            btnAndListContainer.appendChild(foundRes);
            routeList.appendChild(btnAndListContainer);
            highlightInputName(inputField2.value);
          });
          
          //look in 2nd and 3rd folder
          if (inc >= 3) {
            return;
          }
          filesSearch(retry);
        }
      }
    })
    .catch(function (error) {
      console.log(error.error);
    });
}

//Download the Folder
function downloadFolder(dir) {
  console.log(`%c  creating Download Folder path`, "color: red");
  let pdfExists = false;
  if (dir.path_display.endsWith(".pdf")) {
    pdfExists = true;
  }

  //download the found files parent directory
  if (pdfExists) {
    const lastIndex = dir.path_display.lastIndexOf("/");
    const folderPath = dir.path_display.substring(0, lastIndex);
    downloadFileBob(folderPath);
  } else {
    //download the  directory
    downloadFileBob(dir.path_display);
  }
}

//download the selected fine in zip format
async function downloadFileBob(path) {
  console.log(`%c  Creating download folder blob/zip`, "color: red");
  await dbx
    .filesDownloadZip({ path: path })
    .then(function (response) {
      //const fileName = response.result.metadata.name
      const blob = new Blob([response.result.fileBlob], {
        type: "application/zip",
      });
      getDLLink(blob, path.substring(path.lastIndexOf("/") + 1));
      //displayFiles(response.result.fileBlob);
    })
    .catch(function (error) {
      console.error(error);
    });
}

//Add href download link for folder to button
function getDLLink(blob, name) {
  console.log(`%c  Creating download link`, "color: red");
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  document.body.appendChild(link);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  //loadingImage.style.display = "none";
}

//Created and external link to the folder
function createExternalLink(folderPath) {
  console.log(`%c  Creating external Folder link`, "color: red");
  dbx
    .sharingCreateSharedLinkWithSettings({ path: folderPath })
    .then(function (response) {
      // Extract the URL of the shared link
      let sharedLinkUrl = response.url;

      // Open the shared link in a new window
      return sharedLinkUrl;
    })
    .catch(function (error) {
      console.log(error.error);
    });
}

//Extracts the word that matches the input name and only highlight that word.
function highlightInputName(inputVal) {
  console.log(`%c  Highlighting related words in display results`, "color: red");
  const elements = document.getElementsByTagName("p");

  for (let i = 0; i < elements.length; i++) {
    const text = elements[i].innerText;
    if (text.includes(inputVal)) {
      const highlightedText = text.replace(
        new RegExp(inputVal, "gi"),
        "<mark>$&</mark>"
      );
      elements[i].innerHTML = highlightedText;
    }
  }
}
