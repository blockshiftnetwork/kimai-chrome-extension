const apiConfig = {
  timeSheetSize: 10
};

const getAjaxParams = (apiUrl, username, password) => {
  return {
    rootUrl: apiUrl,
    cache: true,
    type: 'GET',
    dataType: 'json',
    beforeSend: function (request) {
      request.setRequestHeader("X-AUTH-USER", username);
      request.setRequestHeader("X-AUTH-TOKEN", password);
    },
    headers: {
      'X-AUTH-USER': username,
      'X-AUTH-TOKEN': password,
    }
  }
}

export function loadAllTimeEntries(successHandler, errorHandler){
  loading();
  getAPICredential(
    (url, username, password) => {
      const ajaxParams = getAjaxParams(url, username, password);

      $.when(
        $.ajax({url: `${ajaxParams.rootUrl}/api/projects?order=ASC&orderBy=id`, ...ajaxParams}),
        $.ajax({url: `${ajaxParams.rootUrl}/api/timesheets?size=${apiConfig.timeSheetSize}`, ...ajaxParams})
      ).done((projects, timeSheetsEntries) => {
        timeSheetsEntries = timeSheetsEntries[0];
        projects = projects[0];

        timeSheetsEntries.map((timeSheetEntry) => {
          timeSheetEntry.projectName = projects.find( p => p.id === timeSheetEntry.project ).name;
        });

        successHandler(timeSheetsEntries);
      }).fail(errorHandler);
    }
  );
}

export function loadAllProjectsAndActivities(successHandler, errorHandler){
  loading();
  getAPICredential(
    (url, username, password) => {
      const ajaxParams = getAjaxParams(url, username, password);

      let projectWithActivityArray = [];
      let results=[];
      $.when(
        $.ajax({url: `${ajaxParams.rootUrl}/api/projects?order=ASC&orderBy=id`, ...ajaxParams}),
        $.ajax({url: `${ajaxParams.rootUrl}/api/activities`, ...ajaxParams})
      ).done( (projects, activities) => {
        projects = projects[0];
        activities = activities[0];

        projectWithActivityArray = projects;
          console.log (projectWithActivityArray)
          for (let index = 0; index < projectWithActivityArray.length; index++) {
            if(typeof projectWithActivityArray[index].projectActivities === 'undefined'){ projectWithActivityArray[index].projectActivities = [] }
            activities.forEach(activity => {
                if (activity.project == projectWithActivityArray[index].id) {
                  projectWithActivityArray[index].projectActivities.push({
                          name: activity.name,
                          id: activity.id
                  })
                }
            });
          }

        // activities.forEach( activity => {

        //   const projectID = activity.project;
        //   const activityID = activity.id;
        //   const activityName = activity.name;


        //   projectWithActivityArray.forEach(function(e,i){
        //       if (e.id == projectID) {
        //         // console.log(i, projectWithActivityArray[i])
        //         const projectObject = projectWithActivityArray[i];
        //         results[projectID] = projectWithActivityArray[i]

        //       }
        //   })

        // //  console.log(typeof projectObject,activityID,projectID)

        //   if (typeof projectObject != 'undefined'){
        //     if(typeof results[projectID].projectActivities === 'undefined'){ results[projectID].projectActivities = [] }
        //     results[projectID].projectActivities.push({
        //       name: activityName,
        //       id: activityID
        //     });
        //   }



        // })

        //   console.log(results)

        successHandler(projectWithActivityArray);
      }).fail(errorHandler);
    }
  );
}

export function loadDataForSelects(successHandler, errorHandler){
  getAPICredential(
    (url, username, password) => {
      const ajaxParams = getAjaxParams(url, username, password);
      $.when(
        $.ajax({url: `${ajaxParams.rootUrl}/api/projects?order=ASC&orderBy=id`, ...ajaxParams}),
        $.ajax({url: `${ajaxParams.rootUrl}/api/activities`, ...ajaxParams})
      ).done( (projects, activities) => {
        projects = projects[0];
        activities = activities[0];
        successHandler(projects, activities);
      }).fail(errorHandler);
    }
  );
}


export function startProjectTimer(projectID, activityID, successHandler, errorHandler){
  loading();
  getAPICredential(
    (url, username, password) => {
      const ajaxParams = getAjaxParams(url, username, password);

      $.ajax({
        ...ajaxParams,
        url: `${ajaxParams.rootUrl}/api/timesheets`,
        type: 'POST',
        data: {
          "begin": getCurrentTimeInString(),
          "project": projectID,
          "activity": activityID,
          "description": ""
        },
        success: successHandler,
        error: errorHandler
      });
    }
  );
}

export function updateProjectTimer(id, data, successHandler, errorHandler){
  loading();
  getAPICredential(
    (url, username, password) => {
      const ajaxParams = getAjaxParams(url, username, password);

      $.ajax({
        ...ajaxParams,
        url: `${ajaxParams.rootUrl}/api/timesheets/${id}`,
        type: 'PATCH',
        data: data,
        success: successHandler,
        error: errorHandler
      });
    }
  );
}

export function stopActivityTimer(timeSheetID, successHandler, errorHandler){
  loading();
  getAPICredential(
    (url, username, password) => {
      const ajaxParams = getAjaxParams(url, username, password);

      $.ajax({
        ...ajaxParams,
        url: `${ajaxParams.rootUrl}/api/timesheets/${timeSheetID}/stop`,
        type: 'PATCH',
        data: {
          "end": getCurrentTimeInString()
        },
        success: successHandler,
        error: errorHandler
      });
    }
  );
}

export function restartActivityTimer(timeSheetID, successHandler, errorHandler){
  loading();
  getAPICredential(
    (url, username, password) => {
      const ajaxParams = getAjaxParams(url, username, password);

      $.ajax({
        ...ajaxParams,
        url: `${ajaxParams.rootUrl}/api/timesheets/${timeSheetID}/restart`,
        type: 'PATCH',
        data: {
          "copy": "all"
        },
        success: successHandler,
        error: errorHandler
      });
    }
  );
}


export function pingWithCredentials(endpoint, username, password, successHandler, errorHandler){
  const ajaxParams = getAjaxParams(endpoint, username, password);

  $.ajax({
    ...ajaxParams,
    url: `${ajaxParams.rootUrl}/api/ping`,
    type: 'GET',
    success: successHandler,
    error: errorHandler
  });
}

// Utility functions
function getCurrentTimeInString(){
  const tzoffset = (new Date()).getTimezoneOffset() * 60000;
  const localISOTime = (new Date(Date.now() - tzoffset))
    .toISOString()
    .slice(0, 19);

  return localISOTime;
}

function getAPICredential(successHandler){
  chrome.storage.sync.get(['apiRootUrl','apiUsername', 'apiPassword'], function(data) {
    successHandler(data.apiRootUrl, data.apiUsername, data.apiPassword);
  });
}

function loading(){
  $("#spinner").css({
    display: "block",
    visibility: "unset"
  });
}