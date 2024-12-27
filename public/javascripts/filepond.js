// Import FilePond and the Image Preview plugin
const { registerPlugin, create } = require('filepond');
const FilePondPluginImagePreview = require('filepond-plugin-image-preview');

// Import FilePond's styles (if your setup supports importing CSS)
require('filepond/dist/filepond.min.css');
require('filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css');

// Register the plugin
registerPlugin(FilePondPluginImagePreview);

// Select the file input element
const inputElement = document.querySelector('#image-upload');

// Create a FilePond instance with the configuration
create(inputElement, {
    allowProcess: false, // Disable uploading
    allowMultiple: false, // Allow only one file
    instantUpload: false, // Disable instant upload
    labelIdle: 'Drag & Drop your image or <span class="filepond--label-action">Browse</span>',
    stylePanelAspectRatio: 1, // Optional customization
});
