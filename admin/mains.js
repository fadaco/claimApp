//localStorage.getItem('sta')
const staff_id = 'FIC00374';
let cars = [{
    id: 1, name: 'BMW'},
   {id: 2, name: 'Toyota'},
   {id: 3, name: 'Honda'},
   {id: 4, name: 'Mercedes Benz'},
   {id: 5, name: 'Lexus'},
]
let sparePart = [{
    id: 1,
    name: 'Battery',
    amount: 4000,
    car: 'bmw',
}, {
    id: 2,
    name: 'Side Mirror',
    amount: 4000,
    car: 'toyota',
}, {
    id: 3,
    name: 'Windscreen',
    amount: 4000,
    car: 'Honda',
},  {
    id: 4,
    name: 'Windscreen',
    amount: 4000,
    car: 'lexus',
},
{
    id: 5,
    name: 'gear',
    amount: 4000,
    car: 'bmw',
}, {
    id: 6,
    name: 'tyres',
    amount: 4000,
    car: 'Mercedes Benz',
}] 

let claimDetails = [];

document.querySelector('#loginToPortal')?.addEventListener('click', function(){
    if(document.querySelector('#ficNo').value === '') {
        M.toast({html: 'Enter your email to procceed..'})
    } else {
        
        fetch('https://fast-forest-82655.herokuapp.com/api/verify_user', {
            method: 'POST',
            headers: {
                'Content-Type':'application/json',
                'Accept':'application/json'
            },
            body: JSON.stringify({
                username: document.querySelector('#ficNo').value.toLowerCase()
            })

        }).then((res) => res.json())
        .then((response) => {
            if(response.status) {
                sessionStorage.setItem('staffid', response?.data?.username)

                setTimeout(() => {
                    window.location.reload();
                }, 2000)    
            } else {
                M.toast({html: `${response.message}...`})
            }
        })
        .catch((err) => console.log('eeee'))
    }
})
 

document.querySelector('#addItem')?.addEventListener('click', function(){
    if(document.querySelector('#part').value && document.querySelector('#part_amount').value && document.querySelector('#claim_type').value){
        const data = {
            part: document.querySelector('#part').value,
            price_amount: document.querySelector('#part_amount').value,
            type: document.querySelector('#claim_type').value
        }
    
        
        claimDetails.push(data);
            document.querySelector('#table tbody').innerHTML += `
            <tr>
            <td>${data.part}</td>
            <td>${'N' + data.price_amount}</td>
            <td>${data.type}</td>
            <td><ion-icon name="trash-outline" class="delete-row"></ion-icon>
            </td>
          </tr>
            `;
    
            let existNumber = parseFloat(document.querySelector('#amount').innerHTML)
            let addExist = parseFloat(data.price_amount);
            existNumber = existNumber + addExist;
            document.querySelector('#amount').innerHTML = existNumber;
    
    
    
        document.querySelector('#part').value = document.querySelector('#part_amount').value = document.querySelector('#claim_type').value = '';
    } else {
        M.toast({html: 'part, amount and type cannot be empty'})
    }
   
})

document.addEventListener('click', function(e){
    if(e.target.classList.contains('delete-row')) {
        e.target.parentElement.parentElement.remove()
    }
})

document.querySelector('#searchForPrice')?.addEventListener('keyup', function(e) {
        console.log(e.target.value.length)
        if(e.target.value.length > 3) {
            let spd = sparePart.filter((sp) => sp.name.toLowerCase() === e.target.value.toLowerCase())
            console.log(spd);
            console.log(spd)
            if(spd.length > 0) {
                spd.forEach((sc) => {
                    document.querySelector('#query_results').innerHTML += `<div class="chip">
                    ${sc.name}-${'N' + sc.amount}-${sc.car}</div>`;
                })
            } else {
                document.querySelector('#query_results').innerHTML = '';
            }
           
        } else if(e.target.value.length === 3 && e.target.value.length > 0) {
            document.querySelector('#query_results').innerHTML = 'searching...';
        }else {
            document.querySelector('#query_results').innerHTML = '';
        }
});

const data = {
    fic: sessionStorage.getItem('staffid')
}

