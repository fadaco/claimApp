var formData = new FormData();
formData.append('data', location.search.substr(location.search.indexOf('=') + 1).replaceAll('%20', ' '));  

fetch('http://41.75.199.82:82/fbnmobile/api/motorinsurance', {
            method: 'POST',
            body: formData
      }).then((res) => res.json()).then((data) => {
        if(data.code === '1') {
          const mydata = data.data
          document.querySelector('#policyNo').value = mydata.POLICY_NO;
          document.querySelector('#fullName').value = mydata.FULL_NAME;
          document.querySelector('#phoneNo').value = mydata.MOBILE_NO;
          document.querySelector('#plateNo').value = mydata.PLATE_NO;
          document.querySelector('#policyPeriod').value = mydata.POLICY_PERIOD;
          document.querySelector('#engineNo').value = mydata.ENIGINE_NO;
          document.querySelector('#sumInsured').value = mydata.SUM_INSURED;
          document.querySelector('#expiryDate').value = mydata.EXPIRY_DATE;
          document.querySelector('#frequencyOfPayment').value = mydata.FREQUENCY_OF_PAYMENT;


        }
      }).catch((e) => {
        console.log(e);
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

