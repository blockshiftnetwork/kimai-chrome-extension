import "../css/popup.scss";
import 'bootstrap';
import { showError } from "./popup/message_helpers";
import { renderTimeEntries, renderProjectTimerButtons } from "./popup/render_helper";
import { loadAllTimeEntries, loadAllProjectsAndActivities } from './popup/api_call_helper';

$('#create_task').click(function () {
  $('#project-buttons').toggle();
  var text = $('#create_task').text();
    $('#create_task').text(
        text == "Crear Tarea" ? "Cerrar" : "Crear Tarea");
});


// $(document).ready(function(){
//   $('#create_task').click(function(){
//     $('.time-entries-row').toggle();
//   });
// });

chrome.storage.sync.get([], function() {
  loadAllTimeEntries(renderTimeEntries, showError);
  loadAllProjectsAndActivities(renderProjectTimerButtons, showError);
});