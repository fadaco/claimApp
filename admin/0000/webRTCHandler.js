import * as wss from './wss.js';
import * as constants from './constants.js'; 
import * as ui from './ui.js';
import * as store from './store.js';

let connectedUserDetails;
let peerConnection;
const defaultConstraints = {
    audio: true,
    video: true
}

const configuration = {
    iceServers: [
        {
            urls: 'stun:stun.1.google.com:13902'
        }
    ]
}

export const getLocalPreview = () => {
    navigator.mediaDevices.getUserMedia(defaultConstraints)
    .then((stream) => {
        ui.updateLocateVideo(stream);
        store.setLocalStream(stream);
    }).catch((err) => console.log('error occured when trying to get an access to camera ' + err))
}

const createPeerConnection = () => {
    console.log('fucking!!!!')
    peerConnection = new RTCPeerConnection(configuration);
    peerConnection.onicecandidate = (event) => {
        console.log(event);
        console.log('getting ice candition from stun server!!!111111')
        if(event.candidate) {
            //send ice canditate to peer
            wss.sendDataUsingWebRTCSignaling({
                connectedUserSocketId: connectedUserDetails.socketId,
                type: constants.webRTCSignaling.ICE_CANDIDATE,
                candidate: event.candidate,
            })
        }
    }

    peerConnection.onconnectionstatechange = (event) => {
        if(peerConnection.connectionState === 'connected') {
            console.log('connected to other peers')
        }
    }


    //receiving track
    const remoteStream = new MediaStream();
    store.setRemoteStream(remoteStream);
    ui.updateRemoveVideo(remoteStream);

    peerConnection.ontrack = (event) => {
        remoteStream.addTrack(event.track);
    }

    //add our stream
    if(connectedUserDetails.callType === constants.callType.VIDEO_PERSONAL_CODE) {
        const localStream = store.getState().localStream;

        for(const track of localStream.getTracks()) {
            peerConnection.addTrack(track, localStream);
        }
    }


}

export const sendPreOffer = (callType, calleePersonalCode) => {

    connectedUserDetails = {
        callType,
        socketId: calleePersonalCode
    }

    if(callType === constants.callType.VIDEO_PERSONAL_CODE) {
        const data = {
            callType,
            calleePersonalCode
        }
        ui.showCallingDialog(callingDialogRejectCallHandler)
        wss.sendPreOffer(data);

    }

   

}

export const handlePreOffer = (data) => {
    const {callType, callerSocketId} = data;
    connectedUserDetails = {
        socketId: callerSocketId,
        callType
    }

    if(callType === constants.callType.VIDEO_PERSONAL_CODE) {
        ui.showIncomingCallDialog(callType, acceptCallHandler, rejectCallHandler)
    }
}

const acceptCallHandler = () => {
    console.log('call accpeted on the other side')
    createPeerConnection()
    sendPreOfferAnswer(constants.preOfferAnswer.CALL_ACCEPTED)
    ui.showCallElements(connectedUserDetails.callType)
    console.log('olaaaa')

}

const rejectCallHandler = () => {
    sendPreOfferAnswer(constants.preOfferAnswer.CALL_REJECTED);
}

const callingDialogRejectCallHandler = () => {
    console.log('don want again');
}

const sendPreOfferAnswer = (preOfferAnswer) => {
    const data = {
        callerSocketId: connectedUserDetails.socketId,
        preOfferAnswer
    }
    ui.removeAllDialogs();
    wss.sendPreOfferAnswer(data)
}

export const handlePreOfferAnswer = (data) => {
    const {preOfferAnswer} = data;
     ui.removeAllDialogs();

    if(preOfferAnswer === constants.preOfferAnswer.CALLEE_NOT_FOUND) {
            //show dialog not found
            ui.showInfoDialog(preOfferAnswer);
    }

    if(preOfferAnswer === constants.preOfferAnswer.CALL_UNAVAILABLE) {
        // UNAVAIlabel user
        ui.showInfoDialog(preOfferAnswer);
    }

    if(preOfferAnswer === constants.preOfferAnswer.CALL_REJECTED) {
        //CALL rejected
        ui.showInfoDialog(preOfferAnswer);
    }

    if(preOfferAnswer === constants.preOfferAnswer.CALL_ACCEPTED) {
        //ACCPETED
        ui.showCallElements(connectedUserDetails.callType)
        createPeerConnection();
        sendWebRTCOffer();
    }
}

const sendWebRTCOffer = async () => {
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    wss.sendDataUsingWebRTCSignaling({
        connectedUserSocketId: connectedUserDetails.socketId,
        type: constants.webRTCSignaling.OFFER,
        offer
    })
}

export const handleWebRTCOffer = async(data) => {
    console.log('webrtc offer came')
    console.log(data)
    await peerConnection.setRemoteDescription(data.offer);
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    wss.sendDataUsingWebRTCSignaling({
        connectedUserSocketId: connectedUserDetails.socketId,
        type: constants.webRTCSignaling.ANSWER,
        answer
    })
}

export const handleWebRTCAnswer = async (data) => {
    console.log('handling webtc anser')
    console.log(data)
    await peerConnection.setRemoteDescription(data.answer)
}

export const handleWebRTCCandidate = async (data) => {
    console.log('handing incommming')
    try {
        await peerConnection.addIceCandidate(data.candidate);
    } catch(err) {
        console.log("error occured when trying to add received ice candtion",  err)
    }
}
