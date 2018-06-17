function nature() {
	var resource = window.location.href.split('/')[4];

	var url = 'http://idp-saml-nature-federated-login.live.cf.public.nature.com/saml/login?\
	idp=https://shib-idp.ucl.ac.uk/shibboleth\
	&targetUrl=http%3A%2F%2Fwww.nature.com%2Farticles%2F' +
	resource;

	var btn = document.createElement('BUTTON');
    var btnText = document.createTextNode('Full PDF');
    btn.appendChild(btnText);
    document.querySelector('.header-logo-container').appendChild(btn);
    btn.onclick = function() {
    	window.location.href = url;
    }
}

