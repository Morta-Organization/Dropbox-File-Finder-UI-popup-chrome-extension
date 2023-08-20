let floatingElement = document.createElement("div");
let reviewCompleteBtn = document.querySelector("#submit-review-btn");
let timerContainer = document.createElement("div");
timerContainer.className = "DBXFF-timer-container";

//Create the reset timer button
let timeResetIcon = document.createElement("img");
timeResetIcon.src = chrome.runtime.getURL("images/reset.png");
timeResetIcon.alt = "reset timer";
timeResetIcon.title = "Reset timer";
timerContainer.appendChild(timeResetIcon);
floatingElement.prepend(timerContainer);




// Create the counter element
let counterEl = document.createElement("p");
counterEl.className = "DBXFF-timer";
counterEl.classList.add("pulsate-fwd");
timerContainer.prepend(counterEl);




// Create the review details element UI
let reviewDetailsEl = document.createElement("div");
reviewDetailsEl.className = "DBXFF-review-details";
// Create the student name element
let studentNameEl = document.createElement("h4");
let studentNumberContainerEl = document.createElement("div");
studentNumberContainerEl.className = "DBXFF-student-number-container";

// Create the open Dropbox link button
let lookUpStudentBtn = document.createElement("img");
lookUpStudentBtn.src = chrome.runtime.getURL("images/externalLink.png"); // Set the image source
lookUpStudentBtn.title = "Look up number in dropbox";

let studentNumberEl = document.createElement("h4");
let taskNameEl = document.createElement("div");


// Initialize the counter and last saved time from local storage, or use default values
let counter;
let min;
let lastSavedTime;
let foundTaskName;
let StudentName = "";
let sharedStudentNum = "";
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

const dropboxClientId = 'gsw6a2m0r2u44lt';
const clientSecret = 'nwpi7lk0yyp2v44';

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

//Don't check token on review page
if ( window.location.pathname.includes("generate_review") || 
window.location.pathname.includes("generate_dfe_review")) {
  createUI();
}

