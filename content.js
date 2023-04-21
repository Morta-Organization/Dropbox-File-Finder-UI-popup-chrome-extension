let floatingElement = document.createElement("div");
let reviewCompleteBtn = document.querySelector("#submit-review-btn");
let timerContainer = document.createElement("div");
timerContainer.className = "DBXFF-timer-container";
let timeResetIcon = document.createElement("img");
timeResetIcon.src = chrome.runtime.getURL("images/reset.png");
timeResetIcon.alt = "reset timer";
timeResetIcon.title = "Reset timer";
timerContainer.appendChild(timeResetIcon);
floatingElement.prepend(timerContainer);
let foundTaskName;

// Create the counter element
let counterEl = document.createElement("p");
// Initialize the counter and last saved time from local storage, or use default values
let counter = parseInt(localStorage.getItem("counter")) || 0;
let min = parseInt(localStorage.getItem("minutes")) || 0;
let lastSavedTime =
  parseInt(localStorage.getItem("lastSavedTime")) || new Date().getTime();
console.log("lastSavedTime", lastSavedTime);

// Calculate the elapsed time since the last saved time and add it to the counter
counter += Math.floor((new Date().getTime() - lastSavedTime) / 1000);
console.log("counter", counter);

counterEl.className = "DBXFF-timer pulsate-fwd";
timerContainer.prepend(counterEl);

let reviewDetailsEl = document.createElement("div");
reviewDetailsEl.className = "DBXFF-review-details";
let studentNameEl = document.createElement("h4");
let studentNumberContainerEl = document.createElement("div");
studentNumberContainerEl.className = "DBXFF-student-number-container";
let lookUpStudentBtn = document.createElement("img");
lookUpStudentBtn.src = chrome.runtime.getURL("images/externalLink.png");
lookUpStudentBtn.title = "Look up number in dropbox";
let studentNumberEl = document.createElement("h4");
let taskNameEl = document.createElement("div");
let StudentName = "";
let routeList;
let reviewCount = 0;
let inc = 0;
let combinedTime = 0;
let removeSpinner = false;
let hashParams = null;
let rootPath = "";
let fileName = "";
let foundFiles = false;
let storeToken = "";

//! Dropbox credentials
const dropboxClientId = "gsw6a2m0r2u44lt";
const clientSecret = "nwpi7lk0yyp2v44";
const redirectHomeUrl = "https://hyperiondev.cogrammar.com/reviewer/dashboard/"; // your redirect URI http://localhost:3000/testRoute/index.html

//Get token from local storage
let accessToken = localStorage.getItem("access_token");

//Stores token right after verification from the dashboard page
if (accessToken === "null") {
  //extracts everything after "#" in url
  hashParams = new URLSearchParams(window.location.hash.substr(1));
  accessToken = hashParams.get("access_token"); //save token to variable
  localStorage.setItem("access_token", accessToken);
}

//DBX object
let dbx = new Dropbox.Dropbox({
  clientId: dropboxClientId,
  clientSecret: clientSecret,
  accessToken: accessToken,
});

if (window.location.pathname.includes("reviewer/dashboard/")) {
  //checkToken(dbx);
}

//Don't check token on review page
if (
  window.location.pathname.includes("generate_review") ||
  window.location.pathname.includes("generate_dfe_review")
) {
  createUI();
}

//! 1 Check token validity
async function checkToken(dbx) {
  console.log(`%c Checking token`, "color: #f078c0");

  // Show loading indicator or disable user interactions
  // while waiting for the method to complete
  loadingIndicator("show");

  try {
    await dbx.usersGetCurrentAccount();
    console.log(`%c Access token is still valid`, "color: #7cb518");
    alert("Access token is still valid ✔");
    //window.location.pathname.includes("generate_review") && createUI();

    // Hide loading indicator or enable user interactions
    loadingIndicator("hide");
  } catch (error) {
    if (removeSpinner) {
      routeList.innerHTML = "Token Expired";
      removeSpinner = false;
    }
    let getToken = confirm('Tokens only last 4 hour. This token might have expired ❌. Proceeding to "Auth" to get a new one.');
    console.log(`%c Access token expired or is invalid`, "color: #f94144");
    if (getToken) {
      localStorage.setItem("access_token", null);
      auth2Flow();
    }

    // Hide loading indicator or enable user interactions
    loadingIndicator("hide");
  }
}

