import 'bootstrap';
import "../css/options.scss";
import { pingWithCredentials } from './popup/api_call_helper';

function constructOptions() {
  var loaddin = false;
  let button = $('#save-button');

  // Populate existing info
  chrome.storage.sync.get(['apiRootUrl', 'apiUsername'], 
  (data) => {
    $('#endpoint').val(data.apiRootUrl);
    $('#api-username-input').val(data.apiUsername);
  });

  // Add submit onClick listener
  button.click(() => {
    const apiRootUrl = $('#endpoint').val();
    const apiUsername = $('#api-username-input').val();
    const apiPassword = $('#api-password-input').val();
    $('#message').text("");
    showSpinner(true);
    pingWithCredentials(
      apiRootUrl, apiUsername, apiPassword,
      () =>{
        chrome.storage.sync.set({
          apiUsername: apiUsername,
          apiPassword: apiPassword,
          apiRootUrl: apiRootUrl
        }, () => {
          $('#message').text("API information is saved.");
          showSpinner(false);
        });
      },
      () => {
        $('#message').text("API endpoint or credential is invalid");
        showSpinner(false);
      }
    )
  });

  function showSpinner(show) {
    if(show){
      $('#spinner').removeClass('d-none');
      $('#loading').removeClass('d-none');
      $('#text-btn').addClass('d-none');
    }else{
      $('#spinner').addClass('d-none');
      $('#loading').addClass('d-none');
      $('#text-btn').removeClass('d-none');
    }
    
  }
}
constructOptions();
