$(document).ready(() => {
  $('#submit').click(() => {
    $.ajax({
      type: 'POST',
      url: '/',
      data: {
        'username': $('#username').val(), 
        'password': $('#password').val()
      },
      dataType: 'json', 
      success: (data) => {
        if (data.success) location.href = data.msg
        else $('#result').text(data.msg)
      }
    })
  }) 
  $('#regist').click(() => {
    location.href = '/regist'
  })  
})