//! Step 1.1: If needed, get access
function auth2Flow() {
  console.log(`%c Auth2Flow`, "color: red");
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
  console.log(`%c Token stored to localStorage`, "color: #a7c957");
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
  let resultsLoaderEl = document.createElement("span");
  resultsLoaderEl.className = "result_loader";

  routeList = document.createElement("div");
  routeList.className = "DBXFF-query-results";
  routeList.innerHTML = `<span class="result_loader"></span>`;
  const inputContainer = document.createElement("div");
  inputContainer.className = "DBXFF-main-input-container";

  //const header = document.createElement("h1");
  //header.innerText = "Floating Element";
  floatingElement.className = "DBXFF-box-layout DBXFF-slide-in-left";
  floatingElement.style.backgroundImage = `url(${chrome.runtime.getURL(
    "./images/nav-bg.gif"
  )})`;
  //create the toggle button
  let slideBtn = document.createElement("div");
  slideBtn.className = "DBXFF-slide-btn ";
  slideBtn.textContent = "Hide";
  let hide = false;
  slideBtn.addEventListener("click", () => {
    floatingElement.classList.toggle("DBXFF-slide-out-left");
    slideBtn.classList.toggle("toggleBtn");
    hide = !hide;

    if (hide) {
      slideBtn.textContent = "Show";
      timerContainer.classList.add("DBXFF-timer-container-fixed", "fade-in");
    } else {
      slideBtn.textContent = "Hide";
      timerContainer.classList.remove("DBXFF-timer-container-fixed", "fade-in");
    }
  });

  studentNumberEl.id = "DBXFF-mystudentNumberEl";
  taskNameEl.id = "DBXFF-mytaskNameEl";

  floatingElement.prepend(slideBtn);
  //floatingElement.appendChild(header);
  studentNameEl.textContent = extractStudentName();
  reviewDetailsEl.appendChild(studentNameEl);
  studentNumberContainerEl.appendChild(lookUpStudentBtn);
  studentNumberContainerEl.appendChild(studentNumberEl);
  reviewDetailsEl.appendChild(studentNumberContainerEl);
  reviewDetailsEl.appendChild(taskNameEl);
  inputContainer.appendChild(reviewDetailsEl);

  inputContainer.appendChild(routeList);
  floatingElement.appendChild(inputContainer);

  document.body.appendChild(floatingElement);

  // Call function to get page values and update UI elements
  extractStudentNumber(); //! Step 2.1 : Call function to "Extract the student number"

  //reviewTimer()
  getReviewCounts();
}

//! Extracts the task name from the page elements
function extractTaskName(studentNumber) {
  //look up in dropbox
  lookUpStudentBtn.addEventListener("click", () => {
    let link = `https://www.dropbox.com/search/work?path=%2F&query=${studentNumber}&search_token=mUrM54J2SiALJes%2B%2Boc65k3O8pz4DOlJOX9WlhH8KKI%3D&typeahead_session_id=09702658948404806500012995044766`;
    window.open(link, "_blank");
  });
  console.log(`%c Extracting Task Name`, "color: red");
  // Find all h6 elements containing the word "Task"
  let h6Tags = [...document.querySelectorAll("h6")].filter((task) =>
    task.textContent.includes("Task")
  );

  // Loop through each h6 element and extract the text after "-"
  h6Tags.forEach((task) => {
    const text = task?.textContent?.trim();
    const index = text.indexOf("-") + 1;

    // If the text contains "-", extract the text after "-" and check if it contains ":"
    if (index !== 0) {
      foundTaskName = text?.substring(index)?.trim();

      // If the result contains ":", extract the text after the last ":" instead
      if (foundTaskName.includes(":")) {
        const lastIndex = foundTaskName.lastIndexOf(":") + 1;
        foundTaskName = foundTaskName?.substring(lastIndex)?.trim();
      }
    }

    taskNameEl.textContent = foundTaskName;

    //remove the loader before getting results

    removeSpinner = true;
    filesSearch(studentNumber, foundTaskName);
  });
}

//! Extract the student number from the page elements
function extractStudentNumber() {
  console.log(`%c Extracting St Number`, "color: red");
  // Select all h6 elements on the page
  const h6Element = [...document.querySelectorAll("h6")].filter((task) =>
    task.textContent.includes("Student number")
  );
  const studentNumber = h6Element[0]?.textContent?.split(":")[1]?.trim();
  studentNumberEl.textContent = studentNumber;

  extractTaskName(studentNumber); //! Step 2.1 :  Call function to "Extracts the task name"
  extractStudentName();
}

//! Extract the student name from the page elements
function extractStudentName() {
  console.log(`%c Extracting St Name`, "color: red");

  // Select all h6 elements on the page
  const h6Element = [...document.querySelectorAll("h6")].filter((task) =>
    task.textContent.includes("Student:")
  );
  const stName = h6Element[0]?.textContent?.split(":")[1]?.trim();
  studentName = stName;
  return stName;
}

