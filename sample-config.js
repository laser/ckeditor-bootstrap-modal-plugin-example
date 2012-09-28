/*

    a sample config - shows how to add your button (defined in plugin.js)
    and your plugin (in the extraPlugins string) 

/*

CKEDITOR.editorConfig = function( config ) {
    config.extraPlugins = 'bootstrap-modal-link-inserter';
    config.toolbar = [["Bold", "Italic", "Underline", "TextColor", "FontSize", "-", "BootstrapLinkInserter"]];
};
