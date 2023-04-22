// Function to check if the current tab is active
function isTabActive(tab) {
    return tab.active;
  }
  
  // Function to log a message when the tab is active
  function logMessage(tab) {
    if (isTabActive(tab)) {
      console.log('Current tab is active:', tab);
    } else {
      console.log('Current tab is not active:', tab);
    }
  }
  
  // Get the current tab
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    // The query returns an array of tabs, but we can safely assume that the first tab is the current one
    const currentTab = tabs[0];
    // Log the message
    logMessage(currentTab);
  });