//! Step 3 Find a specific file by name - Display results
//if more then one root folder exists for example "myFolder and myFolder (1)...",
//first search for my myFolder, then using an incrementor to control the value
//between the brackets, and making up to 3 searches each time adding its results to the UI

async function filesSearch(studentNumber, taskName) {
  console.log(`%c Searching for files ${inc}`, "color: #5390d9");
  let root = studentNumber;
  let retry = inc;
  const query = taskName; //.split("-")[1]?.trim();
  const path = inc > 0 ? root + ` (${retry})` : root;

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
      if (removeSpinner) {
        routeList.innerHTML = "";
        removeSpinner = false;
      }
      //console.log('response', response)
      console.log(`%c  making request: ${inc}`, "color: orange");
      inc++; //after 1rst request look for a 2nd folder
      let results = response.result.matches;

      //if results are 0 and we did 3 searches already? stop
      if (inc >= 4) {
        highlightInputName();
        return;
      } else {
        if (!foundFiles) {
          //foundFiles = true;

          console.log(`%c results found: ${results.length}`, "color: #2196f3");
          results.forEach((item, i) => {
            let btnAndListContainer = document.createElement("div");
            btnAndListContainer.className = "DBXFF-btnAndListContainer";
            let foundRes = document.createElement("div");
            foundRes.className = "DBXFF-foundRes";
            foundRes.textContent = item.metadata.metadata.path_display;
            let dlIconContainer = document.createElement("div");
            dlIconContainer.className = "DBXFF-dlIconContainer";
            let dlIcon = document.createElement("img");
            let linkIcon = document.createElement("img");
            linkIcon.title = "Open Task Folder in dropbox";
            linkIcon.src = chrome.runtime.getURL("images/externalLink.png");
            linkIcon.addEventListener("click", async (e) => {
              let str = item.metadata.metadata.path_display;

              // Find the last index of "/"
              let lastSlashIndex = str.lastIndexOf("/");

              // Remove everything after the last "/"
              let newStr = str.substring(0, lastSlashIndex);

              // Replace all spaces with "%20"
              let link =
                "https://www.dropbox.com/work/HyperionDev%20Reviewers" +
                newStr.replace(" ", "%20");

              // Open the folder URL in a new tab
              window.open(link, "_blank");
            });
            let type = document.createElement("img");
            type.alt = item.metadata.metadata.name;
            dlIcon.src = chrome.runtime.getURL("images/dlFOlder.png");
            dlIcon.alt = "dl-icon";
            dlIcon.className = "DBXFF-dl-icon-list";
            dlIcon.title = "Download Task folder";
            dlIcon.addEventListener("click", async (e) => {
              dlIcon.classList.add("rotate-center");
              dlIcon.src = chrome.runtime.getURL("images/loader.png");
              e.stopPropagation(); //prevent the route from being selected
              //! Download selected Folder or file
              downloadFolder(item.metadata.metadata, dlIcon); //folder
            });

            dlIconContainer.appendChild(dlIcon);
            btnAndListContainer.appendChild(dlIconContainer);
            btnAndListContainer.appendChild(linkIcon);
            btnAndListContainer.appendChild(foundRes);
            routeList.appendChild(btnAndListContainer);
          });

          //look in 2nd and 3rd folder
          if (inc >= 4) {
            return;
          }
          filesSearch(studentNumber, taskName);
        }
      }
    })
    .catch(function (error) {
      console.log(error);
      if (removeSpinner) {
        routeList.innerHTML = "Either the token has expired or, no files were found. Try looking up the student number in Dropbox";
        removeSpinner = false;
      }
      console.log(`%c Search ended`, "color: hotpink");
      checkToken(dbx);
     
      return;
    });
}

//Download the Folder
function downloadFolder(dir, dlIcon) {
  console.log(`%c  creating Download Folder path`, "color: red");
  let pdfExists = false;
  if (dir.path_display.endsWith(".pdf")) {
    pdfExists = true;
  }

  //download the found files parent directory
  if (pdfExists) {
    const lastIndex = dir.path_display.lastIndexOf("/");
    const folderPath = dir.path_display.substring(0, lastIndex);
    downloadFileBob(folderPath, dlIcon);
  } else {
    //download the  directory
    downloadFileBob(dir.path_display, dlIcon);
  }
}

//download the selected fine in zip format
async function downloadFileBob(path, dlIcon) {
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
      console.log(error);
      alert("Error downloading file. Download folder could be containing more than 100 files");
    });

  dlIcon.classList.remove("rotate-center");
  dlIcon.src = chrome.runtime.getURL("images/dlFOlder.png");
}

