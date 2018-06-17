console.log("1-click content script started"); // check that script has loaded


var redirect = '';
var urls = {
  'sdirect': {
    'base': 'https://www.sciencedirect.com/science/article/pii/',
    'query': 'https://www.sciencedirect.com/science?_ob=FederationURL&_method=validate&_instId=398&fedId=12&uInstName=UCL+%28University+College+London%29&md5=78476c5ea9fac5830ed88c688d31aba8&prevURL=https%3A%2F%2Fwww.sciencedirect.com%2Fuser%2Frouter%2Fshib%3FtargetURL%3D',
    'selector': '.toolbar-container'
  },
  'wiley': {
    'base': 'https://onlinelibrary.wiley.com/doi',
    'query': 'http://iam.atypon.com/action/ssostart?idp=https%3A%2F%2Fshib-idp.ucl.ac.uk%2Fshibboleth&redirectUri=%2Fdoi%2Ffull%2F',
    'selector': '.doi-access-container'
  },
  'nature': {
    'base': 'https://www.nature.com/articles/',
    'query': 'http://idp-saml-nature-federated-login.live.cf.public.nature.com/saml/login?idp=https://shib-idp.ucl.ac.uk/shibboleth&targetUrl=http%3A%2F%2Fwww.nature.com%2Farticles%2F',
    'selector': '.ie11-list-hack'
  },
  'springer': {
    'base': 'https://link.springer.com/article/',
    'query': 'https://fsso.springer.com/saml/login?idp=https%3A%2F%2Fshib-idp.ucl.ac.uk%2Fshibboleth&targetUrl=https%3A%2F%2Flink.springer.com%2Farticle%2F10.1007%2F',
    'selector': '.MainTitleSection'   
  },
  'uptodate': {
    'base': 'https://www.uptodate.com/',
    'query': 'https://www-uptodate-com.libproxy.ucl.ac.uk/contents/search',
    'selector': '.wk-navbar-container'
  },
  'bmj': {
    'base': 'bmj.com/',
    'query': 'https://shibboleth.highwire.org/session/init?entityID=https://shib-idp.ucl.ac.uk/shibboleth&subcode=bmjjournals&env=prod&hw-shib-return-uri=',
    'selector': '.menu'
  },
  'tandf': {
    'base': 'https://www.tandfonline.com',
    'query': 'https://www.tandfonline.com/action/ssostart?idp=https%3A%2F%2Fshib-idp.ucl.ac.uk%2Fshibboleth&redirectUri=%2Fdoi%2Ffull%2F',
    'selector': '.toc-heading'
  },
  'sage': {
    'base': 'journals.sagepub.com',
    'query': 'http://iam.atypon.com/action/ssostart?idp=https%3A%2F%2Fshib-idp.ucl.ac.uk%2Fshibboleth&redirectUri=%2Fdoi%2Ffull%2F',
    'selector': '.publicationContentTitle'
  }                                
};
/*
window.onload = function() {
  var resource = window.location.href;
  for (var i in urls) {
    if (window.location.href.indexOf(urls[i]['base']) > -1) {   // if url contains '...'
      console.log(urls[i]);
      console.log(urls[i]['selector']);
      if (i == 'sdirect') {  
        redirect = urls[i]['query'] + encodeURIComponent(resource);                 
      } else {
        var segments = encodeURIComponent(resource).split('%2F');
        if (i == 'wiley') {
          resource = segments[segments.length - 2] + '%2F' + segments[segments.length - 1];
          redirect = urls[i]['query'] + encodeURIComponent(resource) + '&targetSP=https%3A%2F%2Fonlinelibrary.wiley.com';
        } else if (i == 'nature' || i == 'springer') {
          resource = segments[segments.length - 1];
          redirect = urls[i]['query'] + encodeURIComponent(resource);
          } else if (i == 'uptodate') {
            redirect = urls[i]['query'];
          } else if (i == 'bmj') {
            
          }
        }
      var btn = document.createElement('BUTTON');
      btn.classList.add('button');
      var btnText = document.createTextNode('1-CLICK');
      btn.appendChild(btnText);
      document.querySelector(urls[i]['selector']).appendChild(btn);
      btn.onclick = function() {
        window.location.href = redirect;
      } 
    }
  } 
}
*/
window.onload = function() {
  var resource = window.location.href;
  var segments = encodeURIComponent(resource).split('%2F');
  for (var i in urls) {
    if (resource.indexOf(urls[i]['base']) > -1) {       // if url contains ...
      console.log(urls[i]);
      console.log(urls[i]['selector']);
      var redirect = urls[i]['query'] + encodeURIComponent(resource);
      switch(i) {
        case 'sdirect': 
          break;
        case 'wiley':
          resource = segments[segments.length - 2] + '%2F' + segments[segments.length - 1];
          redirect = urls[i]['query'] + encodeURIComponent(resource) + '&targetSP=https%3A%2F%2Fonlinelibrary.wiley.com';
          break;
        case 'sage':
          resource = segments[segments.length - 2] + '%2F' + segments[segments.length - 1];
          redirect = urls[i]['query'] + encodeURIComponent(resource) + '&targetSP=https%3A%2F%2Fjournals.sagepub.com';
          break;
        case 'nature':
        case 'springer':
          resource = segments[segments.length - 1];
          redirect = urls[i]['query'] + encodeURIComponent(resource)
          break;
        case 'uptodate':
          redirect = urls[i]['query'];
          break;
        case 'bmj':
          redirect = urls[i]['query'] + 'http://' + resource.split('/')[2] + '/';
          break;
        case 'tandf':
          resource = segments[segments.length - 2] + '%2F' + segments[segments.length - 1];
          redirect = urls[i]['query'] + resource + '%3FinstName%3DUCL%2B%2528University%2BCollege%2BLondon%2529';
          break;
        }
        var btn = document.createElement('BUTTON');
        btn.classList.add('button');
        var btnText = document.createTextNode('1-CLICK');
        btn.appendChild(btnText);
        document.querySelector(urls[i]['selector']).appendChild(btn);
        btn.onclick = function() {
          window.location.href = redirect;
        } 
    }
  }
}






