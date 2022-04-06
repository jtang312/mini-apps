$(document).ready(() => {
  console.log('loaded');
  $('form').on('submit', (event) => {
    event.preventDefault();
    var input = document.querySelector(`input[type="file"]`).files[0];
    console.log(input);
    let reader = new FileReader();
    // .onload invoked after FileReader is done reading the file. Results in reader.result.
    reader.onload = function(evt) {
      var fileData = reader.result;
      console.log('file data: ', fileData);
      $.ajax({
        url: 'http://127.0.0.1:3000/',
        method: 'POST',
        data: {
          fileData
        },
        success: (data) => {
          console.log('success');
          data = `<div class="results">${data}</div>`;
          $('.results').replaceWith(data);
          $('#download').css('display', 'block');
        }
      })
    };
    reader.readAsText(input);
  })
  
  // $('#download').on('click', (event) => {
  //   event.preventDefault();
  //   const blob = new Blob([csv], { type: 'text/csv' });
  //   const url = URL.createObjectURL(blob);
  //   const a = document.createElement('a');

  //   a.href = url;
  //   a.download = filename || 'download';

  //   const downloadLink = downloadBlob(blob, 'testing.csv');
      
  //   // Set the text content of the download link
  //   downloadLink.textContent = 'Download CSV';

  //   // Attach the link to the DOM
  //   document.body.appendChild(downloadLink);
  // })
});

