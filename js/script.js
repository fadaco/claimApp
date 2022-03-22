import * as store from './store.js';
import * as main from './main.js';
import * as config from '../config.js';


document.querySelector('#thirdPartyLiability').addEventListener('change', function(e){
  document.querySelector('.thirdPLiability').innerHTML = ''
  if(e.target.checked) {
    document.querySelector('#chooseOptionContainer').classList.remove('hide')
  } else {
    document.querySelector('#chooseOptionContainer').classList.add('hide')
  }
})


document.addEventListener('change', function(e){
 if(e.target.classList.contains('optionChoose')) {
  document.querySelector('.thirdPLiability').innerHTML = '';
  console.log(e.target.value);
  for(let i = 0; i < parseInt(e.target.value); i++) {
  document.querySelector('.thirdPLiability').innerHTML += `
  <div class="thirdPartyLiabilityContainer">
    <div class="input-field col s12">
      <input type="text" class="fullName materialize-textarea">
      <label for="fullName">Full Name</label>
    </div>
    <div class="input-field col s12">
      <input type="text" class="thirdPartyEmail materialize-textarea">
      <label for="thirdPartyEmail">Email</label>
    </div>
    <div class="input-field col s12">
      <input type="text" class="thirdPartyPhone materialize-textarea">
      <label for="thirdPartyPhone">Phone</label>
    </div>
  </div>
  `;
  }
}
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



fetch(`${config.getConfig().base_url}transaction`, {
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
  console.log('dfjfjjf')
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

    if(data.data.description_of_loss) {
      console.log('assert')
document.querySelector('.main-video-container').classList.remove('hide')
    document.querySelector('.pcodeContainer').classList.remove('hide')
    document.querySelector('.input-container').classList.remove('hide')
    document.querySelector('#img-container').classList.remove('hide')
    document.querySelectorAll('.acceptContainer').forEach(evt => {
      console.log(evt);
      evt.classList.add('hide')
     // evt.target.classList.add('hide')
    })
      document.querySelector('#submitId').innerHTML = 'Submit';
      main.startApp();
    } 
    
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

let errorCheck = false;

document.querySelector('#submitId').addEventListener('click', function(){
  const data = []
  if(document.querySelector('#thirdPartyLiability').checked) {
   
    document.querySelectorAll('.fullName').forEach((evt, index)=> {
      console.log(evt.value)
      if(evt.value) {
      data[index] = {
        ...data[index],
        full_name: evt.value
      }
    }
    })

    document.querySelectorAll('.thirdPartyEmail').forEach((evt, index)=> {
      console.log(evt.value)
      if(evt.value) {
      data[index] = {
        ...data[index],
        email: evt.value
      }
    }
    })
    
    document.querySelectorAll('.thirdPartyPhone').forEach((evt, index)=> {
      console.log(evt.value)
      if(evt.value) {
      data[index] = {
        ...data[index],
        phone: evt.value
      }
    }
    })

  }
    if(document.querySelector('#agreementCheck').checked && document.querySelector('.descriptionLoss').value || (document.querySelector('#thirdPartyLiability').checked || data.length > 0)) {
      document.querySelector('#submitId').innerHTML = 'Please Wait...'
      

        data.forEach((dt) => {
          if(!dt.full_name || !dt.email || !dt.phone) {
            errorCheck = true;
          }
        })

        if(!errorCheck) {

       

        console.log({
             claim_no: claimno,
             accept_liability: document.querySelector('#agreementCheck').checked,
             description_of_loss: document.querySelector('.descriptionLoss').value,
             third_party: document.querySelector('#thirdPartyLiability').checked,
             third_party_data: data
           });

        
        fetch(`${config.getConfig().base_url}accept_liability`, {
           method: 'POST',
           headers: {
             'Content-Type':'application/json',
             'Accept':'application/json'
         },
         body: JSON.stringify({
           claim_no: claimno,
           accept_liability: document.querySelector('#agreementCheck').checked,
           description_of_loss: document.querySelector('.descriptionLoss').value,
           third_party: document.querySelector('#thirdPartyLiability').checked,
           third_party_data: data
         })
         }).then((res) => res.json())
         .then((resp) => {
           console.log(resp);
           if(resp.status) {
         document.querySelector('.main-video-container').classList.remove('hide')
        document.querySelector('.pcodeContainer').classList.remove('hide')
        document.querySelector('.input-container').classList.remove('hide')
        document.querySelector('#img-container').classList.remove('hide')
        document.querySelectorAll('.acceptContainer').forEach(evt => {
          console.log(evt);
          evt.classList.add('hide')
         // evt.target.classList.add('hide')
        })
          document.querySelector('#submitId').innerHTML = 'Submit'
          //  store.setSocketConnection(true);
             main.startApp();
           }
         })
         .catch((err) => {
          document.querySelector('#submitId').innerHTML = 'Submit'  
        console.log(err)})

      } else {
        M.toast({html: 'All the field are required'})
      }

    } else {
      M.toast({html: `${document.querySelector('.full_name').innerHTML }, you have to accept the agreement to proceed`})
    }
});

