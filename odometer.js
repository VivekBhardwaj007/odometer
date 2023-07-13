/* ************************************
  @Author - Vivek Bhardwaj
  @Email - 
  @Date - 12/07/2023
  @Version - v1
  Custom Odometer works in 2 types - 
    1. Automatically Generate random Number and Show on Svcreen
    2. Show number when func will get from you.
*/
var customOdometer = (function({selected_odometer, number_generation_duration, animation_time, initial_number, last_number, single_counter_number, include_initial_count, include_last_count, seperator, seperator_position, custom_id, checkViewport}) {
  let generated_numbers = [],
  initial_count = +initial_number || 0,
  last_count = +last_number || 0,
  single_counter_count = +single_counter_number || 0,
  odometer_selection = selected_odometer && selected_odometer.toLowerCase() || 'auto',
  random_number_generation_duration = number_generation_duration || 3000,
  animation_timer = animation_time || 1,
  inclusion_number = {
      'initial': include_initial_count || false,
      'last': include_last_count || false
  },
  seperator_sign = seperator || ',',
  seperator_position_number = seperator_position || {},
  checkIsInViewport = checkViewport || false;


  // START : Throw Any Error
    function throwError(message){
      const styles = [
        'color: white',
        'background: red',
        'font-size: 16px',
        'border: 1px solid yellow',
        'text-shadow: 2px 2px black',
        'padding: 5px',
      ].join(';');
      console.log('%c' + message, styles);
    }
  // END : Throw Any Error

  // START : Checking Custom Id is available or not
  if(!custom_id){
    throwError('Please provide the Custom id to initiate the Odometer!');
    return;
  }
  // END : Checking Custom Id is available or not
  
  // START : Checking Odometer is 'AUTO' Selected and Initial or last value digit count is not same
  if(odometer_selection === 'auto' && initial_count.toString().length !== last_count.toString().length){
    throwError('Please provide the same count of digits to Start the Odometer');
    return;
  }
  // END : Checking Odometer is 'AUTO' Selected and Initial or last value digit count is not same

  // Getting Element Info For Custom ID
  const odometer = document.getElementById(custom_id);
  
  // START : Number generation
  // For Minimum and Maximum value, it check Inclusion of user values or not
  // after that it will generate random number between minimum and maximum value
  function numberGeneration(min, max){
      min = inclusion_number.initial ? min-1 : min+1;
      max = inclusion_number.last ? max+1 : max;
      generated_numbers = toArray(Math.floor(Math.random() * (max - min)) + min);
  }
  // END : Number generation

  // START : Only Works for Signle Selction of odometer
  // Coverting value into array
  function setSingleNumber(min){
      generated_numbers = toArray(min);
  }
  // END : Only Works for Signle Selction of odometer
  
  // START : toArray function for conversion
  function toArray(number){
      return (number).toString().split('');
  }
  // END : toArray function for conversion

  // START : To check element is in Viewport or not
  function isElementInViewport() {
    // getting element value of custom id
    const element = document.getElementById(custom_id);
    var rect = element.getBoundingClientRect();
    // returning true and false as per condition
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }
  // END : To check element is in Viewport or not
  
  // START : To show value of odometer on Screen
  function showCounterValue(value, key){
    let isInViewport = selected_odometer == 'single' && checkIsInViewport ? isElementInViewport() : true;
    if(isInViewport){
      // Getting Client Height of counter number
      var clientHeight = document.querySelector(`#${custom_id} #counter-number-${key}`).clientHeight;
      // Getting value of DIV inside the counter digit
      let updateStyle = document.querySelectorAll(`#${custom_id} .counter-digit-${key} div`);
      // Loop for update the value which is shown to user on screen
      for (let i = 0; i < updateStyle.length; i++) {
        // Updating style of translate
        updateStyle[i].style.transform = 'translate(' + 0 + ',' + -(+clientHeight * +value) + 'px)';
        // Updating Animation time as per user given
        updateStyle[i].style.transition = 'all '+animation_timer+'s ease';
      }
    }
  }
  // END : To show value of odometer on Screen
  
  // START : Set Intial Number when function called first time
  function setInitialNumber(){
    // Checking Selected odometer value
    switch(odometer_selection){
      // Case 'AUTO
        case 'auto':
            numberGeneration(initial_count, last_count);
        break;

      // case 'SINGLE'
        case 'single':
            setSingleNumber(single_counter_count);
        break;
    }
    // Loop for generated number
    for (let i = 0; i < generated_numbers.length; i++) {
      // Creating a Div element
        var div = document.createElement('div');
        // setting dynamic Class name
        div.className = `counter-digit-${i} count-digit`;
        // setting dynamic id
        div.id = `counter-number-${i}`;
        // setting custom attribute value
        div.dataset.number = generated_numbers[i];
        // setting custom attribute key
        div.dataset.key = i;
        // setting  inner HTML
        div.innerHTML = "<div><span>0</span><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span><span>8</span><span>9</span></div>"
        // appending all things to Custom_id
        odometer.appendChild(div);

        // Checking ifseperator is available or not
        if(!!Object.keys(seperator_position_number).length && seperator_position_number[i]){
          // Creating span for seperator
          var span  = document.createElement('span');
          // Setting class 'seperator'
          span.className = 'seperator',
          // setting sign of seperator give by user
          span.innerHTML = seperator_sign;
          // append things to odo meter
          odometer.appendChild(span);
        }
        // Updating style and Showing value to Usr on Screen
        showCounterValue(generated_numbers[i], i);
    }
  }
  // END : Set Intial Number when function called first time
  
  // START : Initail checking for Custom id has any child node or not
  if(!odometer.hasChildNodes()){
      setInitialNumber();
  }
  // END : Initail checking for Custom id has any child node or not
  
  // START : Checking odometer selection and Verifying Initial and Last count is not 0
  if(odometer_selection === 'auto' && (initial_count != 0 || last_count != 0)){
      setInterval(updateNumbers, random_number_generation_duration);
  }
  // END : Checking odometer selection and Verifying Initial and Last count is not 0
  
  // START : Checking if odometer selection is 'SINGLE'
  // Call functions accordingly
  if(odometer_selection === 'single'){
      setSingleNumber(single_counter_count);
      updateNumberSingle();
  }
  // END : Checking if odometer selection is 'SINGLE'
  
  // START : Updating number and calling function
  function updateNumbers(){
      numberGeneration(initial_count, last_count);
      loopForNumber();
  }
  // END : Updating number and calling function
  
  // START : Udating number when it is 'SINGLE' selection
  function updateNumberSingle(){
      loopForNumber();
  }
  // END : Udating number when it is 'SINGLE' selection
  
  // START : Running loop on generated number
  function loopForNumber() {
      try {
        generated_numbers.forEach( (num, key) => {
          // Getting element of counter digit as per key available
          var element = document.querySelector(`#${custom_id} .counter-digit-${key}`);
        // Updating Custom Attribite data-numbwer
          element.setAttribute('data-number', generated_numbers[key]);
          // Showing number to User
          showCounterValue(generated_numbers[key], key);
        });
      } catch (error) {
        // Throw Error
        throwError(error.message);
      }
  }
  // END : Running loop on generated number

  // START : Scroll Event Listner
  window.addEventListener('scroll', function () {
    // Checking Element is in Viewport or not
    if (selected_odometer == 'single' && checkIsInViewport && isElementInViewport()) {
      // SHowing Number's
      loopForNumber();
    }
}, false);
// END : Scroll Event Listner
});