//! 1 Check token validity
async function checkToken(dbx) {
  console.log(`%c Checking token`, "color: #f078c0");
  console.log("removeSpinner", removeSpinner);
  // Show loading indicator or disable user interactions
  // while waiting for the method to complete
  //loadingIndicator("show");

  try {
    await dbx.usersGetCurrentAccount();
    console.log(`%c Access token is still valid`, "color: #7cb518");
    alert("Access token is still valid ✔");
    //window.location.pathname.includes("generate_review") && createUI();

    // Hide loading indicator or enable user interactions
    // loadingIndicator("hide");
  } catch (error) {
    console.log("removeSpinner", removeSpinner);
    if (removeSpinner) {
      routeList.innerHTML = "Token Expired";
      removeSpinner = false;
    }
    let getToken = confirm(
      'Tokens only last 4 hour. This token might have expired ❌. Proceeding to "Auth" to get a new one.'
    );
    console.log(`%c Access token expired or is invalid`, "color: #f94144");
    if (getToken) {
      localStorage.setItem("access_token", null);
      auth2Flow();
    }

    // Hide loading indicator or enable user interactions
    //loadingIndicator("hide");
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

//! Step 2:  Create Floating UI popup
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
  sharedStudentNum = studentNumber;
  // open dropbox and search for the student number
  lookUpStudentBtn.addEventListener("click", () => {
    let link = `https://www.dropbox.com/search/work?path=%2F&query=${studentNumber}&search_token=mUrM54J2SiALJes%2B%2Boc65k3O8pz4DOlJOX9WlhH8KKI%3D&typeahead_session_id=09702658948404806500012995044766`;
    window.open(link, "_blank");
  });
  console.log(`%c Extracting Task Name`, "color: red");

  // Only extract the h6 elements that contain the word "Task"
  let h6Tags = [...document.querySelectorAll("h6")].filter((task) =>
    task.textContent.includes("Task")
  );

  //extract the "Task #digit" from after the firs ":" = Task: Task 7 - Database Interaction
  // Loop through each list item
  h6Tags.forEach((item) => {

    // Create a regular expression to match "Task" followed by a space, one or more digits, and a hyphen "-"
    let regex = /Task \d+/gi;


    // Test if the search word is found in the list item's text content
    if (regex.test(item.textContent)) {

      // If the search word is found, replace it with a highlighted version
      taskNum = item.textContent.match(regex)[0].split(" ")[1];

      localStorage.setItem("taskNumber", `Task ${taskNum}`);//save task number to local storage


    }
  });




  // Loop through each h6 element and extract the text after "-" = Task: Task 7 - Database Interaction
  h6Tags.forEach((task) => {

    const text = task?.textContent?.trim();
    const index = text.lastIndexOf("-") + 1;

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
    filesSearch(studentNumber, foundTaskName, taskNum);
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
  // Filter the selected h6 elements to only include those that contain the text "Student:"
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
  let query = taskName;

  //update "build your brand" strings
  //! BYB tasks files are sometimes written as byb 04 or byb IV. But on the review page it is always written with Roman numerals
  //THis function will only update task name if the dropbox files contains number instead of roman numerals.
  let pattern = /build your brand/i;
  if (query.match(pattern) && /(01|02|03|04|05)/.test(query)) {
    query = replaceRomanNumeralsWithNumbers(query).toLowerCase();
  
  }

  console.log('query', query)

  console.log(`%c Searching for files ${inc}`, "color: #5390d9");
  let root = studentNumber;
  let retry = inc;

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

      console.log(`%c  making request: ${inc}`, "color: orange");
      inc++; //after 1rst request look for a 2nd folder
      let results = response.result.matches;

      //if results are 0 and we did 3 searches already? stop
      if (inc >= 4) {
        highlightTaskName(query);

        return;
      } else {
        if (!foundFiles) {
          //foundFiles = true;
          console.log(`%c results found: ${results.length}`, "color: #2196f3");
       
          //Creates a list of all the results results
          //Aldo build the dive that contains the download button and the link to the folder
          results.forEach((item, i) => {
            let taskNumber = item.metadata.metadata.path_display
            console.log('taskNum', taskNum)
            // Only display the results that contain the task number
            if (taskNumber.includes(taskNum)) {
              if (taskNum < 10) {
                taskNum = "T0" + taskNum[taskNum.length - 1];
               
               }

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
                e.stopPropagation(); //prevent the route from being selected
                dlIcon.classList.add("rotate-center");
                dlIcon.src = chrome.runtime.getURL("images/loader.png");
                //! Download selected Folder or file
                downloadFolder(item.metadata.metadata, dlIcon); //folder
              });

              dlIconContainer.appendChild(dlIcon);
              btnAndListContainer.appendChild(dlIconContainer);
              btnAndListContainer.appendChild(linkIcon);
              btnAndListContainer.appendChild(foundRes);
              routeList.appendChild(btnAndListContainer);

            }

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

        routeList.innerHTML = `
        <p>Either the token has expired. A popup will appear. (If not - Refresh Browser)</p>
        <br>
        <p>Or the Task Name could no be found inside student folders</p>
        <br>
        <p>Or CoGrammar API is offline</p>
        <br>
        <p>Or you have an internet connection issue</p>
        <br>
        <p>Try looking up the student number in Dropbox</p>
        `;
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
      alert(
        "Error downloading file. Download folder could be containing more than 100 files"
      );
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

//Extracts the words that matches the task name and only highlight those words.
function highlightTaskName(taskName) {

  // Get all the  elements that contains the entire path name
  const parentDivs = document.querySelectorAll(".DBXFF-foundRes");

  // Loop through each parent div
  parentDivs.forEach((div) => {


    // Get the text content of the child div
    let itemText = div.textContent?.toLowerCase()?.trim();

    //split the words into an array
    let wordsToHighlight = taskName.split(" ");

    //FInd the task number, and highlight it yellow
    let numbersToHighlight = taskNum.split(" ");

    //highlight the task number
    numbersToHighlight.forEach((num) => {
      if (num.length > 0) {
        if (itemText.includes(num.toLowerCase())) {
          let found = div.innerHTML.replace(
            new RegExp(num, "gi"),
            `<b style="font-weight: 100; color: #FFC107">${num}</b>`
          );
          div.innerHTML = found;
        }
      }
    });



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
//start the time on review
let startTimer;
if (
  window.location.pathname.includes("generate_review") ||
  window.location.pathname.includes("generate_dfe_review")
) {
  loadTimer();
  startTimer = setInterval(() => reviewTimer(), 1000);
}

async function loadTimer() {
  /*

   When the program is closed, it saves the current counter and
    time to local storage using the beforeunload event, 
    and clears the interval to stop incrementing the counter. 
    When the program is restarted, it initializes the counter 
    and last saved time from local storage again, and repeats 
    the process to include the missing seconds and continue 
    incrementing the counter.
   */

  if (window.location.pathname.includes("generate_review")) {
    // Start the interval when the page is visible
    async function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        clearInterval(startTimer);
        startTimer = setInterval(() => reviewTimer(), 1000);
        await loadTimer();
        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange
        ); //remove event listener to avoid multiple executions
      } else {
        clearInterval(startTimer);
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
  } else {
    clearInterval(startTimer);
  }


  // Initialize the counter and last saved time from local storage, or use default values
  counter = parseInt(localStorage.getItem("counter")) || 0;
  min = parseInt(localStorage.getItem("minutes")) || 0;
  lastSavedTime =
    parseInt(localStorage.getItem("lastSavedTime")) || new Date().getTime();

  // Calculate the elapsed time since the last saved time and add it to the counter
  counter += Math.floor((new Date().getTime() - lastSavedTime) / 1000);

  // Save the current counter and time to local storage when the program is closed

  window.addEventListener("beforeunload", async () => {
    saveTimeValues();
    clearInterval(startTimer);
  });



  //From the "Review Submit" page, reset timer when returning to dashboard
  let myWord = "Return to dashboard";
  let aTags = document.querySelectorAll("a");
  aTags?.forEach((item) => {
    if (item?.textContent.includes(myWord)) {
      item.addEventListener("click", () => {
        counter = 0;
        min = 0;
        localStorage.setItem("minutes", null);
        localStorage.setItem("counter", null);
        localStorage.setItem("lastSavedTime", null);
        clearInterval(startTimer);
        if (localStorage.getItem("rememberReview") == "false") {
          localStorage.setItem("id_improve_comments", "");
          localStorage.setItem("id_positive_comments", "");
          localStorage.setItem("id_overall_comments", "");
        }
      });
    }
  });
}

function reviewTimer() {
  counter++;

  // Check if the value of 'counter' has exceeded 59 seconds
  if (counter > 59) {
    // Calculate the number of full minutes that have elapsed
    // and add it to the 'min' variable
    // The Math.floor() method is used to round down to the nearest integer
    // e.g. if 'counter' is 75 seconds, the quotient of counter / 60 is 1.25,
    // but we only want to add 1 full minute to 'min'
    min += Math.floor(counter / 60);

    // Calculate the remaining seconds after removing the full minutes
    // and set the value of 'counter' to this value
    // The modulus operator (%) returns the remainder of the division
    // e.g. if 'counter' is 75 seconds, the remainder of counter % 60 is 15,
    // which represents the number of seconds that have elapsed after 1 full minute
    counter %= 60;
  }

  //set time warning colors
  if (min < 5) {
    counterEl.style.color = "#8BC34A";
    counterEl.style.animationDuration = "10s";
  } else if (min < 7) {
    counterEl.style.color = "#ffeb3b";
    counterEl.style.animationDuration = "5s";
  } else if (min < 11) {
    counterEl.style.color = "#ff9800";
    counterEl.style.animationDuration = "2s";
  } else if (min < 13) {
    counterEl.style.color = "#ff5722";
    counterEl.style.animationDuration = "1s";
  } else if (min < 15) {
    counterEl.style.color = "#f44336";
    counterEl.style.animationDuration = ".2s";
  } else {
    counterEl.style.color = "#f44336";
    counterEl.style.animationDuration = ".2s";
  }

  //Combine minutes and seconds into one string
  combinedTime = `${min > 9 ? "" : 0}${min}:${counter > 9 ? "" : 0}${counter}`;

  //Stop timer at 60 minutes
  if (min > 60) {
    counterEl.style.color = "#f44336";
    counterEl.style.animationDuration = ".2s ";
    combinedTime = "59:00";
    clearInterval(startTimer);
  }

  counterEl.textContent = combinedTime;

  // Save the current counter and time to local storage every second
  saveTimeValues();
}

//Reset timer
timeResetIcon.addEventListener("click", async () => {
  console.log(`%c timer reset`, 'color: #ffba08')
  clearInterval(startTimer);

  counter = 0;
  min = 0;
  localStorage.setItem("minutes", null);
  localStorage.setItem("counter", null);
  combinedTime = 0;


  startTimer = setInterval(() => reviewTimer(), 1000);
  await loadTimer();

});

// Save the current counter and time to local storage
function saveTimeValues() {
  localStorage.setItem("counter", counter);
  localStorage.setItem("minutes", min);
  localStorage.setItem("lastSavedTime", new Date().getTime());
}

//===================================================== review count

// Increment review count when review is finished and save to local storage
reviewCompleteBtn?.addEventListener("click", () => {
  reviewCount++;
  localStorage.setItem("reviewCount", reviewCount);

  counterEl.style.color = "#8BC34A";
  counterEl.style.animationDuration = "3s";


});

// Get review count from local storage and display it
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

  //Reset review count
  reviewReset.addEventListener("click", () => {
    let sure = confirm("Are you sure you want to reset the review count?");
    if (sure) {
      reviewCount = 0;
      localStorage.setItem("reviewCount", 0);
      reviewCountEl.textContent = `Reviews done: 0`;
    }
  });

  counterContainerEl.prepend(reviewReset);
  counterContainerEl.prepend(reviewCountEl);
  floatingElement.prepend(counterContainerEl);
}


//Build your brand tasks string manipulation
// Define a function to replace Roman numerals with corresponding numbers
function replaceRomanNumeralsWithNumbers(inputString) {

  // Define a mapping of Roman numerals to numbers
  const romanToNumberMap = {
    I: "01",
    II: "02",
    III: "03",
    IV: "04",
    V: "05",
    VI: "06",
    // Add more Roman numerals and their corresponding numbers as needed
  };
  //console.log('romanToNumberMap', romanToNumberMap.I)

  // Define a regular expression to match Roman numerals
  const romanNumeralRegex = /\b(I|II|III|IV|V|VI)\b/g;

  // Use the replace() method with a callback function to replace Roman numerals with numbers
  return inputString.replace(romanNumeralRegex, (match, romanNumeral) => {
    return romanToNumberMap[romanNumeral] || match;
  });
}


function highlightTaskNumber() {
  // Loop through each list item
  listItems.forEach((item) => {

    // Create a regular expression to match "Task" followed by a space, one or more digits, and a hyphen "-"
    let regex = /Task \d+/gi;

    // Test if the search word is found in the list item's text content
    if (regex.test(item.textContent)) {

      // If the search word is found, replace it with a highlighted version
      let found = item.innerHTML.replace(regex, `<b class="highlight">$&</b>`);

      // Replace the original list item HTML with the highlighted version
      item.innerHTML = found;
    }
  });
}