/*

    example plugin that uses Twitter Bootstrap's modal,
    jQuery, and Mustache to show a modal allowing the
    user to add an HTML link to their CKEDITOR canvas

*/

CKEDITOR.plugins.add('bootstrap-modal-link-inserter', {
    init: function (editor) {
        var pluginName = 'bootstrap-modal-link-inserter';

        editor.addCommand(pluginName, {
            exec: function(editor) {
                var t = '',
                    selection = editor.getSelection(),
                    selectedText,
                    $modalRegion,
                    onCloseClicked,
                    onDoneEvent,
                    onKeyup;

                onCloseClicked = function(e) {
                    $modalRegion.modal('hide');
                };

                onDoneEvent = function(e) {
                    var protocol = $modalRegion.find("#imprevLinkInserterProtocol").val(),
                        url      = $modalRegion.find("#imprevLinkInserterURL").val();

                    editor.insertHtml(Mustache.to_html('<a href="{{url}}">{{text}}</a>', {
                        "text": jQuery(selectedText.anchorNode).text() || url,
                        "url": protocol + url
                    }));

                    $modalRegion.modal('hide');
                };

                onKeyup = function(e) {
                    var code = e.keyCode || e.which;
                    if (code == 13) {
                        // Enter keycode
                        onDoneEvent(e);
                    }
                };

                // get the selected text, if available

                if (CKEDITOR.env.ie) {
                    selection.unlock(true);
                    selectedText = selection.getNative().createRange().text;
                } else {
                    selectedText = selection.getNative();
                }

                t += '<div class="modal-header">';
                t += '    <button type="button" class="close" data-dismiss="modal">x</button>';
                t += '    <h3>{{i18n.title}}</h3>';
                t += '</div>';
                t += '<div class="modal-body">';
                t += '    <form class="form-horizontal">';
                t += '        <div class="control-group">';
                t += '            <label class="control-label" for="imprevLinkInserterProtocol">{{i18n.protocol}}</label>';
                t += '            <div class="controls">';
                t += '                <select id="imprevLinkInserterProtocol">';
                t += '                    <option value="http://">http://</option>';
                t += '                    <option value="https://">https://</option>';
                t += '                    <option value="mailto:">mailto:</option>';
                t += '                    <option value="">{{i18n.otherProtocol}}</option>';
                t += '                </select>';
                t += '            </div>';
                t += '        </div>';
                t += '        <div class="control-group">';
                t += '            <label class="control-label" for="imprevLinkInserterURL">{{i18n.toUrl}}</label>';
                t += '            <div class="controls">';
                t += '                <input type="text" tabindex="1" id="imprevLinkInserterURL">';
                t += '            </div>';
                t += '        </div>';
                t += '    </form>';
                t += '</div>';
                t += '<div class="modal-footer">';
                t += '    <div>';
                t += '        <button class="btn left"  type="push" data-dismiss="modal">{{i18n.close}}</button>';
                t += '        <button class="btn btn-primary right" type="push">{{i18n.ok}}</button>';
                t += '    </div>';
                t += '</div>';

                // jam the modal element into the DOM if it's not
                // already there

                $modalRegion = jQuery("#modal") || jQuery("body").append('<div id="modal"></div>').find("#modal");

                // merge in the i18n strings

                $modalRegion.html(Mustache.to_html(t, {
                    "i18n": {
                        "close": editor.lang.common.close,
                        "ok": editor.lang.common.ok,
                        "otherProtocol": editor.lang.link.other,
                        "protocol": editor.lang.common.protocol,
                        "title": editor.lang.link.title,
                        "toUrl": editor.lang.link.toUrl
                    }
                }));

                // fire the bootstrap modal stuff

                $modalRegion.modal({
                    "keyboard": false,
                    "show": true,
                    "backdrop": "static"
                });

                $modalRegion.on("click", ".left",  onCloseClicked);
                $modalRegion.on("click", ".right", onDoneEvent);
                $modalRegion.on("keyup", "input",  onKeyup);

                // bootstrap modal events

                $modalRegion.on('hidden', function () {
                    $modalRegion.off("click", ".left");
                    $modalRegion.off("click", ".right");
                    $modalRegion.off("keyup", "input");
                });

                $modalRegion.on("shown", function() {
                    $modalRegion.find("input").focus();
                });
            },
            canUndo: false // No support for undo/redo
        });

        // Register the toolbar button.
        editor.ui.addButton('BootstrapLinkInserter', {
            label: editor.lang.link.title,
            command: pluginName,
            icon: "skins/kama/icons.png",
            iconOffset: 33
        });
    }
});