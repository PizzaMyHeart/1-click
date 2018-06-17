function springer() {
	var resource = window.location.href.split('/')[5];

	var url = 'https://fsso.springer.com/saml/login?\
	idp=https%3A%2F%2Fshib-idp.ucl.ac.uk%2Fshibboleth\
	&targetUrl=https%3A%2F%2Flink.springer.com%2Farticle%2F10.1007%2F' +
	resource;

	var btn = document.createElement('BUTTON');
    var btnText = document.createTextNode('Full PDF');
    btn.appendChild(btnText);
    document.querySelector('.MainTitleSection').appendChild(btn);
    btn.onclick = function() {
    	window.location.href = url;
    }
}