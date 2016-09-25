
/*
If the user clicks on an element which has the class "ua-choice":
* fetch the element's textContent: for example, "IE 11"
* pass it into the background page's setUaString() function

allFrames: true

frameId: 0
*/

document.addEventListener("click", function(e) {
  if (!e.target.classList.contains("choice")) {
    return;
  }

/*
  chrome.tabs.executeScript({
    file: "../borderify.js",
  });
  */
  chrome.tabs.executeScript({
    file: "../hpsmparser.js",
    allFrames: true
  });
});
