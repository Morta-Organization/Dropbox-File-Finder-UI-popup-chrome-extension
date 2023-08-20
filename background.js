// //Find task on reviewer page
// // background.js
// chrome.commands.onCommand.addListener(function(command) {
//     if (command === 'search') {
//       chrome.tabs.executeScript({ code: 'window.find("Task : 2")' });
//     }
//   });

// chrome.tabs.onCreated.addListener(function(tab) {
//     // When a new tab is created, open the Find popup and search for "hello"
//     chrome.tabs.executeScript(tab.id, {
//       code: window.find("hello", false, true, true, false, true)
//     });
//   });


// Listen for messages from content scripts
// (message: any, sender: MessageSender, sendResponse: function) => boolean | undefined
chrome.runtime.onMessage.addListener((link, sender, sendResponse) => {
    // extract the URL from the message and open it in a new tab
    if (link.includes("www")) {
        chrome.tabs.create({ url: link, active: false });
    }
    
  });
  

