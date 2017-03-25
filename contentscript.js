// inject needed scripts
var delimiters_inline = [];
var delimiters_display = [];

var option_delimiters = {
  "inline-(": ["\\(", "\\)"],
  "inline-$": ["$", "$"],
  "display-[": ["\\[", "\\]"],
  "display-$$": ["$$", "$$"]
}

var storage = chrome.storage.local;
if (chrome.storage.sync) {
  storage = chrome.storage.sync;
}

storage.get({
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
  for (var key in option_delimiters) {
    if (prefs[key]) {
      if (key.startsWith("inline")) {
        delimiters_inline.push(option_delimiters[key]);
      } else {
        delimiters_display.push(option_delimiters[key]);
      }
    }
  }
  if (prefs["inline-custom"] && prefs["inline-custom-left"] != "" && prefs["inline-custom-left"] != "") {
    delimiters_inline.push([prefs["inline-custom-left"], prefs["inline-custom-right"]]);
  }
  if (prefs["display-custom"]  && prefs["display-custom-left"] != "" && prefs["display-custom-left"] != "") {
    delimiters_display.push([prefs["display-custom-left"], prefs["display-custom-right"]]);
  }

  // 1. custom mathjax configuration + physics extension
  var s = document.createElement('script');
  s.type = "text/x-mathjax-config";
  s.text = 'MathJax.Hub.Config({\
        tex2jax: {\
          inlineMath: ' + JSON.stringify(delimiters_inline) + ',\
          displayMath: ' + JSON.stringify(delimiters_display) + ',\
        },\
        extensions: ["[Contrib]/physics/physics.js"]\
    });';
  (document.head||document.documentElement).appendChild(s);

  // 2. mathjax itself
  s = document.createElement('script');
  s.src = "https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS_HTML";
  (document.head||document.documentElement).appendChild(s);

  // 3. mods to render mathjax
  s = document.createElement('script');
  s.dataset.delimiters_inline = JSON.stringify(delimiters_inline);
  s.dataset.delimiters_display = JSON.stringify(delimiters_display);
  s.src = chrome.extension.getURL("render.js");
  (document.head||document.documentElement).appendChild(s);
});
