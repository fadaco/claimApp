import * as store from './store.js';
import * as ui from './ui.js';
import * as webRTCHandler from './webRTCHandler.js';
import * as constants from './constants.js';
import * as config from '../config.js';

let socketIO = null;

    export const registerSocketEvents = (socket) => {
        socketIO = socket;
        socket.emit('addUser', sessionStorage.getItem('staffid'))
        socket.on('getUser', (user) => {
            const users = user.filter(us => us.id === sessionStorage.getItem('staffid'));
            if(users.length > 0) {
            store.setOnlineUsers(user);
            store.setSocketId(users[0].socketId)
            ui.updatePersonalCode(users[0].socketId)
            const remoteuser = user.filter(us => us.id !== sessionStorage.getItem('staffid'))
            store.setOnlineUsers(remoteuser)


          let staffid = sessionStorage.getItem('staffid');
            if(staffid.includes('fic')) {
                const checkIfUserIsActive = (params) => {
                   // const ou = store.getState().onlineUsers;
                    const tv = remoteuser.filter(is => is.id === params)
                    if(tv.length > 0) {
                        return 'Online'
                    } else {
                        return 'Offline'
                    }
                 }

                 document.querySelector('#rows') ? document.querySelector('#rows').innerHTML = '' : '';

                const data = {
                    fic: sessionStorage.getItem('staffid')
                }

                fetch(`${config.getConfig().base_url}ussd/fetch_transaction`, {
                    method: 'POST',
                    headers: {
                        'Content-Type':'application/json',
                        'Accept':'application/json'
                    },
                    body: JSON.stringify(data)
                }).then((res) => res.json())
                .then((data) => {
                    



                    if(data.status) {
                        if(data?.data.length > 0 && document.querySelector('#rows')) {
                        data?.data?.forEach((dt) => {
                            
                            document.querySelector('#rows').innerHTML += `
                            <div class="col s12 m6">
                            <div class="card">
                              <div class="card-content" style="padding: 12px">
                                <div class="container-p info-container divCont">
                                    <div class="main-prinary-text"><a href="./claim_detail.html?name=${dt.full_name}&claimNo=${dt.claim_no}">${dt.claim_no}</a></div>
                                    <div class="${checkIfUserIsActive(dt.claim_no) === 'Online' ? 'subtitle-title-2' : 'subtitle-title-5'} subtitle-title" style="color: #ffffff">${checkIfUserIsActive(dt.claim_no)}</div>
                                </div>
                                <div class="container-p info-container">
                                    <div class="textsub main-prinary-text">${dt.full_name}</div>
                                    <div class="textsub subtitle-title">${dt?.policy_no}</div>
                                </div>
                              </div>
                            </div>
                          </div>
                            `
                
                                })
                            }
                    }





                })
                .catch((err) => console.log(err))
                }

              









           // loadMyd.loadData();
            if(remoteuser.length > 0 && document.querySelector('#remote_code')) {   
            document.querySelector('#remote_code').value = remoteuser[0].socketId;
            }
            }
        });

        socket.on('pre-offer', (data) => {
            webRTCHandler.handlePreOffer(data)
        })

        socket.on('pre-offer-answer', (data) => {
            webRTCHandler.handlePreOfferAnswer(data)
        })

        socket.on('user-hanged-up', () => {
            webRTCHandler.handleConnectedUserHangedUp()
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

    socketIO.emit('pre-offer-answer', data);
}

export const sendDataUsingWebRTCSignaling = (data) => {
    socketIO.emit('webRTC-signaling', data);
}

export const sendUserHangedUp = (data) => {
    socketIO.emit('user-hanged-up', data);
}
