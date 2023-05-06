//Find task on reviewer page
// background.js
chrome.commands.onCommand.addListener(function(command) {
    if (command === 'search') {
      chrome.tabs.executeScript({ code: 'window.find("Task : 2")' });
    }
  });