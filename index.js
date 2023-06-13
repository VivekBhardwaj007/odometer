var customOdometer = (function({selected_odometer, number_generation_duration, animation_time, initial_number, last_number, single_counter_number, include_initial_count, include_last_count, seperator, seperator_position, custom_id}) {
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
    seperator_position_number = seperator_position || {};


    if(!custom_id){
        alert('Please provide id');
        return;
    }
    
    if(odometer_selection === 'auto' && initial_count.toString().length !== last_count.toString().length){
        alert('Please provide the same digits for values!');
        return;
    }

    const odometer = document.getElementById(custom_id);
    
    function numberGeneration(min, max){
        min = inclusion_number.initial ? min-1 : min+1;
        max = inclusion_number.last ? max+1 : max;
        generated_numbers = toArray(Math.floor(Math.random() * (max - min)) + min);
    }
    
    function setSingleNumber(min){
        generated_numbers = toArray(min);
    }
    
    function toArray(number){
        return (number).toString().split('');
    }
    
    function setStyle(value, key){
        var clientHeight = document.querySelector(`#${custom_id} #counter-number-${key}`).clientHeight;
        let updateStyle = document.querySelectorAll(`#${custom_id} .counter-digit-${key} div`);
        for (let i = 0; i < updateStyle.length; i++) {
            updateStyle[i].style.transform = 'translate(' + 0 + ',' + -(+clientHeight * +value) + 'px)';
            updateStyle[i].style.transition = 'all '+animation_timer+'s ease';
          }
    }
    
    function setInitialNumber(){
        switch(odometer_selection){
            case 'auto':
                numberGeneration(initial_count, last_count);
            break;
    
            case 'single':
                setSingleNumber(single_counter_count);
            break;
        }
        for (let i = 0; i < generated_numbers.length; i++) {
            var div = document.createElement('div');
            div.className = `counter-digit-${i} count-digit`;
            div.id = `counter-number-${i}`;
            div.dataset.number = generated_numbers[i];
            div.dataset.key = i;
            div.innerHTML = "<div><span>0</span><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span><span>8</span><span>9</span></div>"
            odometer.appendChild(div);
    
            if(!!Object.keys(seperator_position_number).length && seperator_position_number[i]){
                var span  = document.createElement('span');
                span.className = 'seperator',
                span.innerHTML = seperator_sign;
                odometer.appendChild(span);
            }
    
            setStyle(generated_numbers[i], i);
        }
    }
    
    if(!odometer.hasChildNodes()){
        setInitialNumber();
    }
    
    if(odometer_selection === 'auto' && (initial_count != 0 || last_count != 0)){
        setInterval(updateNumbers, random_number_generation_duration);
    }
    
    if(odometer_selection === 'single'){
        setSingleNumber(single_counter_count);
        updateNumberSingle();
    }
    
    function updateNumbers(){
        numberGeneration(initial_count, last_count);
        loopForNumber();
    }
    
    function updateNumberSingle(){
        loopForNumber();
    }
    
    function loopForNumber() {
        generated_numbers.forEach( (num, key) => {
            var element = document.querySelector(`#${custom_id} .counter-digit-${key}`);
            element.setAttribute('data-number', generated_numbers[key]);
            setStyle(generated_numbers[key], key);
          })
    }
});