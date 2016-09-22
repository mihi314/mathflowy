var oldBlurHandler = jQuery.fn.blurHandler;
jQuery.fn.blurHandler = function() {
    oldBlurHandler.apply(this, arguments);
    $(this).each(function() {
        var b = $(this)
          , p = b.getProject()
          , j = b.isNote()
          , d = getCurrentlyFocusedContent();
        k = b.text();

        if (k.indexOf("$") > -1 ||
            ((k.indexOf("\\(") > -1) && (k.indexOf("\\)") > -1)) ||
            ((k.indexOf("\\[") > -1) && (k.indexOf("\\]") > -1))
           ) {
            MathJax.Hub.Queue(["Typeset", MathJax.Hub, b.get()]);
        }
    });
    return this;
};

function mathjaxHtmlToText(b) {
    b.children(".MathJax_Preview").remove();
    b.children(".MathJax_Display").remove();
    b.children(".MathJax").remove();

    b.find("script").each(function() {
        if ($(this).attr("type") == "math/tex") {
            $(this).replaceWith("\\(" + $(this).html() + "\\)") ;
        } else if ($(this).attr("type") == "math/tex; mode=display") {
            $(this).replaceWith("\\[" + $(this).html() + "\\]") ;
        }
    });

    return b.html().replace(/&lt;/ig, "<").replace(/&gt;/ig, ">").replace(/&nbsp;/ig, "\u00a0").replace(/&amp;/ig, "&");
}

var oldFocusHandler = jQuery.fn.focusHandler;
jQuery.fn.focusHandler = function() {
    oldFocusHandler.apply(this, arguments);
    if ($(this).html().indexOf("MathJax") != -1) {
        mathjaxHtmlToText(this);
    }
}

/* Typeset after (new) content is loaded. */
var oldReadyfunction = documentReadyFunc;
var documentReadyFunc = function() {
    oldReadyfunction();
    if (READY_FOR_DOCUMENT_READY) {
        MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
    }
};
$(document).ready(documentReadyFunc);

jQuery.fn.oldSetExpanded = jQuery.fn.setExpanded;
jQuery.fn.setExpanded = function(b) {
    $(this).oldSetExpanded(b);
    MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
}

jQuery.fn.oldSelectIt = jQuery.fn.selectIt;
jQuery.fn.selectIt = function(b, e) {
    $(this).oldSelectIt(b, e);
    MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
}

var oldRefreshVisibleChildrenUnderSelectedForAddButton = refreshVisibleChildrenUnderSelectedForAddButton;
var refreshVisibleChildrenUnderSelectedForAddButton = function(b) {
    oldRefreshVisibleChildrenUnderSelectedForAddButton(b);
    MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
}

