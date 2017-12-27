$(document).ready(function() {
  $('.glyphicon-ok').css('visibility', 'hidden')
  $('.glyphicon-remove').css('visibility', 'hidden')

  $('input').each(function(index, item) {
    $(this).blur(function() {
      let property = $(this).attr('id')
      let tempData = {}
      tempData[property] = $(this).val()
      if (property == 'verify') {
        $.ajax({
          type: 'POST',
          url: '/regist/judge',
          data: {
            'password': $('#password').val(),
            'verify': $('#verify').val()
          },
          dataType: 'json', 
          success: function (data) {
            let ok = '#verifyOk'
            let remove = '#verifyRemove'
            if (data.success) {
              $('#result').text('')
              $(remove).css('visibility', 'hidden')
              $(ok).css('visibility', 'visible')
            } else {
              $('#result').text(data.msg)
              $(remove).css('visibility', 'visible')
              $(ok).css('visibility', 'hidden')
            }
          }
        })
      } else {
        $.ajax({
          type: 'POST',
          url: '/regist/judge',
          data: tempData,
          dataType: 'json', 
          success: function (data) {
            let ok = '#' + data.property + 'Ok'
            let remove = '#' + data.property + 'Remove'
            if (data.success) {
              $('#result').text('')
              $(remove).css('visibility', 'hidden')
              $(ok).css('visibility', 'visible')
            } else {
              $('#result').text(data.msg)
              $(remove).css('visibility', 'visible')
              $(ok).css('visibility', 'hidden')
            }
          }
        })
      }
    })
  })
  
  $('#submit').click(() => {
    $.ajax({
      type: 'POST',
      url: '/regist/pass',
      data: {
        'username': $('#username').val(),
        'password': $('#password').val(),
        'id':       $('#id').val(),
        'phone':    $('#phone').val(),
        'email':    $('#email').val() 
      },
      dataType: 'json', 
      success: function (data) {
        if (data.success) {
          location.href = '/'
        } else $('#result').text(data.msg)
      }
    })
  }) 
})