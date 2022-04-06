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
        success: (csv) => {
          console.log('success ', csv);
          data = `<div class="results">${csv}</div>`;
          $('.results').replaceWith(data);
          // can also download file on client sice by creating Blob with csv result -> create object URL for Blob
          $('#download').css('display', 'block');
          const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
          // setting href attribute to locally generated url
          $('#download').attr('href', url);
          // set default action of anchor tag to download and set downloaded file name
          $('#download').attr('download', 'test.csv');
        }
      })
    };
    reader.readAsText(input);
  })
});

