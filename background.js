var DELAY_RELOAD = 0.20;
var PERIOD_RELOAD = 0.8;
var DELAY_PARSE = 0.1;
var PERIOD_PARSE = 0.1;

var hpsmurl = "10.112.252.168"; // Адрес поиска


function handleClick() {
  chrome.runtime.openOptionsPage();
}

chrome.browserAction.onClicked.addListener(handleClick);

chrome.alarms.create('reload-alarm', {
  delayInMinutes: DELAY_RELOAD,
  periodInMinutes: PERIOD_RELOAD
});

chrome.alarms.create('period-alarm', {
  delayInMinutes: DELAY_PARSE,
  periodInMinutes: PERIOD_PARSE
});


function handleAlarm(alarmInfo) {
  if(alarmInfo.name == 'reload-alarm')
  {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      console.log("ALARM(ON): " + alarmInfo.name);
      console.log("TAB_ID(ACT): " + tabs[0].id);
      console.log("TAB_ID(URL): " + tabs[0].url);
      if(tabs[0].url.indexOf("10.112.252.168") != -1){
        chrome.tabs.executeScript(tabs[0].id,{
          file: 'recivedata.js'
        });
      }
  });
  } else if(alarmInfo.name == 'period-alarm') {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      console.log("ALARM(ON): " + alarmInfo.name);
      console.log("TAB_ID(ACT): " + tabs[0].id);
      console.log("TAB_ID(URL): " + tabs[0].url);
      if(tabs[0].url.indexOf("10.112.252.168") != -1){
        chrome.tabs.executeScript(tabs[0].id,{
          file: 'hpsmparser.js',
          allFrames: true
        });
      }
    });
  }
}

chrome.alarms.onAlarm.addListener(handleAlarm);
