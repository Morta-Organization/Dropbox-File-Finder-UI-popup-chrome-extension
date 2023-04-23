//Adds word count and reset button to text fields in the 3 feedback forms

if (
  window.location.pathname.includes("generate_review") ||
  window.location.pathname.includes("generate_dfe_review")
) {

  // save any text in fields to local storage
  //load any text from local storage to respective fields
  let fields = document.querySelectorAll(".focus-field");
  fields.forEach((field) => {
    //!RESET - clear field button
    let resetFieldBtn = document.createElement("div");
    resetFieldBtn.className = "DBXFF-reset-field-button";
    resetFieldBtn.textContent = "clear";
    resetFieldBtn.addEventListener("click", () => {
      field.value = "";
      localStorage.setItem(field.id, "");

      let words = field.value.trim().split(/\s+/);
      wordCounter.innerHTML = "words: 0";
    });

    // create word counter
    let wordCounter = document.createElement("div");
    wordCounter.className = "DBXFF-word-counter";

    //! Restore - retrieve the text value from local storage and set it to the field value
    let storedTextValue = localStorage.getItem(field.id); // Use the field's ID as the localStorage key
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

    field.parentNode.insertBefore(resetFieldBtn, field);
    field.parentNode.insertBefore(wordCounter, field.previousSibling);
  });
}
