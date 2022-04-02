$(document).ready(() => {
  console.log('loaded');
  $('form').on('submit', (event) => {
    event.preventDefault();
    var filename = document.getElementById('data').files[0];
    console.log(filename);
    let reader = new FileReader();
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
          $('.results').replaceWith(data);
        }
      })
    };
    reader.readAsText(filename);
  })
  
});

