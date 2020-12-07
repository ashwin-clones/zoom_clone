

const socket = io('/');

const videoHtml = document.getElementById('video-grid');

const myVideo = document.createElement('video');
myVideo.muted = true

const peer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '443'
});

let myVideoStream;

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    myVideoStream = stream;
    videoStream(myVideo, stream)

    peer.on('call', call => {
        call.answer(stream);
        const video = document.createElement('video');
        call.on('stream', userStream => {
            videoStream(video, userStream);
        })
    })
    socket.on('user_connected', (userId) => {
        connectToUser(userId, stream);
    })
})


peer.on('open', id => {
    socket.emit('join_room', room_id, id)
    console.log(id)

})




const connectToUser = (userId, stream) => {
    const call = peer.call(userId, stream);
    const video = document.createElement('video');
    call.on('stream', userStream => {
        videoStream(video, userStream);
    })
}

const videoStream = (vid, stream) => {
    vid.srcObject = stream;
    vid.addEventListener('loadedmetadata', () => {
        vid.play();
    })
    videoHtml.append(vid);
}


const msg = $('input')

$('html').keydown(e => {
    if (e.which === 13 && msg.val().length !== 0) {
        console.log(msg.val())
        socket.emit('message', msg.val());
        msg.val('')
    }
})

socket.on('createMsg', message => {
    $('ul').append(`<li class="message"><b>user</b><br>${message}</li>`)
    scrollToBottom();
})

const scrollToBottom = () => {
    const chat_h = $('.main__chat_window');
    chat_h.scrollTop(chat_h.prop('scrollHeight'))
}



const muteUnmute = () => {
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if (enabled) {
        myVideoStream.getAudioTracks()[0].enabled = false;
        setUnmuteButton();
    } else {
        setMuteButton();
        myVideoStream.getAudioTracks()[0].enabled = true;
    }
}

const playStop = () => {
    let enabled = myVideoStream.getVideoTracks()[0].enabled;
    if (enabled) {
      myVideoStream.getVideoTracks()[0].enabled = false;
      setPlayVideo()
    } else {
      setStopVideo()
      myVideoStream.getVideoTracks()[0].enabled = true;
    }
  }

const setMuteButton = () => {
    const html = `
      <i class="fas fa-microphone"></i>
      <span>Mute</span>
    `
    document.querySelector('.main__mute_button').innerHTML = html;
}

const setUnmuteButton = () => {
    const html = `
      <i class="unmute fas fa-microphone-slash"></i>
      <span>Unmute</span>
    `
    document.querySelector('.main__mute_button').innerHTML = html;
}

const setStopVideo = () => {
    const html = `
      <i class="fas fa-video"></i>
      <span>Stop Video</span>
    `
    document.querySelector('.main__video_button').innerHTML = html;
  }
  
  const setPlayVideo = () => {
    const html = `
    <i class="stop fas fa-video-slash"></i>
      <span>Play Video</span>
    `
    document.querySelector('.main__video_button').innerHTML = html;
  }