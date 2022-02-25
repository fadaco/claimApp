import * as store from './store.js';
import * as wss from './wss.js';
import * as webRTCHandler from './webRTCHandler.js';
import * as constants from './constants.js';

//const socket = io('https://lit-bastion-91718.herokuapp.com');

export const startApp = () => {
//const socket = io("http://localhost:4000");
const socket = io("https://fast-forest-82655.herokuapp.com")

wss.registerSocketEvents(socket);
webRTCHandler.getLocalPreview();  

document.querySelector('#call_video').addEventListener('click', function(e){
    e.preventDefault()
    const calleePersonalCode = document.querySelector('#remote_code').value;
    const callType = constants.callType.VIDEO_PERSONAL_CODE;
    webRTCHandler.sendPreOffer(callType, calleePersonalCode)
});
}





