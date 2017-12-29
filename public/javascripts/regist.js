let success = (data) => {
  let ok = '#' + data.property + 'Ok'
  let remove = '#' + data.property + 'Remove'
  if (data.success) {
    $('#result').text('')
    $(remove).css('visibility', 'hidden')
    $(ok).css('visibility', 'visible')
    //  处理先填写verify再填写password的情况
    if (property == 'password' && $('#verify').val() != '') 
      $('#verify').trigger('blur')
  } else {
    if ($('#result').text() == '')
      $('#result').text(data.msg)
    $(remove).css('visibility', 'visible')
    $(ok).css('visibility', 'hidden')
  }
}

$(document).ready(function() {
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
          success: success
        })
      } else {
        $.ajax({
          type: 'POST',
          url: '/regist/judge',
          data: tempData,
          dataType: 'json', 
          success: success
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