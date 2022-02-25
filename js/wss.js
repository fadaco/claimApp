import * as store from './store.js';
import * as ui from './ui.js';
import * as webRTCHandler from './webRTCHandler.js';
import * as constants from './constants.js';

let socketIO = null;

    export const registerSocketEvents = (socket) => {
        socketIO = socket;
        socket.emit('addUser', sessionStorage.getItem('staffid'))
        socket.on('getUser', (user) => {
            console.log('a user just join')
            const users = user.filter(us => us.id === sessionStorage.getItem('staffid'));
            if(users.length > 0) {
            store.setOnlineUsers(user);
            store.setSocketId(users[0].socketId)
            ui.updatePersonalCode(users[0].socketId)
            const remoteuser = user.filter(us => us.id !== sessionStorage.getItem('staffid'))
            console.log(remoteuser);
            if(remoteuser.length > 0) {
            document.querySelector('#remote_code').value = remoteuser[0].socketId;
            }
            }
        });

        socket.on('pre-offer', (data) => {
            console.log('coming back')
            webRTCHandler.handlePreOffer(data)
        })

        socket.on('pre-offer-answer', (data) => {
            console.log('ws: answering pre offer answer')
            webRTCHandler.handlePreOfferAnswer(data)
        })

        socket.on('webRTC-signaling', (data) => {
            console.log('switchhchchchc')
            console.log(data);
 
            switch(data.type) {
                case constants.webRTCSignaling.OFFER:
                    console.log('onnnnnnn')
                    webRTCHandler.handleWebRTCOffer(data)
                    break;
                case constants.webRTCSignaling.ANSWER:
                    console.log('ttttttt')
                    webRTCHandler.handleWebRTCAnswer(data)
                    break;
                case constants.webRTCSignaling.ICE_CANDIDATE:
                    console.log('ccccccc')
                    webRTCHandler.handleWebRTCCandidate(data);
                    break; 
                default:
                    return;
            }
        })
    }


export const sendPreOffer = (data) => {
    console.log('ws: sending pre offer ')
    socketIO.emit('pre-offer', data);
}

export const sendPreOfferAnswer = (data) => {
    console.log('ws: send answering pre offer ')

    socketIO.emit('pre-offer-answer', data);
}

export const sendDataUsingWebRTCSignaling = (data) => {
    socketIO.emit('webRTC-signaling', data);
}
