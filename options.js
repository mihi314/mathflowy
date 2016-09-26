/* Adapted from https://developer.chrome.com/extensions/optionsV2 */
var checkbox_options = ['inline-(', 'inline-$', 'display-[', 'display-$$',
  'inline-custom', 'display-custom'];
var text_options = ['inline-custom-left', 'inline-custom-right', 'display-custom-left', 'display-custom-right'];

function save_options() {
  prefs = {}
  for (var i = checkbox_options.length - 1; i >= 0; i--) {
    prefs[checkbox_options[i]] = document.getElementById(checkbox_options[i]).checked;
  }
  for (var i = text_options.length - 1; i >= 0; i--) {
    prefs[text_options[i]] = document.getElementById(text_options[i]).value;
  }
  chrome.storage.sync.set(prefs, function() {
    // Update status to let user know options were saved.
    var message = document.getElementById('message');
    message.textContent = 'Options saved. Reload Workflowy tabs for changes to take effect.';
    setTimeout(function() {
      status.textContent = '';
    }, 4000);
  });
}

function restore_options() {
  chrome.storage.sync.get({
    "inline-(": true,
    "inline-$": true,
    "display-[": true,
    "display-$$": true,
    "inline-custom": false,
    "display-custom": false,
    "inline-custom-left": "",
    "inline-custom-right": "",
    "display-custom-left": "",
    "display-custom-right": ""
  }, function(prefs) {
    for (var i = checkbox_options.length - 1; i >= 0; i--) {
      document.getElementById(checkbox_options[i]).checked = prefs[checkbox_options[i]];
    }
    for (var i = text_options.length - 1; i >= 0; i--) {
      document.getElementById(text_options[i]).value = prefs[text_options[i]];
    }
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);
