import * as constants from './constants.js';
import * as elements from './elements.js';

export const updatePersonalCode = (personalCode) => {
     document.querySelector('#personal_code').value = personalCode;
}

export const updateLocateVideo = (stream) => {
    const localVideo = document.querySelector('#real_local_video');
    localVideo.srcObject = stream;
    localVideo.addEventListener('loadedmetadata', () => {
        localVideo.play();
    })
}

export const showIncomingCallDialog = (callType, acceptedCallHandler, rejectCallHandler) => {
    const callTypeInfo = callType === constants.callType.VIDEO_PERSONAL_CODE ? 'Video' : 'Chat';
   const incomingCallDialog = elements.getIncomingCallDialog(callTypeInfo, acceptedCallHandler, rejectCallHandler);

     const dialog = document.querySelector('#dialog');
     dialog.querySelectorAll('*').forEach((dialog) => dialog.remove());

     dialog.appendChild(incomingCallDialog)
}

export const showCallingDialog = (rejectCallHandler) => {
     const callingDialog = elements.getCallingDialog(rejectCallHandler);

    const dialog = document.querySelector('#dialog');
     dialog.querySelectorAll('*').forEach((dialog) => dialog.remove());
     dialog.appendChild(callingDialog)
}

export const removeAllDialogs = () => {
    const dialog = document.querySelector('#dialog');
    dialog.querySelectorAll('*').forEach((dialog) => dialog.remove());
}

export const showInfoDialog = (preOfferAnswer) => {
    let infoDialog = null;
    if(preOfferAnswer === constants.preOfferAnswer.CALL_REJECTED) {
        infoDialog = elements.getInfoDialog('call reject', 'callee rejected your call')
    }

    if(preOfferAnswer === constants.preOfferAnswer.CALLEE_NOT_FOUND) {
        infoDialog = elements.getInfoDialog('callee not found', 'please check code')
    }

    if(preOfferAnswer === constants.preOfferAnswer.CALL_UNAVAILABLE) {
        infoDialog = elements.getInfoDialog('call is not possible', 'probably callee is busy, try again later')
    }

    if(infoDialog) {
        const dialog = document.querySelector('#dialog');
        dialog.appendChild(infoDialog);

        setTimeout(() => {
            removeAllDialogs();
        }, [4000])
    }

}

export const showCallElements = (callType) => {
    if(callType === constants.callType.VIDEO_PERSONAL_CODE) {
        showVideoCallElements()
    }
   
}

const showVideoCallElements = () => {

    const callButtons = document.querySelector('#call_buttons')
    showElement(callButtons)

   const remoteVideo = document.querySelector('#real_remote_video')
    showElement(remoteVideo);
}

const enableDashboard = () => {
    const dashboardBlocker = document.querySelector('#dashboard_blur');
    if(!dashboardBlocker.classList.contains('display_none')) {
        dashboardBlocker.classList.add('display_none');
    }
};

const disableDashboard = () => {
    const dashboardBlocker = document.querySelector('#dashboard_blur');
    if(dashboardBlocker.classList.contains('display_none')) {
        dashboardBlocker.classList.remove('display_none');
    }
}

const hideElement = (element) => {
    if(!element.classList.contains('display_none')) {
        element.classList.add('display_none')
    }
}

const showElement = (element) => {
    if(element.classList.contains('display_none')) {
        element.classList.add('display_none')
    }
}


export const updateRemoveVideo = (stream) => {
    const remoteVideo = document.querySelector('#real_remote_video');
    remoteVideo.srcObject = stream;
}