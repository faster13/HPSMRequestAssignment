var DELAY_RELOAD = 0.33;
//var PERIOD_RELOAD = 0.8;
var DELAY_PARSE = 0.16;
//var PERIOD_PARSE = 0.1;
var DELAY_CHK_STORAGE = 0.14;

var hpsmurl = "10.112.252.168"; // Адрес поиска


chrome.alarms.create('parse-alarm', {
  delayInMinutes: DELAY_PARSE,
//  periodInMinutes: PERIOD_PARSE
});

chrome.alarms.create('storage-alarm', {
  delayInMinutes: DELAY_CHK_STORAGE
});

function handleAlarm(alarmInfo) {
  if(alarmInfo.name == 'reload-alarm')
  {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      console.log("ALARM(ON): " + alarmInfo.name);
      console.log("  TAB_ID(ACT): " + tabs[0].id);
      console.log("  TAB_ID(URL): " + tabs[0].url);
      if(tabs[0].url.indexOf("10.112.252.168") != -1){
        chrome.tabs.executeScript(tabs[0].id,{
          file: 'recivedata.js',
          allFrames: true
        });
      }
      chrome.alarms.create('parse-alarm', {
        delayInMinutes: DELAY_PARSE,
      //  periodInMinutes: PERIOD_PARSE
      });
  });
} else if(alarmInfo.name == 'parse-alarm') {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      console.log("ALARM(ON): " + alarmInfo.name);
      console.log("  TAB_ID(ACT): " + tabs[0].id);
      console.log("  TAB_ID(URL): " + tabs[0].url);
      if(tabs[0].url.indexOf("10.112.252.168") != -1){
        chrome.tabs.executeScript(tabs[0].id,{
          file: 'hpsmparser.js',
          allFrames: true
        });
      }
      chrome.alarms.create('reload-alarm', {
        delayInMinutes: DELAY_RELOAD,
      //  periodInMinutes: PERIOD_RELOAD
      });
    });
  } else if (alarmInfo.name == 'storage-alarm') {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        console.log("ALARM(ON): " + alarmInfo.name);
        console.log("  TAB_ID(ACT): " + tabs[0].id);
        console.log("  TAB_ID(URL): " + tabs[0].url);
        chrome.tabs.executeScript(tabs[0].id, {
          file: '/options/options.js'
        });
      });
  }
}

chrome.alarms.onAlarm.addListener(handleAlarm);
