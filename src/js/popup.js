import "../css/popup.scss";
import 'bootstrap';
import { showError } from "./popup/message_helpers";
import { finishLoading } from './popup/message_helpers';

import { renderTimeEntries, renderProjectTimerButtons } from "./popup/render_helper";
import { loadAllTimeEntries, loadDataForSelects, loadAllProjectsAndActivities, updateProjectTimer } from './popup/api_call_helper';

$('#create_task').click(function () {
  $('#project-buttons').toggle();
  var text = $('#create_task').text();
  $('#create_task').text(
    text == "Crear Tarea" ? "Cerrar" : "Crear Tarea");
});

$('#exampleModal').on('show.bs.modal', function (event) {
  let task = $(event.relatedTarget); // Button that triggered the modal
  let id = task.data('id');
  let project = task.data('project');
  let activity = task.data('activity');
  let description = task.data('description');
  let tags = task.data('tags');
  let modal = $(this)
  modal.find('.modal-body #description').val(description);
  modal.find('.modal-body #tags').val(tags);

  const loadForm = (projects, activities) => {
    let filterActivities = [];
    let selectInput = modal.find('.modal-body #project');
    let activityInput = modal.find('.modal-body #activity');
    projects.forEach((element, i) => {
      selectInput.append(new Option(element.name, element.id, false, (element.id === project)));
    });

    filterActivities = activities.filter((element, i) => {
      return element.project === parseInt(project, 10) || element.project === null
    });

    filterActivities.forEach(element => {
      activityInput.append(new Option(element.name, element.id, false, (element.id === activity)));
    });

    selectInput.change((event) => {
      let select = $(event.currentTarget);
      activityInput.empty();
      filterActivities = activities.filter((element, i) => {
        return element.project === parseInt(select.val(), 10) || element.project === null
      });
      
      filterActivities.forEach(element => {
        activityInput.append(new Option(element.name, element.id, false, (element.id === activity)));
      });
    });

    $('#save-edit').click((event) => {
      let modal = $('#exampleModal');
      let form = modal.find('.modal-body form').serialize();
      updateProjectTimer(id, form, finishUpdate, showError);
    })

    const finishUpdate = () => {
      modal.modal('hide');
      loadAllTimeEntries(renderTimeEntries, showError);
      finishLoading();
    }
  }

  loadDataForSelects(loadForm, showError);

})



// $(document).ready(function(){
//   $('#create_task').click(function(){
//     $('.time-entries-row').toggle();
//   });
// });

chrome.storage.sync.get([], function () {
  loadAllTimeEntries(renderTimeEntries, showError);
  loadAllProjectsAndActivities(renderProjectTimerButtons, showError);
});