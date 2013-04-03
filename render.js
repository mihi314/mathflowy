jQuery.fn.styleEditArea = function() {
    $(this).each(function() {
        var b = $(this), c = b.hasClass("fixed"), e = b.getContentTarget(), d = b.children("textarea"), k = e == undefined ? null : e.getProject();
        if (e == undefined || !e.contentIsEditable()) {
            IS_MOBILE ? b.hideEditor(true) : b.hideEditor();
            c && tagging.getTagAutocompleter().detach()
        } else {
            if (projecttree.getProjectReferenceFromDomProject(k).isReadOnly()) {
                k = e.getLastSavedContentText();
                d.val() !== k && d.val(k)
            }
            b.css("display", "block");
            k = textToHtml(d.val());
            if (e.isNote(true))
                k += "<div class='spacer'>.</div>";
            e.setContentHtml(k);

            // TODO: there's gotta be a faster way to do this
            if (((k.indexOf("\\(") > -1) && (k.indexOf("\\)") > -1)) ||
                ((k.indexOf("\\[") > -1) && (k.indexOf("\\]") > -1))
               ) {
                MathJax.Hub.Queue(["Typeset", MathJax.Hub, e.get()]);
            }

            k = e.outerHeight() + 2;
            if (c && !IS_ANDROID)
                k += parseInt(e.css("lineHeight"));
            b.height(k);
            k = e.offset();
            IS_MOBILE || b.css({top: 0,left: 0});
            b.offset(k);
            e = e.outerWidth();
            if (IS_IOS)
                e -= 4;
            else if (IS_ANDROID)
                e -= 10;
            else if (IS_IE)
                e += 4;
            if (IS_FIREFOX)
                e += 2;
            b.width(e);
            c && tagging.getTagAutocompleter().updateDisplay(d)
        }
    });
    return this
};

function htmlToText(b) {
    b.find(".contentMatch").each(function() {
        $(this).replaceWith($(this).html())
    });

    b.children(".contentLink").each(function() {
        $(this).replaceWith($(this).html())
    });

    b.children(".contentTag").each(function() {
        $(this).replaceWith($(this).find(".contentTagClickable").attr("data-tag"))
    });

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

jQuery.fn.keyboardExpandToggle = function() {
    var b = $(this).getProject();
    b.is(".selected") ? b.expandOrCollapseAllDescendantsOfProjectToggle() : b.clickExpandButton(true);
    MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
    return this
};
