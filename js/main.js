import * as store from './store.js';
import * as wss from './wss.js';
import * as webRTCHandler from './webRTCHandler.js';
import * as constants from './constants.js';
import * as recordingUtils from './recordingUtils.js';
import * as ui from './ui.js';

//const socket = io("http://localhost:4000");
export const startApp = (cb) => {
    const socket = io("https://fast-forest-82655.herokuapp.com")

    wss.registerSocketEvents(socket);
    webRTCHandler.getLocalPreview();


    document.querySelector('#call_video')?.addEventListener('click', function(e){
        e.preventDefault()

        const calleePersonalCode = document.querySelector('#remote_code').value;
        const callType = constants.callType.VIDEO_PERSONAL_CODE;
        webRTCHandler.sendPreOffer(callType, calleePersonalCode)
        document.querySelectorAll('.call-container').forEach((evt) => {
            evt.classList.add('display_none')
        })

    });

    const startRecordingButton = document.querySelector('#start_recording_button');
    if(startRecordingButton) {
    startRecordingButton.addEventListener('click', () => {
        recordingUtils.startRecording();
        ui.showRecordingPanel();
    });
    }

    const stopRecordingButton = document.querySelector('#stop_recording_button');
    if(stopRecordingButton) {
    stopRecordingButton.addEventListener('click', () => {
        recordingUtils.stopRecording();
        ui.resetRecordingButtons();
    })
    }

    const hangUpButton = document.querySelector('#hang_up_button');
    if(hangUpButton) {
    hangUpButton.addEventListener('click', () => {
        webRTCHandler.handleHangUp();
    });
}

}

