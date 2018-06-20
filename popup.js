function populate_dropdown() {
	let dropdown = document.querySelector('#inst');
	
	let defaultOption = document.createElement('option');
	defaultOption.text = 'Choose institution';
	
	dropdown.add(defaultOption);
	dropdown.selectedIndex = 0;
	
	let option;
	
	for (let i = 0; i < proxies.length; i++) {
		option = document.createElement('option');
		option.text = proxies[i].name;
		dropdown.add(option);
	}
}

// Save user institution to chrome storage
function save_options () {
	var inst = document.querySelector('#inst').value;
	chrome.storage.sync.set({'user_inst': inst}, function () {
		// Update status to show options were saved
		var status = document.querySelector('#status');
		status.textContent = 'Institution saved.';
		console.log('Current saved institution is ' + inst);
		setTimeout(function() {
			status.textContent = '';
			}, 750);
	});
}

// Restore select box using preferences stored in chrome.storage
function restore_options() {
	chrome.storage.sync.get('user_inst', function(item) {
		document.querySelector('#inst').value = item.user_inst;
		console.log("Options restored. Current option is " + document.querySelector('#inst').value);
	});
	
}





window.onload = populate_dropdown();
document.addEventListener('DOMContentLoaded', restore_options);
document.querySelector('#save').addEventListener('click', save_options);
