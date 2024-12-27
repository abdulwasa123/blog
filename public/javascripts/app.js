const previewBtn = document.querySelector("#preview-button");
const output = document.querySelector(".output");

const toolbarOptions = [
  // font options
  [{ font: [] }],

  //   header options
  [{ header: [1, 2, 3] }],

  // text utilities
  ["bold", "italic", "underline", "strike"],

  // text colors and bg colors
  [{ color: [] }, { background: [] }],

  // lists
  [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],

  // block quotes and code blocks
  ["blockquote", "code-block"],

  // media
  ["link", "image", "video"],

  // alignment
  [{ align: [] }],
];

const quill = new Quill("#editor-container", {
  theme: "snow",
  modules: {
    toolbar: toolbarOptions,
  },
});

// On form submission, copy Quill content to the hidden input
document.querySelector('form').addEventListener('submit', function (e) {
  const quillContent = quill.root.innerHTML; // Get Quill content as HTML
  document.getElementById('content').value = quillContent; // Set the hidden input's value
});
