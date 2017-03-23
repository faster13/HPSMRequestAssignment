/* HPSM Request Assignment
* Парсинг страницы HPSM в части раздела "ToDo (СервисСегодня)".
* Сканирует страницу на наличие записей с ФИО сотрудника и колличеством запросов, назначенных на него.
* Определяет сотрудником с наименьшим числом запросов и выводит результат в сводную таблицу этой же страницы.
*/

var resultEmp = new Map(); // Коллекция данных, получаемых в результате отбора наименее загруженных сотрудников.
var arrEmp = new Map(); // Коллекция, в которую загружаются сотрудники из очереди "ToDo".
var mapEmp = new Map(); // Коллекция-справочник. Содержит данные сотрудников отдела.
var findTagA = document.getElementsByClassName('x-grid-group-title-focus'); // Тег <a> в котором содержится текст
var rexpEmp = /(.+:\s)(\W+\s\W\.\s\W\.|NULL)(\s\(\d+\)\s\(|\s\()(\d+)(.+)/i; // Выражение, отбирает ФИО сотрудника и кол-во запросов, назначенных на него.
var findEmp = ''; // Массив, в который помещаются результаты rexpEmp.

// Описание объекта "Сотрудник".
function Employee(name, cntRequest)
{
this.name = name; // Поле: ФИО сотрудника.
this.cntRequest = cntRequest; // Поле: Колличество запросов.
this.group = 'NULL'; // Поле: Группа.
}

// Описание алгоритма при выполнении метода forEach для arrEmp.
// В этом блоке решается задача поиска сотрудника с наименьшим числом запросов.
function listMapEllements(value, key, map)
{
  var arrMultiEmp = []; // Массив, в который помещаются сотрудники с наименьшим кол-вом запросов для добавления в resultEmp.
  var stateFlg = ''; // Флаг, который устанавливается в значения '<,>,=,zero'
  if(resultEmp.has(key.group)) // Проверка существование записи по ключу Группа. Если запись отсутствует - создаем новую.
  {
  arrMultiEmp = resultEmp.get(key.group).slice(); // Копирование массива из resultEmp->Value в массив arrMultiEmp
                                                  // Выполняется проверка колличества запросов очередного пользователя из arrEmp c с пользователями в коллекции resultEmp.
  arrMultiEmp.forEach(function(item, i, arr){
    if(parseInt(value) > parseInt(item.cntRequest))  stateFlg = '>';
    if(parseInt(value) == parseInt(item.cntRequest)) stateFlg = '=';
    if(parseInt(value) < parseInt(item.cntRequest)) stateFlg = '<';
    if(parseInt(value) == 0) stateFlg = 'zero';
  });
  if(stateFlg == '<') // Если число запросов проверямого сотрудника меньше, чем у сотрудников в коллекции resultEmp,
                      // удаляем всех сотрудников из массива arrMultiEmp и добавляем этого сотрудника.
  {
    arrMultiEmp.length = 1;
    arrMultiEmp[0] = key;
    resultEmp.delete(key.group);
    resultEmp.set(key.group, arrMultiEmp);
    console.log('ADD("<"): ' + key.name + '::' + key.group + '::' + key.cntRequest);
  }
  else if(stateFlg == '=' || stateFlg == 'zero') // Если число запросов проверямого сотрудника равно числу запросов у уже отобранных сотрудников,
                                                 // или чило запросов равно нулю, он добавляется к списку сотрудников с наименьшим числом запросов (arrMultiEmp).
  {
    arrMultiEmp.push(key);
    resultEmp.delete(key.group);
    resultEmp.set(key.group, arrMultiEmp);
    console.log('ADD("="): ' + key.name + '::' + key.group + '::' + key.cntRequest);
  }
  else // Если проверяемый сотрудник имеет большее число запросов, никакие действия не выполняются.
  {
    console.log('SKIP(">"): ' + key.name + '::' + key.group + '::' + key.cntRequest);
  }
  }
  else
  {
    console.log('ADD(NEW): ' + key.name + '::' + key.group + '::' + key.cntRequest);
    arrMultiEmp.push(key);
    resultEmp.set(key.group, arrMultiEmp);
  }
}

function currentTime(){
  var cTime = new Date(Date.now());
  this.cYear = cTime.getYear();
  this.cMonth = (cTime.getMonth() < 10 ? '0' : '') + cTime.getMonth();
  this.cDay = (cTime.getDay() < 10 ? '0' : '') + cTime.getDay();
  this.cHours = (cTime.getHours() < 10 ? '0' : '') + cTime.getHours();
  this.cMinutes = (cTime.getMinutes() < 10 ? '0' : '') + cTime.getMinutes();
  this.cSeconds = (cTime.getSeconds() < 10 ? '0' : '') + cTime.getSeconds();
  this.cGetDate = this.cDay + "." + this.cMonth + "." + this.cYear;
  this.cGetTime = this.cHours + ":" + this.cMinutes + ":" + this.cSeconds;
  this.cFullDate = cTime;
}


// Отражает текущее время
if(document.getElementById('cwc_masthead_title_link')){
  var timeNow = new currentTime();
  document.getElementById('cwc_masthead_title_link').innerText = "Время обработки: " + timeNow.cGetTime;
}

// Блок, в котором выполняется поиск сотрудников.
// Тег с id='recordList' свидетельствует о том, что на странице есть список, который можно парсить.
if (document.getElementById('recordList'))
{
console.log('::BEGIN'); // Вывод в консоль используется для отладки.
// Создание справочника сотрудников Отдела.
mapEmp.set('Мушаков С. А.','ГР1');
mapEmp.set('Короедов М. О.','ГР3');
mapEmp.set('Буравчик В. Н.','ГР1');
mapEmp.set('Выдров Р. С.','ГР1');
mapEmp.set('Морячков А. И.','ГР4');
mapEmp.set('Ласточкин А. С.','ГР1');
mapEmp.set('Слонович М. Д.','ГР3');
mapEmp.set('Чекушкин А. В.','ГР3');
mapEmp.set('Черпачков С. С.','ГР4');
mapEmp.set('Галушкоедов  И. В.','ГР1');
mapEmp.set('Самолетов С. В.','ГР4');
mapEmp.set('Светофоров В. А.','ГР1');
mapEmp.set('Кучковский Д. М.','ГР2');
mapEmp.set('Шашлычков А. В.','ГР1');
mapEmp.set('Пирожков В. В.','ГР4');
mapEmp.set('Облачкин С. Е.','ГР2');
mapEmp.set('Лучиков Л. В.','ГР4');
mapEmp.set('Николаев Б.А.','ГР3');

// Если тег(и) <a> с записью о ФИО и колличестве запросов существует,
// выполняется парсинг таблицы.
if(findTagA.length > 0 && document.getElementsByClassName('tableOPKSZ').length == 0)
{
window.top.document.body.style.border = "5px solid green"; // Устанавливается граница топ-фрейма в зелёный цвет.
                                                           // Это означает, что таблица с запросами существует на странице.
// В блоке for выполняется перебор записей в таблице запросов.
for(var i = 0; i < findTagA.length; i++)
{
  findEmp = findTagA[i].innerHTML.match(rexpEmp); // К строке применяется регулярное выражение,
                                                  // результат которого группируется и помещается в массив.
  var nm = findEmp[2]; // ФИО сотрудника.
  var cnt = findEmp[4]; // Колличество запросов.
  var grp = mapEmp.get(findEmp[2]); // Группа сотрудника.
  var emp = new Employee(nm, cnt);
  emp.group = grp;
  // По данному условию, фильтруются сотрудники отсутствующие в справочнике mapEmp.
  if (emp.group != undefined)
  {
    arrEmp.set(emp, cnt);
    mapEmp.delete(nm);
  }
}

// Добавление сотрудников, которые отсутсвуют в таблице запросов HPSM.
// Колличество запросов у этих сотрудников = 0, соответственно.
// Необходимо учитывать то, что нулевое колличество запросов на сотруднике может означать
// либо его простой в работе, либо его отсутствие на рабочем месте.
mapEmp.forEach(function(value, key, map){
  var emp = new Employee(key, 0);
  emp.group = value;
  arrEmp.set(emp, 0);
});

if(arrEmp.size > 0)
{
  arrEmp.forEach(listMapEllements);
}
}
else if (findTagA.length == 0 && document.getElementsByClassName('tableOPKSZ').length == 0)
{
window.top.document.body.style.border = "5px solid red"; // Граница топ-фрейма устанавливается в красный цвет,
                                                         // если список запросов на странице не обнаружен.
}

// Блок, в котором выполняется вывод результата в окно браузера.
if(resultEmp.size > 0)
{
var empTable = document.getElementById('recordListGrid'); // Инициализация элемента с id='recordListGrid'.
                                                          // Требуется для очистки таблицы запросов HPSM.
var empTablePerrent = empTable.parentNode; // Инициализация родительского элемента таблицы запросов.
//parTableList.removeChild(childTableList);
var resultTag;
var tdTagArr;
var tbodyParrent;
var tbodyRows;
var tdCnt = 0;

console.log('::RESULT');

/* #########################    КОНСТРУКТОР  ################################ */
resultTag = document.createElement("style");
resultTag.type="text/css";
resultTag.innerText = "\
table { \
border-collapse: collapse; \
margin: auto; \
color: #333; \
width: 85%; \
} \
th {	\
border: 1px solid grey;  \
text-align: center;  \
color: #333;  \
padding: 4px	\
} \
td { \
border: 1px solid grey; \
width: 120.0pt; \
text-align: center; \
padding: 2px; \
font-size: 15.0pt; \
font-weight: 400; \
} \
.tableHeadOPKSZ { \
  font-size: 15.0pt; \
  background: #9ce7ff; \
} \
";

document.body.appendChild(resultTag);

empTable.remove(); // Удаление таблицы запросов.

resultTag = document.createElement("table");
resultTag.className = "tableOPKSZ";
resultTag.Id = "genTableOPKSZ";
empTablePerrent.appendChild(resultTag);
empTablePerrent = empTablePerrent.firstChild;
resultTag = document.createElement("tbody");
resultTag.className = "tbodyOPKSZ";
resultTag.Id = "genTbodyOPKSZ";
empTablePerrent.appendChild(resultTag);
tbodyParrent = empTablePerrent.firstChild;

resultEmp.forEach(function(value, key, map){
  if(!tbodyParrent.hasChildNodes())
  {
    resultTag = document.createElement("tr");
    resultTag.className = "tableOPKSZ";
    tbodyParrent.appendChild(resultTag);
  }
  resultTag = document.createElement("th");
  resultTag.className = "tableHeadOPKSZ";
  resultTag.innerText = key;
  tbodyParrent.firstChild.appendChild(resultTag);

  value.forEach(function(item, i, arr){
    //var iter = tdCnt;
    tbodyRows = tbodyParrent.childNodes;
    if(!tbodyRows[i+1])
    {
      resultTag = document.createElement("tr");
      resultTag.className = "tableOPKSZ";
      tbodyParrent.appendChild(resultTag);
      tbodyRows = tbodyParrent.childNodes;
      for(var c=0; c < map.size; c++)
      {
        resultTag = document.createElement("td");
        resultTag.className = "tableOPKSZ";
        if(c == tdCnt)
        {
          resultTag.innerText = item.name + '   [' + item.cntRequest + ']';
          if(item.cntRequest > 0) resultTag.style.background = "#fcff9c";
          else resultTag.style.background = "#68ec93";
        }
        tbodyRows[i+1].appendChild(resultTag);
      }
    }
    else
    {
      tdTagArr = tbodyRows[i+1].childNodes;
      if(item.cntRequest > 0) tdTagArr[tdCnt].style.background = "#fcff9c";
      else tdTagArr[tdCnt].style.background = "#68ec93";
      tdTagArr[tdCnt].innerText = item.name + '   [' + item.cntRequest + ']';
    }
    console.log(item.name + "::" + item.cntRequest + "::" + item.group);
  });
  tdCnt++;
});
}
console.log('::END');
}
