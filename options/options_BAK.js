var parStore;

// Описание объекта "Сотрудник".
function Employee(fio, cntRequest, group, vacation)
{
  this.fio = fio; // Поле: ФИО сотрудника.
  this.group = group; // Поле: Группа.
  this.vacation = vacation; //Поле отпуск
}

function gotItem(item) {
  if (chrome.runtime.lastError) {
    console.log(chrome.runtime.lastError);
  } else {
    var noteKeys = Object.keys(item);
    if(noteKeys.length > 0) {
      //parStore = item;
    }
    else {
      //parStore = undefined;
    }
    /*
    for(i = 0; i < noteKeys.length; i++) {
      var curKey = noteKeys[i];
      var curValue = results[curKey];
      console.log("STORAGE(GET): OK");
      console.log(curKey);
    }
    */
  }
}

// callback to set() just checks for errors
function onSet() {
  if (chrome.runtime.lastError) {
    console.log(chrome.runtime.lastError);
  } else {
    console.log("STORAGE(SET): OK");
  }
}

function onCleared() {
  if (chrome.runtime.lastError) {
    console.log(chrome.runtime.lastError);
  } else {
    console.log("STORAGE(CLEARED)");
  }
}

document.getElementById("load").onclick = function(){
   chrome.storage.local.get("parStore", gotItem);
}

document.getElementById("reset").onclick = function(){
  chrome.storage.local.get("parStore", gotItem);
  if(!parStore)
  {
    parStore = new Array();
    var emp;
    emp = new Employee('Неизвестный Н.Н.', 'КР', true);
    parStore.push(emp);
    emp = new Employee('Обычный Ю.А.', 'УЯ', false);
    parStore.push(emp);
    console.log('Array Create');
    chrome.storage.local.set({parStore}, onSet);
  }
  else {
    console.log(parStore);
  }
}
