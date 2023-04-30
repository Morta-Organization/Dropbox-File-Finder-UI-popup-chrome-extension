//Adds word count and reset button to text fields in the 3 feedback forms


//initialize local storage for rememberReview
if (localStorage.getItem("rememberReview") == null) {
  localStorage.setItem("rememberReview", "false");
}

if (
  window.location.pathname.includes("generate_review") ||
  window.location.pathname.includes("generate_dfe_review")
) {

  // save any text in fields to local storage
  //load any text from local storage to respective fields
  let fields = document.querySelectorAll(".focus-field");
  generateFields()
  function generateFields() {
  fields.forEach((field) => {
      // field.value = localStorage.getItem("rememberReview")  || " ";
      // console.log('localStorage.getItem(rememberReview)', localStorage.getItem("rememberReview"))
    //!RESET - clear field button
    let resetFieldBtn = document.createElement("div");
    resetFieldBtn.className = "DBXFF-reset-field-button";
    resetFieldBtn.textContent = "clear";
    resetFieldBtn.addEventListener("click", () => {
      field.value = "";
      localStorage.setItem(field.id, "");
      wordCounter.innerHTML = "words: 0";
    });

    //! Word counter - also saves words to local storage
    let wordCounter = document.createElement("div");
    wordCounter.className = "DBXFF-word-counter";

    // Use the field's ID as the localStorage key
    let storedTextValue
    if (localStorage.getItem("rememberReview") == "true") {
      storedTextValue = localStorage.getItem("rememberReview") == "true" ? localStorage.getItem(field.id): " " 
    } else {
      storedTextValue = localStorage.getItem(field.id);
    }

    if (storedTextValue) {
      field.value = storedTextValue;
      let words = storedTextValue.trim().split(/\s+/);
      wordCounter.innerHTML = "words: " + words.length;
    } else {
        wordCounter.innerHTML = "words: 0";
    }

    // Save the text value to local storage when input event is triggered
    field.addEventListener("input", () => {
      // Split the string by any whitespace character using a regular expression
      let words = field.value.trim().split(/\s+/);
      wordCounter.innerHTML = "words: " + words.length;

      // Use the field's ID as the localStorage key
      localStorage.setItem(field.id, field.value);
    });


    // //! Load word into text field
    // let rememberWordsLabel = document.createElement("label");
    // rememberWordsLabel.className = "DBXFF-remember-words-label";
    // rememberWordsLabel.textContent = "Remember Review";
    // let rememberWords = document.createElement("input");
    // rememberWords.className = "DBXFF-remember-words";
    // rememberWords.type = "checkbox";
    // rememberWords.title = "If checked, text will persist after reloading the page or starting a new review.";
    // rememberWords.checked = localStorage.getItem(field.id) ? true : "";
    // rememberWords.addEventListener("change", () => {
    
    //   if (rememberWords.checked) {
    //     localStorage.getItem(field.id, field.value);
    //   } else {
    //     localStorage.setItem(field.id, "");
    //   }

    // });
    // rememberWordsLabel.appendChild(rememberWords);
    // field.parentNode.insertBefore(rememberWordsLabel, field);
    field.parentNode.insertBefore(resetFieldBtn, field);
    field.parentNode.insertBefore(wordCounter, field.previousSibling);
  });//loop end

  //Remember previous review input fields text
function rememberReviewText() {
  let inputMemoryEl = document.createElement("input");
  inputMemoryEl.type = "checkbox";
  inputMemoryEl.className = "DBXFF-checkbox";
  inputMemoryEl.checked = localStorage.getItem("rememberReview") == "true" ? true : false;
  inputMemoryEl.title = "Remember review text";
  inputMemoryEl.addEventListener("click", (e) => {

    if (inputMemoryEl.checked == true) {
      console.log('inputMemoryEl.checked', inputMemoryEl.checked)
      localStorage.setItem("rememberReview", e.target.checked);
    } else {
      console.log('inputMemoryEl.checked', inputMemoryEl.checked)
      localStorage.setItem("rememberReview", e.target.checked);
    }
  });
  floatingElement.prepend(inputMemoryEl);
  return localStorage.getItem("rememberReview")
}
rememberReviewText()
}
}
