//options button
let dialog = document.createElement("dialog");
dialog.className = "DBXFF-options-dialog";

const heading = document.createElement("h1");
heading.innerHTML = "Options";
dialog.appendChild(heading);

// Add a checkbox to close the dialog on escape
let closeButton = document.createElement("img");
closeButton.src = chrome.runtime.getURL("images/closeModal.svg");
closeButton.className = "DBXFF-close-button";
closeButton.innerHTML = "Close";
closeButton.addEventListener("click", () => {
    dialog.close();
})
dialog.appendChild(closeButton);

// Open the dialog
let openButton = document.createElement("img");
openButton.src = chrome.runtime.getURL("images/gear1.svg");
openButton.innerHTML = "Open";
openButton.className = "DBXFF-options-button";
openButton.addEventListener("click", () => {
    dialog.showModal();
});

floatingElement.appendChild(openButton);
floatingElement.appendChild(dialog);