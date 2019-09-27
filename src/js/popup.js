import "../css/popup.scss";
import 'bootstrap';
import { showError } from "./popup/message_helpers";
import { renderTimeEntries, renderProjectTimerButtons } from "./popup/render_helper";
import { loadAllTimeEntries, loadAllProjectsAndActivities } from './popup/api_call_helper';

$('#create_task').click(function () {
  $('#form_create_task').attr("style","");
});

chrome.storage.sync.get([], function() {
  loadAllTimeEntries(renderTimeEntries, showError);
  loadAllProjectsAndActivities(renderProjectTimerButtons, showError);
});