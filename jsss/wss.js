import * as store from './store.js';
import * as ui from './ui.js';
import * as webRTCHandler from './webRTCHandler.js';
import * as constants from './constants.js';

let socketIO = null;

    export const registerSocketEvents = (socket) => {
        socketIO = socket;
        socket.emit('addUser', localStorage.getItem('staffid'))
        socket.on('getUser', (user) => {
            const users = user.filter(us => us.id === localStorage.getItem('staffid'));
            if(users.length > 0) {
            store.setOnlineUsers(user);
            store.setSocketId(users[0].socketId)
            ui.updatePersonalCode(users[0].socketId)
            const remoteuser = user.filter(us => us.id !== localStorage.getItem('staffid'))
            console.log(remoteuser);
            if(remoteuser.length > 0) {
            document.querySelector('#remote_code').value = remoteuser[0].socketId;
            }
            }
        });
        // socket.on('connect', () => {
        //     store.setSocketId(socket.id)
        //     ui.updatePersonalCode(socket.id)
        // });

        socket.on('pre-offer', (data) => {
            console.log('coming back')
            console.log(data)
            webRTCHandler.handlePreOffer(data)
        })

        socket.on('pre-offer-answer', (data) => {
            webRTCHandler.handlePreOfferAnswer(data)
        })

        socket.on('webRTC-signaling', (data) => {
            switch(data.type) {
                case constants.webRTCSignaling.OFFER:
                    webRTCHandler.handleWebRTCOffer(data)
                    break;
                case constants.webRTCSignaling.ANSWER:
                    webRTCHandler.handleWebRTCAnswer(data)
                    break;
                case constants.webRTCSignaling.ICE_CANDIDATE:
                    webRTCHandler.handleWebRTCCandidate(data);
                    break; 
                default:
                    return;
            }
        })
    }


export const sendPreOffer = (data) => {
    socketIO.emit('pre-offer', data);
}

export const sendPreOfferAnswer = (data) => {
    console.log('sendinf.........')
    socketIO.emit('pre-offer-answer', data);
}

export const sendDataUsingWebRTCSignaling = (data) => {
    socketIO.emit('webRTC-signaling', data);
}
