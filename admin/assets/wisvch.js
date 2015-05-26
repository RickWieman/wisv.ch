function showalert(message,alerttype) {
    $('#alert-placeholder').append('<div id="alertdiv" class="alert ' +  alerttype + 
      '"><a class="close" data-dismiss="alert">&times;</a><span>'+message+'</span></div>')
    setTimeout(function() { 
    // this will automatically close the alert and remove this if the users doesnt close it in 5 secs
      $("#alertdiv").remove();
    }, 5000);
  }


// Handler to remove items
$('body').on('click', '.remove-button', function(){
  var id = $(this).closest('tr').attr('id');
  var key = $(this).closest('td').next('td').html();
  var idnum = id.split("-")[1];
  // Ask for confirmation
  bootbox.dialog({
    message: 'Are you sure you wish to delete key: <strong>'+key+'</strong>',
    title: 'Confirm deletion',
    buttons: {
      default: {
        label: 'Close',
        className: 'btn-default'
      },
      danger: {
        label: 'Delete',
        className: 'btn-danger',
        callback: function() {
          // Deletion confirmed, delete with AJAX call
          $.ajax({
            type: "POST",
            url: "ajax.php",
            data: {
              id: idnum,
              method: "remove"
            },
            success: function(result) {
              if (result == 'success') {
                $('#'+id).closest('tr').remove();
                showalert('<strong>Success!</strong> Key removed.', 'alert-success');
              } else {
                showalert('<strong>Uh-oh!</strong>, something went wrong. Error: ' + result, 'alert-danger');
              }
            }
          });
        }
      }
    }
  });
});

$('#addItem').click(function(){
  bootbox.dialog({
    title:    'New item',
    message:  '<form>' +
              '<div class="form-group">' +
              '<input type="text" id="newItemKey" placeholder="Key" class="form-control" />' +
              '</div>' +
              '<div class="form-group">' +
              '<input type="text" id="newItemUrl" placeholder="URL" class="form-control" />' +
              '</div>' +
              '</form>',
    buttons: {
      default: {
        label: 'Cancel',
        className: 'btn-default'
      },
      success: {
        label: 'Save',
        className: 'btn-success',
        callback: function() {
          var data = {
            method: "add",
            key: $('#newItemKey').val(),
            redirect: $('#newItemUrl').val()
          }
          $.ajax({
            type: "POST",
            url: "ajax.php",
            data: data,
            success: function(result) {
              if (result.split(':')[0] == 'success') {
                var newItem = '<tr class="item-row" id="row-'+result.split(':')[1]+'">'+
                              '<td><span class="glyphicon glyphicon-pencil edit-button" aria-hidden="true"></span></td>' +
                              '<td><span class="glyphicon glyphicon-trash remove-button" aria-hidden="true"></span></td>' +
                              '<td class="key">' + data.key + '</td>' +
                              '<td class="redirect"><a href="' + data.redirect + '" target="_blank">' + data.redirect + '</a></td>'+
                              '</tr>';
                $('#redirects').append(newItem);
                showalert('<strong>Success!</strong> Key added: ' + data.key, 'alert-success');
              } else {
                showalert('<strong>Uh-oh!</strong> Something went wrong. Error: ' + result, 'alert-danger');
              }
            }
          });
        }
      }
    }
  });
});

$('body').on('click', '.edit-button', function(){
  var id = $(this).closest('tr').attr('id');
  var key = $(this).closest('td').next('td').next('td').find('a').html();
  var url = $(this).closest('td').next('td').next('td').next('td').find('a').text();
  var idnum = id.split("-")[1];

  bootbox.dialog({
    title:    'Edit item',
    message:  '<form>' +
              '<div class="form-group">' +
              '<input type="text" id="itemKey" placeholder="Key" class="form-control" value="'+key+'"/>' +
              '</div>' +
              '<div class="form-group">' +
              '<input type="text" id="itemUrl" placeholder="URL" class="form-control" value="'+url+'"/>' +
              '</div>' +
              '</form>',
    buttons: {
      default: {
        label: 'Cancel',
        className: 'btn-default'
      },
      success: {
        label: 'Save',
        className: 'btn-primary',
        callback: function() {
          var data = {
            method: "update",
            id: idnum,
            key: $('#itemKey').val(),
            redirect: $('#itemUrl').val()
          }
          console.log(data)
          $.ajax({
            type: "POST",
            url: "ajax.php",
            data: data,
            success: function(result) {
              if (result == 'success') {
                $('#'+id+' td.key').html(data.key);
                $('#'+id+' td.redirect').html('<a href="' + data.redirect + '" target="_blank">' + data.redirect + "</a>");
                showalert('<strong>Success!</strong> Key updated: ' + data.key, 'alert-success');
              } else {
                showalert('<strong>Uh-oh!</strong> Something went wrong. Error: ' + result, 'alert-danger');
              }
            }
          });
        }
      }
    }
  });
});
