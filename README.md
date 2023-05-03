# Dropbox File Finder 📝  
This app will find a student's task folder automatically and also allow you to download the task folder or open it in Dropbox with one click.

# Installation
~~~bash  
Download & unzip > in Chrome Extensions manager > "Load unpacked".
Do not delete or move the unzipped folder as Chrome will need this to run the extension correctly.
~~~
- **Important!**:
When running the extension for the first time and every 
**4 hours**, you will need to get a new "Dropbox access token". 
The app will let you know when you need to get a new 
token with a popup message. Just click ok. 
You will be redirected to a new page. 
Click the "Allow access" button,  then the "Hyperiondev" 
button. This will get a new token. You will then be 
redirected back to your main CoGrammar 
dashboard when this is done.

 
# Main Features 
- Finds all the files in Dropbox of the current task, in the student's root folder.
- You can open the task folder or download it.
- Starts a timer as soon as the review page is loaded. The time can also be reset at any time.
- Counts all completed reviews. The review counter can also be rest.
- Hide the app while still displaying the timer. - Adds a word counter label to each review text field.
- Review text is automatically stored in case of a page reloads, the browser tab is closed or CoGrammar fails to submit a completed review.
- A checkbox to store your current review text and re-insert it into your next review text fields.

## How to stay updated 🚀  
- Select the extension icon to open the popup, their you will find a link. 
The link will bring you back to this back to this page.
- In this repository, select the dropdown option on the "watch/unwatch" button in the top right corner. 
Here you customize how to receive notifications on this repo.

## Latest updates

#### v2.15.16
- Fixed an issue when the page would freez when retuning to it, this was related to the "visibilitychange" event.

#### v2.15.15
- On the review page, I added the word "Resub" to tasks that have been resubmitted. This helps reviewers quickly identify tasks that need to be reviewed again.
- To further improve the identification of resubmitted tasks on the dashboard, I changed the color of the "Resub" word to red.
- I also added color to all occurrences of the word "Capstone" on the dashboard to make it easier for reviewers to quickly identify capstone projects.
- I modified the dashboard table's code to ensure that tasks that are due first will always be at the top of the list based on their date and time. This should help reviewers prioritize their work more effectively.
- I also fixed an issue when the student name would overlap and display outside the popup element.

#### v2.11.13
- Added a green highlight around all the "Resub" words in the table.
- Added a bold tag around all the "Capstone" words in the table.
- Added the review counter to the dashboard, above the table.
- Fixed an issue where the tab would freeze after retuning to it after an hour -related to the counter.