fetch('https://fast-forest-82655.herokuapp.com/api/ussd/fetch_transaction', {
    method: 'POST',
    headers: {
        'Content-Type':'application/json',
        'Accept':'application/json'
    },
    body: JSON.stringify(data)
}).then((res) => res.json())
.then((data) => {
    if(data.status) {
        data.data.forEach((dt) => {
            
            document.querySelector('#rows').innerHTML += `
            <div class="col s12 m6">
            <div class="card">
              <div class="card-content" style="padding: 12px">
                <div class="container-p info-container divCont">
                    <div class="main-prinary-text"><a href="./claim_detail.html?name=${dt.full_name}&claimNo=${dt.claim_no}">${dt.claim_no}</a></div>
                    <div class="subtitle-title-2 subtitle-title" style="color: #ffffff">Active</div>
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
})
.catch((err) => console.log(err))


document.querySelector('#spare-part-header')?.addEventListener('change', function(e){
    document.querySelector('.radio-container').innerHTML  = '';
    const value = e.target.value.toLowerCase();
    const newP = sparePart.filter((val) => val.car.toLowerCase() === value)
    newP.forEach((ps, index) => {
        document.querySelector('.radio-container').innerHTML += `<p>
        <label>
          <input name="group-${index}" attr-amount="${ps.amount}" attr-name="${ps.name}" type="checkbox" class="filled-in pat"/>
          <span>${ps.name} ${'₦' + ps.amount}</span>
        </label>
      </p>`
    })
})

document.querySelector('#spare-part-header-tp')?.addEventListener('change', function(e){
    document.querySelector('.radio-container-tp').innerHTML  = '';
    const value = e.target.value.toLowerCase();
    const newP = sparePart.filter((val) => val.car.toLowerCase() === value)
    newP.forEach((ps, index) => {
        document.querySelector('.radio-container-tp').innerHTML += `<p>
        <label>
          <input name="group-${index}" attr-amount="${ps.amount}" attr-name="${ps.name}" type="checkbox"  class="filled-in pat-tp"/>
          <span>${ps.name} ${'₦' + ps.amount}</span>
        </label>
      </p>`
    })

})

document.querySelector('#insured')?.addEventListener('change', function(){
    this.checked ? document.querySelector('.insured-select').classList.remove('hide') : document.querySelector('.insured-select').classList.add('hide')  
})

document.querySelector('#third-party')?.addEventListener('change', function(){
   this.checked ? document.querySelector('.third-party-select').classList.remove('hide') : document.querySelector('.third-party-select').classList.add('hide')
})

document.addEventListener('click',function(e){
    if(e.target && e.target.className== 'filled-in pat'){
          if(e.target.checked) {
              let existNumber = parseFloat(document.querySelector('#amount').innerHTML)
              let addExist = parseFloat(e.target.getAttribute('attr-amount'));
              existNumber = existNumber + addExist;
              document.querySelector('#amount').innerHTML = existNumber;
          } else {
            let existNumber = parseFloat(document.querySelector('#amount').innerHTML)
            let addExist = parseFloat(e.target.getAttribute('attr-amount'));
            existNumber = existNumber - addExist;
            document.querySelector('#amount').innerHTML = existNumber;
          }
     }
 });

 document.addEventListener('click',function(e){
    if(e.target && e.target.className== 'filled-in pat-tp'){
          if(e.target.checked) {
              let existNumber = parseFloat(document.querySelector('#amount').innerHTML)
              let addExist = parseFloat(e.target.getAttribute('attr-amount'));
              existNumber = existNumber + addExist;
              document.querySelector('#amount').innerHTML = existNumber;
          } else {
            let existNumber = parseFloat(document.querySelector('#amount').innerHTML)
            let addExist = parseFloat(e.target.getAttribute('attr-amount'));
            existNumber = existNumber - addExist;
            document.querySelector('#amount').innerHTML = existNumber;
          }
     }
 });


document.querySelector('#submit-data')?.addEventListener('click', function(){
    console.log(claimDetails);
    M.toast({html: 'Offer Successfully Sent'})

})





document.querySelector('#iconClick')?.addEventListener('click', function(){
    history.back();
})

cars.forEach((car) => {
    var option = document.createElement("option");
    option.text = car.name;
    option.value = car.name;
    document.querySelector('.spare_part_select')?.appendChild(option)
})

cars.forEach((car) => {
    var option = document.createElement("option");
    option.text = car.name;
    option.value = car.name;
    document.querySelector('.spare_part_select-tp')?.appendChild(option)
})



fetch(`https://fbngi-ecosystem.com/Apps/Test/ePortal/testApi/fetchUssd.php?staff_id=${staff_id}`)
.then((res)=> res.json())
.then((data) => {
    //
})
.catch((error) => console.log(error))

document.querySelector('.button_spart_part')?.addEventListener('click', function(){
    const spare_part_name = document.querySelector('#spare_part_name').value;
    const spare_part_number = document.querySelector('#spare_part_number').value;

    var formData = new FormData();
    formData.append('name', spare_part_name); 
    formData.append('amount', spare_part_number);

    fetch('https://fbngi-ecosystem.com/Apps/Test/ePortal/testApi/crudSparepart.php', {
        method: 'POST',
        body: formData
    }).then((res) => res.json())
    .then((data) => {
        console.log(data);
    }).catch((error) => {
        console.log(error);
    })

})


if(sessionStorage.getItem('staffid')) {
    document.querySelector('.main-cont-s')?.classList.remove('hide')
    document.querySelector('.main-login')?.classList.add('hide')
} else {
    document.querySelector('.main-cont-s')?.classList.add('hide')
    document.querySelector('.main-login')?.classList.remove('hide')
}




document.querySelector('.claimgenno') ? document.querySelector('.claimgenno').innerHTML = location.search.substring(location.search.lastIndexOf('=') + 1) : null;
document.querySelector('#namess') ? document.querySelector('#namess').innerHTML = location.search.substring(location.search.indexOf('=') + 1, location.search.indexOf('&')).replaceAll('%20', ' ') : null;
