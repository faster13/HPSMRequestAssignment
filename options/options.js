function Employee(fio, cntRequest, group, vacation)
{
  this.fio = fio; // Поле: ФИО сотрудника.
  this.group = group; // Поле: Группа.
  this.vacation = vacation; //Поле отпуск
}

// callback to set() just checks for errors
function onSet() {
  if (chrome.runtime.lastError) {
    console.log("STORAGE(SET): FAILURE");
    console.log(chrome.runtime.lastError);
  } else {
    console.log("STORAGE(SET): SUCCESS");
  }
}

// callback to clear() just checks for errors
function onCleared() {
  if (chrome.runtime.lastError) {
    console.log(chrome.runtime.lastError);
    console.log("STORAGE(CLEAR): FAILURE");
  } else {
    console.log("STORAGE(CLEAR): SUCCESS");
  }
}

function restoreOptions() {
  chrome.storage.local.get('parStore', (res) => {
    if(res.parStore)
    {
      console.log('STORAGE(GET): SUCESS');
      console.log(res);
    }
    else {
      console.log('STORAGE(GET): NOT EXIST');
      var parStore = new Array();
      var emp;
      emp = new Employee('Неизвестный Н.Н.', 'КР', true);
      parStore.push(emp);
      emp = new Employee('Обычный Ю.А.', 'УЯ', false);
      parStore.push(emp);
      chrome.storage.local.set({parStore}, onSet);
    }
  });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById("reset").onclick = function(){
  chrome.storage.local.clear(onCleared);
}
