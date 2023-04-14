
let inputField1 = document.createElement("input");
let inputField2 = document.createElement("input");
let getFilesBtn = document.createElement("button");
let routeList = document.createElement("div")


//! Dropbox credentials

  let accessToken = hashParams.get("access_token"); //save token to variable
  const dropboxClientId = "lqp7zeiwcl5toer"; //hd: gsw6a2m0r2u44lt //me: lqp7zeiwcl5toer
  const clientSecret = "4jcwnu9bagjrc89"; //HD: nwpi7lk0yyp2v44 //me:4jcwnu9bagjrc89
  const redirectHomeUrl = "http://localhost:3000/testRoute/index.html"; // your redirect URI
  let dbx = new Dropbox.Dropbox({
    clientId: dropboxClientId,
    clientSecret: clientSecret,
    accessToken: accessToken,
  });

checkToken(dbx)

  //! Check token validity
function checkToken(dbx) {
    dbx
      .usersGetCurrentAccount()
      .then(function (response) {
        console.log("Access token is still valid");
        createUI();
      })
      .catch(function (error) {
        console.log("Access token has expired or is invalid");
        localStorage.setItem("access_token", null);
        auth2Flow();
      });
}

  //! Step 1.1: If needed, get access
  function auth2Flow() {
    const authUrl = "https://www.dropbox.com/oauth2/authorize" +
      "?response_type=token" +
      "&client_id=" + dropboxClientId +
      "&redirect_uri=" + encodeURIComponent(redirectHomeUrl);
  
    chrome.tabs.create({ url: authUrl }, function(tab) {
      // Listen for a message from the auth tab containing the access token
      chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if (request.token) {
          localStorage.setItem("access_token", request.token);
          dbx.accessToken = request.token;
          checkToken(dbx);
        }
      });
    });
  }

// Step 3: Handle redirect from Dropbox auth page
console.log('window.location.pathname', window.location.pathname)

if (window.location.pathname === "http://localhost:3000/testRoute/index.html") {
  const hashParams = new URLSearchParams(window.location.hash.substr(1));
  const accessToken = hashParams.get("access_token");
  if (accessToken) {
    // Send the access token back to the auth tab
    chrome.runtime.sendMessage({ token: accessToken });
    // Close this tab
    window.close();
  }
}





// Function to create the UI elements
function createUI() {
  // Create the floating element properties
  routeList.className = "query-results";
  routeList.textContent = "Route List";
  const inputContainer = document.createElement("div");
  inputContainer.className = "main-input-container";
  let getFilesBtnContainer = document.createElement("div");
  getFilesBtn.className = "button button1 getFIles";
  getFilesBtn.textContent = "Get Files";
  getFilesBtn.addEventListener("click", () => {

  })
  getFilesBtnContainer.appendChild(getFilesBtn);

  const floatingElement = document.createElement("div");
  const header = document.createElement("h1");
  header.innerText = "Floating Element";
  floatingElement.className = "box-layout slide-in-left";
  

  //create the toggle button
  let slideBtn = document.createElement("button");
    slideBtn.className="slide-btn"
    slideBtn.textContent = "Toggle Slide"
    slideBtn.addEventListener('click', () => {
     
        floatingElement.classList.toggle('slide-out-left');
        slideBtn.classList.toggle('toggleBtn')
      });

  inputField1.id = "myInputField1";
  inputField1.type = "text";
  inputField1.placeholder = "Student number";

  inputField2.id = "myInputField2";
  inputField2.type = "text";
  inputField2.placeholder = "Task name / PDF name";

  floatingElement.prepend(slideBtn);
  floatingElement.appendChild(header);
  inputContainer.appendChild(inputField1);
  inputContainer.appendChild(inputField2);
  
  inputContainer.appendChild(getFilesBtnContainer);
  inputContainer.appendChild(routeList);
  floatingElement.appendChild(inputContainer);


  document.body.appendChild(floatingElement);

  // Call function to get page values and update UI elements
  extractTaskName();
  extractStudentNumber()
}

//  Call createUI function to create the UI elements






//! Extracts the task name from the page elements
function extractTaskName() {
  // Find all h6 elements containing the word "Task"
  let h6Tags = [...document.querySelectorAll("h6")].filter((task) =>
    task.textContent.includes("Task")
  );

  // Loop through each h6 element and extract the text after "-"
  h6Tags.forEach((task) => {
    const text = task.textContent.trim();
    const index = text.indexOf("-") + 1;

    let result;

    // If the text contains "-", extract the text after "-" and check if it contains ":"
    if (index !== 0) {
      result = text.substring(index).trim();

      // If the result contains ":", extract the text after the last ":" instead
      if (result.includes(":")) {
        const lastIndex = result.lastIndexOf(":") + 1;
        result = result.substring(lastIndex).trim();
      }
    }

    // Log the result
    //console.log(result);
    inputField2.value = result;
  });
}

//! Extract the student number from the page elements
function extractStudentNumber() {
  // Select all h6 elements on the page
  const h6Element = [...document.querySelectorAll("h6")].filter((task) =>
  task.textContent.includes("Student number")
)
    const studentNumber = h6Element[0]?.textContent?.split(":")[1].trim();
    inputField1.value = studentNumber;
}


