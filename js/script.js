import * as store from '../jsss/store.js';
import * as main from '../jsss/main.js';


document.querySelector('#thirdPartyLiability').addEventListener('change', function(e){
  console.log(e.target.checked)
})

var today = new Date();
var date = today.getDate() +'/'+(today.getMonth()+1)+'/'+ today.getFullYear();

document.querySelector('#dateNow').innerHTML = date;

let fullname;

var formData = new FormData();
formData.append('data', location.search.substring(location.search.indexOf('=') + 1, location.search.indexOf('&')).replaceAll('%20', ' '));  
console.log(location.search.substring(location.search.indexOf('=') + 1))
const claimno = location.search.substring(location.search.indexOf('=') + 1).replaceAll('%2F', '/');
console.log(claimno);
sessionStorage.setItem('staffid', claimno);



fetch(`https://fast-forest-82655.herokuapp.com/api/transaction`, {
  method: 'POST',
  headers: {
    'Content-Type':'application/json',
    'Accept':'application/json'
},
body: JSON.stringify({
  claim_no: claimno
})
})
.then((res) => res.json())
.then((data) => {
  console.log(data)
  if(data.status) {
    if(document.querySelector('.cont').classList.contains('hide-def')) {
      document.querySelector('.cont').classList.remove('hide-def')
      document.querySelector('.progress').classList.add('hide-def')
    }

    document.querySelector('.policyNo').innerHTML = data.data.policy_no;
    document.querySelector('.full_name').innerHTML = data.data.full_name;
    document.querySelector('.one-title').innerHTML = data.data.product_code;
    document.querySelector('.phone_no').innerHTML = data.data.phone_number
    document.querySelector('.plateNo').innerHTML = data.data.plate_no;
    document.querySelector('.policyPeriod').innerHTML = data.data.policy_period;
    document.querySelector('.engineNo').innerHTML = data.data.engine_no;
    document.querySelector('.sumInsured').innerHTML = 'N' + data.data.sum_insured;
    document.querySelector('.expiryDate').innerHTML = data.data.expiry_date;
    document.querySelector('.fom').innerHTML = data.data.frequency_of_payment;
    document.querySelector('.main-subtitle').innerHTML = claimno;
  }
})
.catch(err => {
  console.log(err)
  document.querySelector('.progress').classList.add('hide-def')
  document.querySelector('.errorMessage').classList.remove('hide-def')
})



      document.querySelector('#file').addEventListener('change', function() {
    for(let i = 0; i < this.files.length; i++) {
      let container = document.querySelector('#img-container');
    let img = document.createElement("img");
    img.style.width = img.style.height = '200px';
    
      img.onload = () => {
          URL.revokeObjectURL(img.src);  // no longer needed, free memory
      }
       img.src = URL.createObjectURL(this.files[i]); // set src to blob url
       container.appendChild(img);
    }
  
});

document.querySelector('#submitId').addEventListener('click', function(){
  //  console.log(document.querySelector('#agreementCheck').checked)
    if(document.querySelector('#agreementCheck').checked && document.querySelector('.descriptionLoss').value) {
        document.querySelector('.main-video-container').classList.remove('hide')
        document.querySelector('.pcodeContainer').classList.remove('hide')
        document.querySelector('.input-container').classList.remove('hide')
        document.querySelector('#img-container').classList.remove('hide')
        document.querySelector('.acceptContainer').classList.add('hide')

        fetch('https://fast-forest-82655.herokuapp.com/api/accept_liability', {
          method: 'POST',
          headers: {
            'Content-Type':'application/json',
            'Accept':'application/json'
        },
        body: JSON.stringify({
          claim_no: claimno,
          accept_liability: document.querySelector('#agreementCheck').checked,
          description_of_loss: document.querySelector('.descriptionLoss').value
        })
        }).then((res) => res.json())
        .then((resp) => {
          if(resp.status) {
             store.setSocketConnection(true);
              main.startApp();
          }
        })
        .catch((err) => console.log(err))

    } else {
      M.toast({html: `${document.querySelector('.full_name').innerHTML }, you have to accept the agreement to proceed`})
    }
});

