let connected = false;

var username_host = document.getElementById('username_host');
var username_caller = document.getElementById('username_caller');
var username_callee = document.getElementById('username_callee');
var button_call_leave = document.getElementById('call_leave');
let user_name = username_host.textContent;
let room_name = username_caller.textContent + '_' + username_callee.textContent;
let room; 

//var container = document.getElementById('container_vid');
//var count = document.getElementById('count');
//const call_name = document.getElementById('call_name');
//const button_call_leave = document.getElementById('call_leave');
const container = document.getElementById('container_vid');
const count = document.getElementById('count');
let div_video = document.getElementById('local').firstChild;

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////


function connectButtonHandler(e) {	
    e.preventDefault();

    // had to recreate this on each dialog load, so as to 'reload' the variables
    // also had to initialize them as var instead of const
    button_call_leave = document.getElementById('call_leave')
    // count = document.getElementById('count');
    // div_video = document.getElementById('local').firstChild;


    if (!connected) {

	// // Instead of doing this, get [...room.localParticipant.videoTracks.values()][0].track and append after connect
        //Twilio.Video.createLocalVideoTrack().then(track => {
            // let div_video = document.getElementById('local').firstChild;
        //    div_video.appendChild(track.attach());
        //});
    	
        button_call_leave.disabled = true;
        button_call_leave.innerHTML = 'Connecting...';
        // connect(username_caller, username_callee).then(() => {
        connect(user_name, room_name).then(() => {
            button_call_leave.innerHTML = 'End Call';
            button_call_leave.disabled = false;
        }).catch(() => {
            alert('Connection failed. Is the backend running?');
            button_call_leave.innerHTML = 'Join Call';
            button_call_leave.disabled = false;    
        });
    }
    else {
        disconnect();
        button_call_leave.innerHTML = 'Join Call';
        connected = false;
    }
};

function disconnect() {  
    room.disconnect();  
    while (container.lastChild.id != 'local') { // remove all children of container div except for the video div
        container.removeChild(container.lastChild);   
    }
    while (div_video.hasChildNodes()) { // remove all children of the video div
    	div_video.removeChild(div_video.lastChild);
    }

    button_call_leave.innerHTML = 'Join Call';
    connected = false;
    updateParticipantCount();
};



function connect(user_name, room_name) {
    var promise = new Promise((resolve, reject) => {
        // get a token from the back end
        fetch('api/myuser/start_call/', {
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
            body: JSON.stringify({'user_name': user_name, 'room_name': room_name})
            // body: JSON.stringify({'username_caller': username_caller, 'username_callee': username_callee})
        }).then(res => res.json()).then(data => {
            // join video call
            return Twilio.Video.connect(data.token, {
		  audio: true,
		  name: room_name,
		  video: { /* video capture constraints */ },
		});
        }).then(_room => {
            room = _room;

	    // Get the camera track for your preview.
	    const cameraTrack = [...room.localParticipant.videoTracks.values()][0].track;
	    div_video.appendChild(cameraTrack.attach());

            room.participants.forEach(participantConnected);
            room.on('participantConnected', participantConnected);
            room.on('participantDisconnected', participantDisconnected);
            connected = true;
            updateParticipantCount();
            resolve();
        }).catch((err) => {
        	alert(err);
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

// add local video
// addLocalVideo();
//button_call_leave.addEventListener('click', connectButtonHandler);


//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
 