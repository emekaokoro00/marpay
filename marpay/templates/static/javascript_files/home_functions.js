var connected = false;
const call_name = document.getElementById('call_name');
const button = document.getElementById('call_leave');
const container = document.getElementById('container_vid');
const count = document.getElementById('count');
var room; 


function addLocalVideo() {
    Twilio.Video.createLocalVideoTrack().then(track => {
        var video = document.getElementById('local').firstChild;
        video.appendChild(track.attach());
    });
}; 

/*function addLocalVideo() {
	// const { isSupported } = require('twilio-video');
	const isSupported  =  true;
	if (isSupported) {
	    Twilio.Video.createLocalVideoTrack().then(track => {
	        var video = document.getElementById('local').firstChild;
	        video.appendChild(track.attach());
	    });
	} else {
	  alert('This browser is not supported by twilio-video.js.');
	}
}; */

function connectButtonHandler(e) {
    e.preventDefault();
    if (!connected) {
        var username = call_name.textContent;
        /*if (!username) {
            alert('Enter your name before connecting');
            return;
        }*/
        button.disabled = true;
        button.innerHTML = 'Connecting...';
        connect(username).then(() => {
            button.innerHTML = 'End Call';
            button.disabled = false;
        }).catch(() => {
            alert('Connection failed. Is the backend running?');
            button.innerHTML = 'Direct to Doctor';
            button.disabled = false;    
        });
    }
    else {
        disconnect();
        button.innerHTML = 'Direct to Doctor';
        connected = false;
    }
};

function disconnect() {
    room.disconnect();
    while (container.lastChild.id != 'local')
        container.removeChild(container.lastChild);
    button.innerHTML = 'Direct to Doctor';
    connected = false;
    updateParticipantCount();
};

function connect(username) {
    var promise = new Promise((resolve, reject) => {
        // get a token from the back end
        fetch('myuser/start_call/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type':'application/json', 
                "X-CSRFToken": getCookie("csrftoken"),
                // 'X-CSRFToken':'{{csrf_token}}',
                'X-Requested-With': 'XMLHttpRequest',
              },
            // mode: 'cors',
            mode: 'same-origin',
            cache: 'default',
            credentials: 'include',
            body: JSON.stringify({'username': username})
        }).then(res => res.json()).then(data => {
            // join video call
            return Twilio.Video.connect(data.token);
        }).then(_room => {
            room = _room;
            room.participants.forEach(participantConnected);
            room.on('participantConnected', participantConnected);
            room.on('participantDisconnected', participantDisconnected);
            connected = true;
            updateParticipantCount();
            resolve();
        }).catch(() => {
            reject();
        });
    });
    return promise;
};

function updateParticipantCount() {
    if (!connected)
        count.innerHTML = 'Disconnected.';
    else
        count.innerHTML = (room.participants.size + 1) + ' participants online.';
};

function participantConnected(participant) {
    var participant_div = document.createElement('div');
    participant_div.setAttribute('id', participant.sid);
    participant_div.setAttribute('class', 'participant');

    var tracks_div = document.createElement('div');
    participant_div.appendChild(tracks_div);

    var label_div = document.createElement('div');
    label_div.innerHTML = participant.identity;
    participant_div.appendChild(label_div);

    container.appendChild(participant_div);

    participant.tracks.forEach(publication => {
        if (publication.isSubscribed)
            trackSubscribed(tracks_div, publication.track);
    });
    participant.on('trackSubscribed', track => trackSubscribed(tracks_div, track));
    participant.on('trackUnsubscribed', trackUnsubscribed);

    updateParticipantCount();
};

function participantDisconnected(participant) {
    document.getElementById(participant.sid).remove();
    updateParticipantCount();
};

function trackSubscribed(div, track) {
    div.appendChild(track.attach());
};

function trackUnsubscribed(track) {
    track.detach().forEach(element => element.remove());
};

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

// add local video
addLocalVideo();
button.addEventListener('click', connectButtonHandler);

	
//call the list of THWs
$(".get_user_form").submit(function(e){
	// alert("Submitted");
	 
	 // the next two lines stop the function from being called twice
	e.preventDefault();
	e.stopPropagation();
	
	var form = $(this);
   	$.ajax({
        url: form.attr("action"),
        data: form.serialize(),
        type: form.attr("method"), // address the method in the view function called
        dataType: 'json',
        success: function (data) {
            if (data.form_is_valid) {
              $("#user-table tbody").html(data.html_user_thw_list); // go to table with id=user-table and fill its body with the fetched contents
            }
          },
   		error : function(response){
   			var a = response;
            alert("failed");
   			console.log(response)
   		}
   	})     	  	
});
// $("#modal-book").on("submit", ".get_user_form", function(e){
// $(".get_user_form").click(function(e){
// .unbind('submit')
 