import moment from 'moment';
import { finishLoading } from './message_helpers';
import { projectStartButtonOnClick, activityStopBtnOnClick, activityRestartBtnOnClick } from './button_action_helper';
import ongoingIcon from '../../img/kimai-icon-ongoing.png';
import normalIcon from '../../img/kimai-icon.png';


const renderTimeEntries = timeEntries => {
  let timeEntriesHTML = "<div class='day-group'>";
  let totalTimeToDate = 0;
  let isTimerRunning = false;

  timeEntries.forEach( (entry, index) => {
    const startTime = moment(entry.begin);
    const endTime = entry.end ? moment(entry.end) : moment();
    const isOngoing = entry.end === null;
    const duration = moment.duration(endTime.diff(startTime));

    timeEntriesHTML +=
    `
      <li class="list-group-item ${isOngoing ? 'list-group-item-primary' : ''}">

        <div class="time-entry-text">
          ${
            isOngoing ?
              `<span class="start">${startTime.format("h:mm a")}</span>`
            :
              `${duration.asHours().toFixed(2)} h`
          }
          @ <b><span class="project text-truncate">${entry.projectName}</span></b>
        </div>
        ${ isOngoing ? 
          `<button class="btn btn-outline-secondary btn-sm activity-stop-button w-25" name="${entry.id}">Stop</button>`
          : `<button class="btn btn-outline-secondary btn-sm activity-restart-button w-25" name="${entry.id}">Restart</button>` }
      </li>
    `;

    // Daily hours summary
    const nextEntry = timeEntries[index + 1];
    totalTimeToDate += duration.asHours();

    if(nextEntry === undefined || !startTime.isSame(moment(nextEntry.begin), 'day')){
      timeEntriesHTML +=
      `
          <li class="list-group-item list-group-item-secondary">
            Total: ${totalTimeToDate.toFixed(2)} h @ &nbsp <i>${startTime.format("ddd MMM Do")}</i>
          </li>
        </div>
        <div class='day-group'>
      `;

      totalTimeToDate = 0;
    }

    // Update timer ongoing indicator
    if(isOngoing === true){
      isTimerRunning = true;
    }
  });

  timeEntriesHTML = `<ul class="list-group">${timeEntriesHTML}</ul>`

  $('#time-entries').html(timeEntriesHTML);
  $('.activity-stop-button').click(activityStopBtnOnClick);
  $('.activity-restart-button').click(activityRestartBtnOnClick);
  finishLoading();

  if(isTimerRunning){
    chrome.browserAction.setIcon({path: ongoingIcon});
  }else{
    chrome.browserAction.setIcon({path: normalIcon});
  }
};

const renderProjectTimerButtons = projects => {
  let projectButtonsHTML = "";

  projects.forEach(project => {
    const projectActivities = project.projectActivities;
    console.log(project)

    projectButtonsHTML +=
    `
      <div class="project-button-block card">
        <div class="title card-header">${project.name}</div>
        <div class="card-body" style="display:none">
        ${(projectActivities.length == 0) ? 'No hay actividades' : ''}
          <select class="activity-selection form-control" id="project-${project.id}-activity-selection" style="${(projectActivities.length == 0) ? 'display:none' : ''}">
            ${
              projectActivities &&
              projectActivities.map( (activity) => `
                <option value="${activity.id}">${activity.name}</option>
              `)
            }
          </select>
          <textarea class="form-control" style="margin-top: 0px; margin-bottom: 0px; min-height: 100px; max-height: 150px;width: 95%; ${(projectActivities.length == 0) ? 'display:none' : ''}" placeholder="Descripcion ..."></textarea>
          <button type="button" class="btn btn-outline-success btn-sm project-start-button mt-3 w-25" style="${(projectActivities.length == 0) ? 'display:none' : ''}" name="${project.id}">Start</button>
        </div>
      </div>
    `
  });

  $('#project-buttons').html(projectButtonsHTML);
  $('.project-start-button').click(projectStartButtonOnClick);

  $('#project-buttons').on('click', '.card-header',function () {
    console.log("sdfsf",  $(this).parent())
     $(this).parent().find('.card-body').toggle();
  });

  finishLoading();
}


export { renderTimeEntries, renderProjectTimerButtons }

