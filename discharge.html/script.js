import * as config from '../config.js';

let full_name;
let is_third_party;

var th_val = ['', 'thousand', 'million', 'billion', 'trillion'];
 
var dg_val = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
var tn_val = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
var tw_val = ['twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
function toWordsconver(s) {
  s = s.toString();
    s = s.replace(/[\, ]/g, '');
    if (s != parseFloat(s))
        return 'not a number ';
    var x_val = s.indexOf('.');
    if (x_val == -1)
        x_val = s.length;
    if (x_val > 15)
        return 'too big';
    var n_val = s.split('');
    var str_val = '';
    var sk_val = 0;
    for (var i = 0; i < x_val; i++) {
        if ((x_val - i) % 3 == 2) {
            if (n_val[i] == '1') {
                str_val += tn_val[Number(n_val[i + 1])] + ' ';
                i++;
                sk_val = 1;
            } else if (n_val[i] != 0) {
                str_val += tw_val[n_val[i] - 2] + ' ';
                sk_val = 1;
            }
        } else if (n_val[i] != 0) {
            str_val += dg_val[n_val[i]] + ' ';
            if ((x_val - i) % 3 == 0)
                str_val += 'hundred ';
            sk_val = 1;
        }
        if ((x_val - i) % 3 == 1) {
            if (sk_val)
                str_val += th_val[(x_val - i - 1) / 3] + ' ';
            sk_val = 0;
        }
    }
    if (x_val != s.length) {
        var y_val = s.length;
        str_val += 'point ';
        for (var i = x_val + 1; i < y_val; i++)
            str_val += dg_val[n_val[i]] + ' ';
    }
    return str_val.replace(/\s+/g, ' ');
}


var formData = new FormData();
formData.append('data', location.search.substr(location.search.indexOf('=') + 1).replaceAll('%20', ' ')); 
//console.log(location.search.substr(location.search.indexOf('=') + 1).replaceAll('%20', ' ')) 


document.querySelector('#useDigitalSignature').addEventListener('change', function(e){
  if(e.target.checked) {
    document.querySelector('.singature-s').classList.remove('hide')
    var canvas = document.getElementById("signature-pad");

function resizeCanvas() {
    var ratio = Math.max(window.devicePixelRatio || 1, 1);
    canvas.width = canvas.offsetWidth * ratio;
    canvas.height = canvas.offsetHeight * ratio;
    canvas.getContext("2d").scale(ratio, ratio);
}
window.onresize = resizeCanvas;
resizeCanvas();

var signaturePad = new SignaturePad(canvas, {
 backgroundColor: 'rgb(250,250,250)'
});

document.getElementById("clear").addEventListener('click', function(){
 signaturePad.clear();
})
  } else {
    document.querySelector('.singature-s').classList.add('hide')
  }
})


fetch(`${config.getConfig().base_url}offer/third_party`, {
    method: 'POST',
    headers: {
        'Content-Type':'application/json',
        'Accept':'application/json'
    },
    body: JSON.stringify({
      claim_no: location.search.substring(location.search.indexOf('=') + 1, location.search.indexOf('&')).replaceAll('%20', ' '),
      phone_number: location.search.substring(location.search.lastIndexOf('=') + 1)
    })
}).then(res => res.json())
.then(response => {
    if(response.status) {
        //
        console.log(response);

        const claim = response.data?.claims ? JSON.parse(response.data?.claims) : JSON.parse(response.data?.spare_part);
        document.querySelector('.insuredname').innerHTML = full_name = response?.data?.full_name;
        document.querySelector('.claimno').innerHTML = location.search.substring(location.search.indexOf('=') + 1, location.search.indexOf('&')).replaceAll('%20', ' ');
        document.querySelector('.dloss').innerHTML = response?.data?.createdAt;

        if(response.message === 'insured success') {
            is_third_party = false;
            document.querySelectorAll('p').forEach((evt) => {
                evt.classList.remove('hide');
            })

            document.querySelectorAll('strong').forEach((evt) => {
                evt.classList.remove('hide');
            })
            document.querySelectorAll('.policyno').forEach((evt) => {
               evt.innerHTML = response?.data?.policy_no;
            }) 
            
        } else {
            is_third_party = true;
        }
       if(claim){
           let amount = 0;
       const claimHeader = Object.keys(claim);
       claimHeader.forEach((ch) => {
            console.log(claim[ch])
              amount += parseFloat(claim[ch]);
           document.querySelector('.cheader').innerHTML += `
           <div class="main-cheader">
           <span class="cheaderp">${ch}:</span> <span>₦${claim[ch]}</span>
           </div>
           `;
       })

       document.querySelectorAll('.amountPayable').forEach((evt) => {
            evt.innerHTML = '₦' + amount;   
       })

       document.querySelector('.amountInWord').innerHTML = toWordsconver(amount) + 'naira only';
       
    }
    }
})
.catch(err => console.log(err))


document.querySelector('.reject-offer').addEventListener('click', function(){
    const data = {
        account_name: document.querySelector('.accountName').value || '',
        bank_name: document.querySelector('.accountBank').value || '',
        account_number: document.querySelector('.accountNumber').value || '',
        full_name: full_name,
        claim_no: location.search.substring(location.search.indexOf('=') + 1, location.search.indexOf('&')).replaceAll('%20', ' '),
        agreement: false,
        signature: document.querySelector('#signature-pad').toDataURL() ? document.querySelector('#signature-pad').toDataURL() : '',
        phone_number: location.search.substring(location.search.lastIndexOf('=') + 1),
        is_third_party: is_third_party
    }

    fetch(`${config.getConfig().base_url}accept_reject_offer`, {
        method: 'POST',
        headers: {
            'Content-Type':'application/json',
            'Accept':'application/json'
        },
        body: JSON.stringify(data)
    }).then((res) => res.json())
    .then((response) => {
        if(response.status) {
            //success
        }
    })
    .catch(err => console.log(err))
})


document.querySelector('.accept-offer').addEventListener('click', function(){
    
    if(document.querySelector('.accountName').value && document.querySelector('.accountBank').value && document.querySelector('.accountNumber').value) {
            if(document.querySelector('#acceptCheckbox').value){
                console.log(document.querySelector('#signature-pad').toDataURL());
                const data = {
                    account_name: document.querySelector('.accountName').value,
                    bank_name: document.querySelector('.accountBank').value,
                    account_number: document.querySelector('.accountNumber').value,
                    full_name: full_name,
                    claim_no: location.search.substring(location.search.indexOf('=') + 1, location.search.indexOf('&')).replaceAll('%20', ' '),
                    agreement: true,
                    signature: document.querySelector('#signature-pad').toDataURL() ? document.querySelector('#signature-pad').toDataURL() : '',
                    phone_number: location.search.substring(location.search.lastIndexOf('=') + 1),
                    is_third_party: is_third_party
                }

                console.log(data)
                fetch(`${config.getConfig().base_url}accept_reject_offer`, {
                    method: 'POST',
                    headers: {
                        'Content-Type':'application/json',
                        'Accept':'application/json'
                    },
                    body: JSON.stringify(data)
                }).then((res) => res.json())
                .then((response) => {
                    if(response.status) {
                        //success
                    }
                })
                .catch(err => console.log(err))

            } else {
                console.log('you must accept offer')
            }
    } else {
        console.log('error')
    }
})
