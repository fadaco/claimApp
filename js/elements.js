export const getIncomingCallDialog = (callTypeInfo, acceptCallHandler, rejectCallHandler) => {
    const dialog = document.createElement('div')
    dialog.classList.add('dialog_wrappers');
    const dialogContent = document.createElement('div')
    dialogContent.classList.add('dialog_content');
    dialog.appendChild(dialogContent)
    const title = document.createElement('p');
    title.classList.add('para-1')
    title.innerHTML = `Incoming ${callTypeInfo} Call...`;

    const buttonContainer = document.createElement('div')
    buttonContainer.classList.add('container-call-div')

    const acceptCallButton = document.createElement('div');
    acceptCallButton.classList.add('btns')
  //  acceptCallButton.classList.add('btn-success')
    acceptCallButton.innerHTML = ` <div class="call-container" id="call_video">
    <ion-icon name="call"></ion-icon>
</div>`;
    buttonContainer.appendChild(acceptCallButton)


    const rejectCallButton = document.createElement('div');
    rejectCallButton.classList.add('btns')
  //  rejectCallButton.classList.add('btn-danger')
    rejectCallButton.innerHTML = `<div class="call-container-stop">
    <ion-icon name="stop"></ion-icon>
</div>`;
    buttonContainer.appendChild(rejectCallButton)

    dialogContent.appendChild(title)
    dialogContent.appendChild(buttonContainer)

    acceptCallButton.addEventListener('click', function(e){
        e.preventDefault();
        acceptCallHandler()
    })

    rejectCallButton.addEventListener('click', function(e){
        e.preventDefault();
        rejectCallHandler()
    })

    return dialog;
}

export const getCallingDialog = (rejectCallHandler) => {
    const dialog = document.createElement('div')
    dialog.classList.add('dialog_wrappers');
    const dialogContent = document.createElement('div')
    dialogContent.classList.add('dialog_content');
    dialog.appendChild(dialogContent)
    const title = document.createElement('p');
    title.classList.add('para-1')

    title.innerHTML = `Calling...`;

    const buttonContainer = document.createElement('div')

    const hangUpCallButton = document.createElement('div');
    hangUpCallButton.classList.add('btns')
   // hangUpCallButton.classList.add('btn-danger')
    hangUpCallButton.innerHTML =  `<div class="call-container-other">
    <ion-icon name="stop"></ion-icon>
</div>`;
    buttonContainer.appendChild(hangUpCallButton)

    dialogContent.appendChild(title)
    dialogContent.appendChild(buttonContainer)

    return dialog;
}


export const getInfoDialog = (dialogTitle, dialogDescription) => {
    const dialog = document.createElement('div')
    dialog.classList.add('dialog_wrappers');
    const dialogContent = document.createElement('div')
    dialogContent.classList.add('dialog_content');
    dialog.appendChild(dialogContent)
    const title = document.createElement('p');
    title.innerHTML = `${dialogTitle}`;

    const description = document.createElement('p');
    description.innerHTML = `${dialogDescription}`
    dialogContent.appendChild(title)
    dialogContent.appendChild(description)

    return dialog;

}