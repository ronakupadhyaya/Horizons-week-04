var url="http://localhost:3000";
var contacts=[];

$(function() {
	$('#new-contact-button').on('click', function(event) {
		event.preventDefault();
		var jsonForm = $('#new-contact-form').serializeObject();
		$.ajax(url+'/newcontact', {
			method: 'POST',
			data: jsonForm,
			success: function(contact) {
				var newContact = buildContact(contact);
				$('#contacts-column').prepend(newContact);
				clearContactForm();
			},
			error: function(error) {
							}
		});
	});

	loadContacts();
});



var buildContact = function(contact) {
	contacts.push(contact);
	var well = $('<div class="well"></div>');
	var row1 = $('<div class="row"></div>');
	var col1 = $('<div class="col-sm-12"></div>');
	row1.append(col1);
	col1.append($('<h3><span class="fa fa-user"></span> '+contact.name+'</h3>'));
	col1.append($('<p><strong>email</strong>: '+contact.email+'</p>'));
	col1.append($('<p><strong>phone#</strong>: '+contact.phone+'</p>'));
	
	var row2 = $('<div class="row"></div>');
	var col2 = $('<div class="col-sm-12"></div>');
	row2.append(col2);
	col2.append($('<button class="btn btn-default btn-sm" style="margin-right: 1em;">Edit Contact</button>'));
	col2.append($('<button class="btn btn-success btn-sm" style="margin-right: 1em;" onclick="triggerModal(\'sms\', \''+contact._id+'\');">Send Text Message</button>'));
	col2.append($('<button class="btn btn-success btn-sm">Send Email</button>'));

	well.append(row1);
	well.append(row2);

	return well;
}

var clearContactForm = function() {
	$('#new-contact-form')[0].reset();
}

var loadContacts = function() {
	$.ajax(url+'/contacts', {
		method: 'POST',
		success: function(contacts) {
			contacts.forEach(function(contact) {
				var newContact = buildContact(contact);
				$('#contacts-column').prepend(newContact);
			});

		},
		error: function(error) {
						
		}
	})
}


// Modal constructor
var Modal = function(id, title, contentHtml, buttonText, buttonFunction) {
	this.id = id;
	this.title = title;
	this.contentHtml = contentHtml;
	this.buttonText = buttonText;
	this.buttonFunction = buttonFunction;
	};

// Modal methods
Modal.prototype = {
	// return Modal as DOM
	buildDOM: function() {
		var modal = $('<div class="modal fade" id="'+this.id+'" tabindex="-1" role="dialog"></div>');
		var modalDialog = $('<div class="modal-dialog" role="document"></div>');
		modal.append(modalDialog);
		var modalContent = $('<div class="modal-content"></div>');
		modalDialog.append(modalContent);
		var modalHeader = $('<div class="modal-header"><button type="button" class="close" data-dismiss="modal"><span>&times;</span></button><h4 class="modal-title" id="login-modal-label">'+this.title+'</h4></div>');
		modalContent.append(modalHeader);
		var modalBody = $('<div class="modal-body"></div>');
		modalContent.append(modalBody);
		modalBody.append(this.contentHtml);
		var modalFooter = $('<div class="modal-footer"></div>');
		var buttonFunction = $('<button type="button" class="btn btn-primary" id="button'+this.id+'">'+this.buttonText+'</button>');
		var buttonCancel = $('<button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>');
		modalFooter.append(buttonFunction);
		modalFooter.append(buttonCancel);
		modalContent.append(modalFooter);

		buttonFunction.on('click', this.buttonFunction);

		return modal;
	} // end buildDOM()
};

// possible types: sms, email
triggerModal = function(type, contactId) {
	// sms modal
	if(type === 'sms') {
		var contact = findContact(contactId);
		var contentHtml = '<form role="form"><div class="form-group"><label for="message">Message:</label><textarea rows="5" name="message" class="form-control" id="message'+contactId+'" maxlength="255"></textarea></div></form>';
		var buttonFunction = function() {
			var data = {
				contact : contact,
				message : $('#message'+contactId).val()
			}

			$.ajax(url+'/message', {
				method: 'POST',
				data: data,
				success: function(response) {
					console.log(response);
					$('#'+contactId).modal('hide');
				},
				error: function(response) {
					console.log(response);
					$('#'+contactId).modal('hide');
				}
			});
		};
		var modalObject = new Modal(contactId, 'Text Message', contentHtml, 'Send Message', buttonFunction);
		var modalDOM = modalObject.buildDOM();
		$('#page-modal').empty();
		$('#page-modal').append(modalDOM);
		modalDOM.modal('show');
				return 1;
	} // end if

	return 0;
};

// find contact by id
findContact = function(id) {
	var result = null;
	contacts.forEach(function(contact) {
		if(contact._id === id) {
			result = contact;
		}
	});
	return result;
};


// jquery custom functions ====================================================
// transform html form data to javascript object
$.fn.serializeObject = function()
{
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};