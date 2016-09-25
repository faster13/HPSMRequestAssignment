//console.log(window.BrowserApp.selectedTab.currentURI);
// Блок в котором выполняется поиск кнопки "Обновить" и вызов события "Click".
var parentBtn = document.getElementsByClassName('x-toolbar-cell'); // В тегах класса 'x-toolbar-cell', как правило размещаются активные элементы.
if(parentBtn.length > 0) // Если тег обнаружен, выполняем поиск кнопки "Обновить".
{
  for(var item of parentBtn)
  {
    if(item.innerHTML.includes('Обновить')){
      var mainBtn = item.firstChild;
    }
  }
mainBtn.click(); // Запуск события "Click", что приводит к запросу данных с сервера HPSM и построению обновленной таблицы в "ToDo"
}
