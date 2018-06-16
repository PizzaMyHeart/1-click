/*
For resources on ScienceDirect
*/

function fullpdf() {
	var resource = encodeURIComponent(window.location.href);

	var url = 'https://www.sciencedirect.com/science?_ob=FederationURL&_method=validate\
	&_instId=398&fedId=12&uInstName=UCL+%28University+College+London%29\
	&md5=78476c5ea9fac5830ed88c688d31aba8\
	&prevURL=https%3A%2F%2Fwww.sciencedirect.com%2Fuser%2Frouter%2Fshib%3FtargetURL%3D' 
	+ resource;

	var btn = document.createElement('BUTTON');
    var btnText = document.createTextNode('Full PDF');
    btn.appendChild(btnText);
    document.querySelector('.toolbar-container').appendChild(btn);
    btn.onclick = function() {
    	window.location.href = url;
    }
}

