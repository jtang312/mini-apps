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
        url: '/',
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
  
});