//Add href download link for folder to button
function getDLLink(blob, name) {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = studentName + "_" + name;
  document.body.appendChild(link);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  //loadingImage.style.display = "none";
}

//Extracts the word that matches the input name and only highlight that word.
function highlightInputName() {
  // Get all the parent div elements
  const parentDivs = document.querySelectorAll(".DBXFF-foundRes");

  // Loop through each parent div
  parentDivs.forEach((div) => {
    // Get the text content of the child div
    let itemText = div.textContent?.toLowerCase()?.trim();
    //split the words into an array
    let wordsToHighlight = foundTaskName.split(" ");

    wordsToHighlight.forEach((word) => {
      if (word.length > 2) {
        if (itemText.includes(word.toLowerCase())) {
          let found = div.innerHTML.replace(
            new RegExp(word, "gi"),
            `<b class="highlight">${word}</b>`
          );
          div.innerHTML = found;
        }
      }
    });
  });
}

//====================================================Review Timer

/*

   When the program is closed, it saves the current counter and
    time to local storage using the beforeunload event, 
    and clears the interval to stop incrementing the counter. 
    When the program is restarted, it initializes the counter 
    and last saved time from local storage again, and repeats 
    the process to include the missing seconds and continue 
    incrementing the counter.
   */

function reviewTimer() {
  counter++;

  if (counter > 59) {
    min += Math.floor(counter / 60); // Increment 'min' by the quotient of counter divided by 60
    counter %= 60; // Set 'counter' to the remainder of counter divided by 60
  }

  //set time warning colors
  if (min < 5) {
    counterEl.style.color = "#8BC34A";
  } else if (min < 7) {
    counterEl.style.color = "#ffeb3b";
    counterEl.style.animationDuration = "1s";
  } else if (min < 11) {
    counterEl.style.color = "#ff9800";
    counterEl.style.animationDuration = ".5s";
  } else if (min < 13) {
    counterEl.style.color = "#ff5722";
    counterEl.style.animationDuration = ".3s";
  } else if (min < 15) {
    counterEl.style.color = "#f44336";
    counterEl.style.animationDuration = ".2s";
  } else {
    counterEl.style.color = "red";
    counterEl.style.animationDuration = ".2s";
  }

  //time UI
  combinedTime = `${min > 9 ? "" : 0}${min}:${counter > 9 ? "" : 0}${counter}`;
  counterEl.textContent = combinedTime;
}

//start the time
const startTime = window.location.pathname.includes("generate_review")
  ? setInterval(reviewTimer, 1000)
  : null;

// Save the current counter and time to local storage when the program is closed
window.addEventListener("beforeunload", () => {
  localStorage.setItem("counter", counter);
  localStorage.setItem("minutes", min);
  localStorage.setItem("lastSavedTime", new Date().getTime());
  clearInterval(startTime);
});

//reset timer
timeResetIcon.addEventListener("click", () => {
  counterEl.style.color = "#8BC34A";
  counterEl.style.animationDuration = "1s";
  counter = 0;
  min = 0;
  localStorage.setItem("minutes", null);
  localStorage.setItem("counter", null);
  reviewTimer();
});
//=====================================================

// Increment review count when review is finished and save to local storage
reviewCompleteBtn?.addEventListener("click", () => {
  reviewCount++;
  localStorage.setItem("reviewCount", reviewCount);

  counterEl.style.color = "#8BC34A";
  counterEl.style.animationDuration = "1s";

  //reset review timer
  counter = 0;
  min = 0;
  localStorage.setItem("minutes", null);
  localStorage.setItem("counter", null);
  reviewTimer();
});

//Get review count from local storage when page loads
function getReviewCounts() {
  let prevCounts = localStorage.getItem("reviewCount");
  reviewCount = prevCounts ? prevCounts : 0;
  let counterContainerEl = document.createElement("div");
  counterContainerEl.className = "DBXFF-counter-container";
  let reviewCountEl = document.createElement("p");
  reviewCountEl.className = "DBXFF-review-count";
  reviewCountEl.textContent = `Reviews done: ${reviewCount}`;

  let reviewReset = document.createElement("img");
  reviewReset.src = chrome.runtime.getURL("images/reset.png");
  reviewReset.alt = "reviewReset";
  reviewReset.title = "Reset";
  reviewReset.addEventListener("click", () => {
    localStorage.setItem("reviewCount", 0);
    reviewCountEl.textContent = `Reviews done: 0`;
  });

  counterContainerEl.prepend(reviewReset);
  counterContainerEl.prepend(reviewCountEl);
  floatingElement.prepend(counterContainerEl);
}

function loadingIndicator() {}

function wait(time) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}
