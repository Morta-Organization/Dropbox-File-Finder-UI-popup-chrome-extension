/* Automatically open dropbox and search for the given student number */

if (
    window.location.pathname.includes("generate_review") ||
    window.location.pathname.includes("generate_dfe_review")
) {

    //Create the local storage boolean for the auto search option ====================================
    let autoSearch = localStorage.getItem("autoSearch") == "true" ? true : false;

    //Create the checkbox for the auto search option
    let autoSearchCheckbox = document.createElement("input");
    autoSearchCheckbox.type = "checkbox";
    autoSearchCheckbox.name = "autoSearch";
    autoSearchCheckbox.checked = autoSearch;
    autoSearchCheckbox.id = "autoSearch";
    autoSearchCheckbox.className = "DBXFF-autoSearch DBXFF-dialog-checkboxes";
    autoSearchCheckbox.addEventListener("click", (e) => {
        localStorage.setItem("autoSearch", e.target.checked);
    });

    //Create the label for the auto search option
    let autoSearchLabel = document.createElement("label");
    autoSearchLabel.className = "DBXFF-checkbox-label";
    autoSearchLabel.htmlFor = "autoSearch";
    autoSearchLabel.textContent = "Auto search student number on Dropbox in a new tab.(On page load)";

    //Create the container for the auto search option
    let autoSearchContainer = document.createElement("div");
    autoSearchContainer.className = "DBXFF-autoSearch-checkbox-container";
    autoSearchContainer.appendChild(autoSearchCheckbox);
    autoSearchContainer.appendChild(autoSearchLabel);

    //Add the auto search option to the dialog
    dialog.appendChild(autoSearchContainer);
    //====================================

    //Activate the auto search option if it is enabled
    if (autoSearch) {

        //Auto open dropbox and search for the student number
        setTimeout(() => {
            let link = `https://www.dropbox.com/search/work?path=%2F&query=${sharedStudentNum}&search_token=mUrM54J2SiALJes%2B%2Boc65k3O8pz4DOlJOX9WlhH8KKI%3D&typeahead_session_id=09702658948404806500012995044766`;

            // open link in background tab
            //window.open(link, "_blank");

            // Send a message to the background script to get the active tab ID
            /* 
                chrome.runtime.sendMessage(
                    extensionId?: string,
                    message: any,
                    options?: object,
                    callback?: function,
                )
            */
           //send link to background.js
            chrome.runtime.sendMessage(link);

        }, 500);
    }



}