export default function downloadDataURL(dataurl: string, filename: string) {
  var a = document.createElement('a');

  // Fetching the dataURL to get a blob is a workaround for a known Chromium bug. For more,
  // see: https://stackoverflow.com/a/16762555/1727181
  fetch(dataurl)
    .then(v => v.blob())
    .then(blob => {
      const url = URL.createObjectURL(blob);
      a.href = url;
      a.setAttribute('download', filename);
      a.click();
    });
}
