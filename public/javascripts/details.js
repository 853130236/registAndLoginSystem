$(document).ready(() => {
  $('#layout').click(() => {
    $.ajax({
      type: 'POST',
      url: '/details/exit',
      success: (data) => {
        location.href = '/'
      }
    })
  })   
})