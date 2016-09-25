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

// Блок, в котором выполняется поиск сотрудников.
// Тег с id='recordList' свидетельствует о том, что на странице есть список, который можно парсить.
if (document.getElementById('recordList'))
{
console.log('::BEGIN'); // Вывод в консоль используется для отладки.
// Создание справочника сотрудников ОПКСЗ.
mapEmp.set('Беликов С. А.','КР');
mapEmp.set('Васильева М. О.','УЯ');
mapEmp.set('Олейник В. Н.','РК');
mapEmp.set('Сурков Р. С.','РЦ');
mapEmp.set('Вдовин А. И.','РК');
mapEmp.set('Горбачев А. С.','РЦ');
mapEmp.set('Желтобрюхова М. Д.','КР');
mapEmp.set('Жигалев А. В.','УЯ');
mapEmp.set('Карбановский С. С.','РЦ');
mapEmp.set('Мороз  И. В.','КР');
mapEmp.set('Рубцова С. В.','РК');
mapEmp.set('Соколов В. А.','УЯ');
mapEmp.set('Тюпа Д. М.','КР');
mapEmp.set('Шевцов А. В.','КР');
mapEmp.set('Медведев В. В.','КР');
mapEmp.set('Никонов С. Е.','РК');
mapEmp.set('Панченко Л. В.','УЯ');
mapEmp.set('Строителев А. Л.','КР');

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
