import * as config from './config.js';

fetch(`${config.getConfig().base_url}ussd/transactions`, {
    method: 'POST',
    headers: {
     'Content-Type':'application/json',
     'Accept':'application/json'
 },
 body: JSON.stringify({})
}).then(res => res.json())
.then((response) => {
    console.log(response)
    if(response.status) {
        response.data.forEach((val, index) => {
                const sp = JSON.parse(val.spare_part);
                const vals = Object.keys(sp);
                let amount = 0;
                vals.forEach((tf) => {    
                    amount += parseFloat(sp[tf])
                })

            document.querySelector('#trd tbody').innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${val.claim_no}</td>
                <td>${val.full_name}</td>
                <td>${val.phone_number}</td>
                <td>${val.policy_no}</td>
                <td>${'₦' + amount}</td>
                <td>${val.status}</td>
                <td>View</td>
            </tr>
            `
        })
    }
})
.catch(err => console.log(err))