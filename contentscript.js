// inject needed scripts

// 1. custom mathjax configuration
var s = document.createElement('script');
s.type = "text/x-mathjax-config";
s.text = 'MathJax.Hub.Config({\
      tex2jax: {\
        displayMath: [ ["\\\\[","\\\\]"] ],\
      }\
  });';
(document.head||document.documentElement).appendChild(s);

// 2. mathjax itself
s = document.createElement('script');
s.src = "https://c328740.ssl.cf1.rackcdn.com/mathjax/latest/MathJax.js?config=TeX-AMS_HTML";
(document.head||document.documentElement).appendChild(s);

// 3. mods to render mathjax
s = document.createElement('script');
s.src = chrome.extension.getURL("render.js");
(document.head||document.documentElement).appendChild(s);
