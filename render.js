var delimiters_inline = $(document.currentScript).data('delimiters_inline');
var delimiters_display = $(document.currentScript).data('delimiters_display');
var delimiters = delimiters_inline.concat(delimiters_display);

var oldBlurHandler = jQuery.fn.blurHandler;
jQuery.fn.blurHandler = function() {
    oldBlurHandler.apply(this, arguments);
    $(this).each(function() {
        var b = $(this)
          , p = b.getProject()
          , j = b.isNote()
          , d = getCurrentlyFocusedContent();
        k = b.text();

        if (delimiters.some(de => k.includes(de[0]) && k.includes(de[1]))) {
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
        if ($(this).attr("type") == "math/tex" && delimiters_inline.length > 0) {
            $(this).replaceWith(delimiters_inline[0][0] + $(this).html() + delimiters_inline[0][1]) ;
        } else if ($(this).attr("type") == "math/tex; mode=display" && delimiters_display.length > 0) {
            $(this).replaceWith(delimiters_display[0][0] + $(this).html() + delimiters_display[0][1]) ;
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

var oldProjectIsMergeable = jQuery.fn.projectIsMergable;
jQuery.fn.projectIsMergable = function(a) {
    var is_mergeable = oldProjectIsMergeable.apply(this, arguments);
    if (is_mergeable) {
        if ($(this).html().indexOf("MathJax") != -1) {
            mathjaxHtmlToText(this.getName().children(".content"));
        }
    }
    return is_mergeable;
}

var old_init = content_text.ContentText.prototype.init;
content_text.ContentText.prototype.init = function(z, D) {
    if (z.html && z.html().indexOf("MathJax") != -1) {
        mathjaxHtmlToText(z);
    }
    return old_init.apply(this, arguments);
};

/* Typeset after (new) content is loaded. */
var oldReadyfunction = documentReadyFunc;
$(document).ready(function() {
    oldReadyfunction();
    if (READY_FOR_DOCUMENT_READY) {
        MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
    }
});

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

