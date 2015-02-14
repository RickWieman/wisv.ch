// Handler to remove items
$('.remove-button').click(function(){
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
                console.log('successfully removed.');
                $('#'+id).closest('tr').remove();
              } else {
                console.log('something went wrong: ' + result);
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
                console.log('successfully added.');
                var row = $('#redirects .item-row:last-child');
                var clone = row.clone();
                row.after(clone);
                clone.attr('id','row-'+result.split(':')[1]);
                $('#' + clone.attr('id') + ' td.key').html(data.key);
                $('#' + clone.attr('id') + ' td.redirect').html(data.redirect);
              } else {
                console.log('something went wrong: ' + result);
              }
            }
          });
        }
      }
    }
  });
});

$('.edit-button').click(function(){
  var id = $(this).closest('tr').attr('id');
  var key = $(this).closest('td').next('td').next('td').html();
  var url = $(this).closest('td').next('td').next('td').next('td').html();
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
                console.log('successfully updated.');
                $('#'+id+' td.key').html(data.key);
                $('#'+id+' td.redirect').html(data.redirect);
              } else {
                console.log('something went wrong: ' + result);
              }
            }
          });
        }
      }
    }
  });
});
