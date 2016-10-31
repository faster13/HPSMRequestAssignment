// Описание объекта "Сотрудник"
console.log("OPTIONS(INIT): START");
var gItemBuffer;

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
      console.log('STORAGE(GET): NOT EXIST');
      var Employees = new Array(); // Массив значений параметра "Список сотрудников"
      var emp;                    // переменная для хранения объектов "Сотрудник"
      emp = new Employee('Неизвестный Н.Н.', 'КР', true);
      Employees.push(emp);
      emp = new Employee('Обычный Ю.А.', 'УЯ', false);
      Employees.push(emp);
      chrome.storage.local.set({Employees}, onSet);
}

function draftTable(sItem, sCode){
  var mainTag;
  var constructTag;
  this.sItem = sItem;
  this.sCode = sCode;

  if(sCode == 'emp' && document.getElementById("employeesTable")){
    chrome.storage.local.get((sItem),(res) => {
      if (res == 'undefined') {
        console.log("TABLE(CHK): Параметр не определён!");
        return;
      }
      if (res.length == 0) {
        console.log("TABLE(CHK): Для параметра " + res + " не задано значение");
        return;
      }

      mainTag = document.getElementById("employeesTable");
      constructTag = document.createElement("tbody");
      mainTag.appendChild(constructTag);
      mainTag = mainTag.firstChild;

      console.log(res.objectName);
    });
  }
}

// Функция проверки наличия параметра "Список сотрудников" в локальном хранилище
function checkAndSetParams(param){
  chrome.storage.local.get((param),(res) => {
    if(chrome.runtime.lastError){
      console.log('STORAGE(CHK): FAILURE');
      console.log(chrome.runtime.lastError);
    }
    else if (res){
      console.log('STORAGE(CHK): Параметр ' + '"' + param + '"' + ' уже добавлен');
    }
    else {
      console.log('STORAGE(CHK): Параметр ' + param + ' не найден');
      console.log(param);
      switch(res){
        case("Employees"):
          restoreOptions();
          console.log("STORAGE(CHK): Параметр " + param + " сохранен");
          break;
        default:
          console.log("STORAGE(CHK): Параметр " + res[param] + " не объявлен в списке допустимых параметров");
      }
    }
  });
}

checkAndSetParams("Employees");


if (document.getElementById("reset")) {
  document.getElementById("reset").onclick = function(){
    //checkAndSetParams("Employees");
    if (document.getElementById("employeesTable")) {
      draftTable('Employees', 'emp');
    }
  }

  document.getElementById("load").onclick = function(){
    //chrome.storage.local.set({"JS": ["GOOD LANGUAGE", "VERY POWERFULL"]}, onSet);
  }
}
