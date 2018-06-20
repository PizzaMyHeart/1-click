console.log("content.js started"); // check that script has loaded
var user_inst;
var proxy;
var scidir;
var resource;

window.onload = function() {  
  if (window.location.href.indexOf('www.ncbi.nlm.nih.gov/pubmed') > -1) { // if PubMed
  var resource = document.querySelector('#EntrezForm > div:nth-child(1) > div.supplemental.col.three_col.last > div > div.icons.portlet > a')
                  .href;   
    if (resource.indexOf('elsevier') > -1) {  // if button links to Elsevier linkinghub
      get_proxy(pm_els);
    } else {
      get_proxy(pubmed);
    }
  } else { // if not PubMed i.e. journal website in urls
    get_proxy(not_pubmed);
  };
}


function pubmed() {
  console.log("pubmed.js started"); 
  var resource = document.querySelector('#EntrezForm > div:nth-child(1) > div.supplemental.col.three_col.last > div > div.icons.portlet > a')
                 .href;   
  console.log("Button links to " + resource);
  for (var i in urls) {
    if (resource.indexOf(urls[i]['base']) > -1) {       // if url contains ...
      console.log(urls[i]['base']);
      var redirect = proxy + resource;
      console.log("The button takes you to: " + redirect);
      var btn = document.createElement('BUTTON');
      btn.classList.add('button');
      var btnText = document.createTextNode('\u26A1 1-CLICK');
      btn.appendChild(btnText);
      document.querySelector('.icons').appendChild(btn);
      console.log("Button appended");
      btn.onclick = function() {
       window.open(redirect, 'tab');
      };
    };
  }; 
}


// Pubmed -> Elsevier
function pm_els() {
  var resource = document.querySelector('#EntrezForm > div:nth-child(1) > div.supplemental.col.three_col.last > div > div.icons.portlet > a')
                .href;
  console.log('pm_els executing');
  var pii = resource.split('/').pop();
  console.log('pii: ' + pii);
  // Get ScienceDirect URL through Elsevier Article Retrieval API
  var xmlhttp = new XMLHttpRequest();
  var url = 'https://api.elsevier.com/content/article/pii/' 
            +  pii
            + '?httpAccept=application/json';
  xmlhttp.onload = function() {
      console.log('Received from Elsevier:' + this.response)
      var els_response = JSON.parse(this.response);
      console.log('JSON response: ' + els_response);
      // get array containing article links
      var link_arr = els_response['full-text-retrieval-response']['coredata']['link'];
      console.log(link_arr);
      for (let i in link_arr) {
        for (let j in link_arr[i]) {
          if (link_arr[i][j].indexOf('sciencedirect.com') > -1) {
            resource = link_arr[i][j];
            console.log('resource is: ' + resource);
          };
        };
      };
      redirect = proxy + resource;
      var btn = document.createElement('BUTTON');
      btn.classList.add('button');
      var btnText = document.createTextNode('\u26A1 1-CLICK');
      btn.appendChild(btnText);
      document.querySelector('.icons').appendChild(btn);
      console.log("Button appended");
      btn.onclick = function() {
        window.open(redirect, 'tab');
      };
  };
  xmlhttp.open('GET', url, true);
  xmlhttp.send();
}






function not_pubmed() {
  console.log('not_pubmed executing');
  var resource = window.location.href;
  for (var i in urls) {
    if (resource.indexOf(urls[i]['base']) > -1) {       // if url contains ...
      console.log(urls[i]['base']);
      console.log(urls[i]['selector']);
      var redirect = proxy + resource;
      console.log("The button takes you to: " + redirect);
      var insert_here = document.querySelector(urls[i]['selector']),
                  btn = document.createElement('BUTTON'),
              btnText = document.createTextNode('\u26A1 1-CLICK');
      btn.classList.add('button');
      btn.appendChild(btnText);
      insert_here.insertBefore(btn, insert_here.firstChild);
      console.log("Button appended");
      btn.onclick = function() {
      window.location.href = redirect;
      }
    };
  };    
}

// If user changes institution
chrome.storage.onChanged.addListener(function(changes, area) {
  console.log("Change in storage area: " + area);
  if (area) {
    window.location.reload();
  };
})



// Get proxy
function get_proxy(callback) {
  console.log("get_proxy executing");
  chrome.storage.sync.get('user_inst', function(item) {
    var user_inst = item.user_inst;
    console.log("Your institution is: " + user_inst);
    for (let i = 0; i < proxies.length; i++) {
      if (user_inst == proxies[i]['name']) {
        proxy = proxies[i]['url'];
        proxy = proxy.slice(0, -2); // remove the trailing '$@' from the urls 
      } 
    };
    console.log("Your proxy is: " + proxy);
    if (callback) callback(); 
  });
  console.log("get_proxy executed");  
}

/*
function inject_button(proxy, resource) {
  console.log("inject_button executing");
  var redirect = proxy + resource;
  console.log("The button takes you to: " + redirect);
  var insert_here = document.querySelector(urls[i]['selector']),
              btn = document.createElement('BUTTON'),
          btnText = document.createTextNode('\u26A1 1-CLICK');
  btn.classList.add('button');
  btn.appendChild(btnText);
  insert_here.insertBefore(btn, insert_here.firstChild);
  console.log("Button appended")
  btn.onclick = function() {
    window.location.href = redirect;
  }
}
*/



var proxies = [
  {
    url: 'https://www.ezproxy.unibo.it/login?url=$@',
    name: 'ALMA MATER STUDIORUM - Università di Bologna'
  },
  {
    url: 'http://ezproxy.anzca.edu.au/login?url=$@',
    name: 'ANZCA'
  },
  {
    url: 'http://libproxy.aalto.fi/login?url=$@',
    name: 'Aalto University'
  },
  {
    url: 'http://ezproxy.adler.edu/login?url=$@',
    name: 'Adler University'
  },
  {
    url: 'http://elibrary.einstein.yu.edu/login?url=$@',
    name: 'Albert Einstein College of Medicine'
  },
  {
    url: 'https://proxy.aju.edu/login?url=$@',
    name: 'American Jewish University'
  },
  {
    url: 'http://libraryproxy.amnh.org:9000/login?url=$@',
    name: 'American Museum of Natural History'
  },
  {
    url: 'https://myau.american.edu/my.policy?url=$@',
    name: 'American University'
  },
  {
    url: 'http://ezproxy.library.aucegypt.edu:2048/login?url=$@',
    name: 'American University in Cairo'
  },
  {
    url: 'https://ezproxy.angelina.edu/login?url=$@',
    name: 'Angelina College'
  },
  {
    url: 'http://login.ezproxy1.lib.asu.edu/login?url=$@',
    name: 'Arizona State University'
  },
  {
    url: 'https://go.openathens.net/redirector/aub.ac.uk?url=$@',
    name: 'Arts University Bournemouth'
  },
  {
    url: 'http://ezproxy.aut.ac.nz/login?url=$@',
    name: 'Auckland University of Technology'
  },
  {
    url: 'https://lsproxy.austincc.edu/login?url=$@',
    name: 'Austin Community College'
  },
  {
    url: 'http://journals.library.austin.org.au/login?url=$@',
    name: 'Austin Health'
  },
  {
    url: 'http://www.austinlibrary.com:2048/login?url=$@',
    name: 'Austin Public Library'
  },
  {
    url: 'http://journals.library.austin.org.au/login?url=$@',
    name: 'Austin University of Technology'
  },
  {
    url: 'http://ezproxy.acu.edu.au/login?url=$@',
    name: 'Australian Catholic University'
  },
  {
    url: 'http://virtual.anu.edu.au/login?url=$@',
    name: 'Australian National University'
  },
  {
    url: 'http://ezproxy.library.bi.no/login?url=$@',
    name: 'BI Norwegian Business School'
  },
  {
    url: 'http://ezproxy.bshp.edu:2048/login?url=$@',
    name: 'Baptist School of Health Professions'
  },
  {
    url: 'http://proxy1.athensams.net/login?url=$@',
    name: 'Bar-Ilan University (and other OpenAthens/MyAthens users)'
  },
  {
    url: 'http://ezprox.bard.edu:2048/login?url=$@',
    name: 'Bard College'
  },
  {
    url: 'https://bathspa.idm.oclc.org/login?url=$@',
    name: 'Bath Spa University'
  },
  {
    url: 'http://bcd.tamhsc.libguides.com/proxy_login?url=$@',
    name: 'Baylor Health Sciences Library'
  },
  {
    url: 'http://ezproxy.baylor.edu/login?url=$@',
    name: 'Baylor University '
  },
  {
    url: 'http://ezproxy.bellevue.edu/login?url=$@',
    name: 'Bellevue University'
  },
  {
    url: 'http://biblioplanets.gate.inist.fr/login?url=$@',
    name: 'BiblioPl@nets - CNRS INIST'
  },
  {
    url: 'http://proxy.bnl.lu/login?url=$@',
    name: 'Bibliothèque nationale de Luxembourg'
  },
  {
    url: 'http://liboasis.buse.ac.zw:2048/login?url=$@',
    name: 'Bindura University of Science Education'
  },
  {
    url: 'http://proxy-bloomu.klnpa.org/login?url=$@',
    name: 'Bloomsburg University'
  },
  {
    url: 'http://ezpcrc.bu.edu/login?URL=$@',
    name: 'Boston University Charles River Campus'
  },
  {
    url: 'http://ezproxy.bu.edu/login?URL=$@',
    name: 'Boston University, Medical Campus'
  },
  {
    url: 'http://shibboleth.bradfordcollege.ac.uk:2048/login?url=$@',
    name: 'Bradford College'
  },
  {
    url: 'https://www.lib.byu.edu/cgi-bin/remoteauth.pl?url=$@',
    name: 'Brigham Young University'
  },
  {
    url: 'https://ezproxy.lib.vutbr.cz/login?qurl=$@',
    name: 'Brno University of Technology'
  },
  {
    url: 'https://revproxy.brown.edu/login?url=$@',
    name: 'Brown University'
  },
  {
    url: 'https://ezproxy.cern.ch/login?url=$@',
    name: 'CERN'
  },
  {
    url: 'http://acs.hcn.com.au/?acc=36422&url=$@',
    name: 'CIAP, NSW Health'
  },
  {
    url: 'https://login.proxy.library.cpp.edu/login?url=$@',
    name: 'Cal Poly Pomona'
  },
  {
    url: 'http://ezproxy.lib.calpoly.edu/login?url=$@',
    name: 'California Polytechnic State University'
  },
  {
    url: 'http://lib-proxy.fullerton.edu/login?url=$@',
    name: 'California State University, Fullerton'
  },
  {
    url: 'http://mimas.calstatela.edu/login?url=$@',
    name: 'California State University, Los Angeles'
  },
  {
    url: 'http://proxy-calu.klnpa.org/login?url=$@',
    name: 'California University of PA'
  },
  {
    url: 'http://clsproxy.library.caltech.edu/login?url=$@',
    name: 'Caltech'
  },
  {
    url: 'https://ezproxy.cardiffmet.ac.uk/login?url=$@',
    name: 'Cardiff Metropolitan University'
  },
  {
    url: 'https://login.proxy.library.carleton.ca/login?url=$@',
    name: 'Carleton University'
  },
  {
    url: 'https://login.proxy.library.cmu.edu/login?url=$@',
    name: 'Carnegie Mellon University (CMU)'
  },
  {
    url: 'http://14.139.56.75/login?url=$@',
    name: 'CeRA - Indian Agricultural Research Institute'
  },
  {
    url: 'https://centenary.idm.oclc.org/login?url=$@',
    name: 'Centenary College of Louisiana'
  },
  {
    url: 'http://ezproxy.csu.edu.au/login?url=$@',
    name: 'Charles Sturt University'
  },
  {
    url: 'http://mendel.csuniv.edu/login?url=$@',
    name: 'Charleston Southern University'
  },
  {
    url: 'http://proxy-cheyney.klnpa.org/login?url=$@',
    name: 'Cheyney University'
  },
  {
    url: 'https://ezproxy.gc.cuny.edu/login?url=$@',
    name: 'City University of New York'
  },
  {
    url: 'https://login.ccl.idm.oclc.org/login?qurl=$@',
    name: 'Claremont Colleges'
  },
  {
    url: 'http://proxy-clarion.klnpa.org/login?url=$@',
    name: 'Clarion University'
  },
  {
    url: 'http://ezproxy.library.csn.edu/login?url=$@',
    name: 'College of Southern Nevada'
  },
  {
    url: 'https://ezproxy.com.edu/login?url=$@',
    name: 'College of the Mainland'
  },
  {
    url: 'http://ezproxy.cul.columbia.edu/login?url=$@',
    name: 'Columbia University'
  },
  {
    url: 'https://ezproxy.cui.edu/login?qurl=$@',
    name: 'Concordia University'
  },
  {
    url: 'http://ep.fjernadgang.kb.dk/login?url=$@',
    name: 'Copenhagen University - The Royal Library'
  },
  {
    url: 'http://encompass.library.cornell.edu/cgi-bin/checkIP.cgi?access=gateway_standard&url=$@',
    name: 'Cornell University'
  },
  {
    url: 'https://login.cuhsl.creighton.edu/login?url=$@',
    name: 'Creighton University'
  },
  {
    url: 'https://login.ezproxy.library.dal.ca/login?url=$@',
    name: 'Dalhousie University'
  },
  {
    url: 'http://ep.museum-fjernadgang.kb.dk/login?url=$@',
    name: 'Danske museers e-tidsskriftadgang'
  },
  {
    url: 'http://ezproxy.lib.davidson.edu/login?url=$@',
    name: 'Davidson College'
  },
  {
    url: 'http://ezproxy.deakin.edu.au/login?url=$@',
    name: 'Deakin University'
  },
  {
    url: 'http://proxy-dixon.klnpa.org/login?url=$@',
    name: 'Dixon Center'
  },
  {
    url: 'http://www.library.drexel.edu/cgi-bin/r.cgi?url=$@',
    name: 'Drexel University'
  },
  {
    url: 'http://proxy.lib.duke.edu:2048/login?url=$@',
    name: 'Duke University'
  },
  {
    url: 'http://ezphost.dur.ac.uk/login?url=$@',
    name: 'Durham University'
  },
  {
    url: 'https://www.ezproxy.uh1.ac.ma/login?url=$@',
    name: 'ENCG Settat'
  },
  {
    url: 'https://login.ezp.essec.fr/login?url=$@',
    name: 'ESSEC Business School'
  },
  {
    url: 'http://navigator-esu.passhe.edu/login?url=$@',
    name: 'East Stroudsburg University'
  },
  {
    url: 'http://media.etbu.edu:2048/login?url=$@',
    name: 'East Texas Baptist University'
  },
  {
    url: 'http://proxy-edinboro.klnpa.org/login?url=$@',
    name: 'Edinboro University'
  },
  {
    url: 'https://janus.libr.tue.nl/login?url=$@',
    name: 'Eindhoven University of Technology'
  },
  {
    url: 'http://ezproxy.libproxy.db.erau.edu/login?url=$@',
    name: 'Embry-Riddle Aeronautical University - Hunt Library'
  },
  {
    url: 'https://proxy.library.emory.edu/login?url=$@',
    name: 'Emory University'
  },
  {
    url: 'https://eur.idm.oclc.org/login?url=$@',
    name: 'Erasmus University Rotterdam'
  },
  {
    url: 'http://ezproxy.eui.eu/login?url=$@',
    name: 'European University Institute'
  },
  {
    url: 'http://ezproxy.flinders.edu.au/login?url=$@',
    name: 'Flinders University'
  },
  {
    url: 'https://login.ezproxy.fau.edu/login?url=$@',
    name: 'Florida Atlantic University'
  },
  {
    url: 'https://login.ezproxy.fiu.edu/login?url=$@',
    name: 'Florida International University'
  },
  {
    url: 'https://login.proxy.lib.fsu.edu/login?url=$@',
    name: 'Florida State'
  },
  {
    url: 'https://avoserv.library.fordham.edu/login?url=$@',
    name: 'Fordham University'
  },
  {
    url: 'http://ezproxy.ugm.ac.id/login?url=$@',
    name: 'Gadjah Mada University'
  },
  {
    url: 'http://proxy-geneva.klnpa.org/login?url=$@',
    name: 'Geneva University'
  },
  {
    url: 'http://mutex.gmu.edu/login?url=$@',
    name: 'George Mason University'
  },
  {
    url: 'https://gwlaw.idm.oclc.org/login?url=$@',
    name: 'George Washington University Law School'
  },
  {
    url: 'http://proxy.library.georgetown.edu/login?url=$@',
    name: 'Georgetown University'
  },
  {
    url: 'http://www.library.gatech.edu:2048/login?url=$@',
    name: 'Georgia Tech'
  },
  {
    url: 'http://www.ezproxy.gbs.edu:2048/login?url=$@',
    name: 'God\'s Bible School and College'
  },
  {
    url: 'https://login.ezproxy.gvsu.edu/login?url=$@',
    name: 'Grand Valley State University'
  },
  {
    url: 'http://library.gbcnv.edu:2048/login?url=$@',
    name: 'Great Basin College'
  },
  {
    url: 'https://ezproxy.bib.hh.se/login?url=$@',
    name: 'Halmstad University'
  },
  {
    url: 'http://proxy-harrisburg.klnpa.org/login?url=$@',
    name: 'Harrisburg University'
  },
  {
    url: 'http://ezp-prod1.hul.harvard.edu/login?url=$@',
    name: 'Harvard University'
  },
  {
    url: 'https://www.ezproxy.haverford.edu/login?url=$@',
    name: 'Haverford College'
  },
  {
    url: 'https://ezproxy1.hw.ac.uk/login?url=$@',
    name: 'Heriot-Watt University'
  },
  {
    url: 'http://ezproxy.hofstra.edu/login?url=$@',
    name: 'Hofstra University'
  },
  {
    url: 'https://login.ezoris.lib.hokudai.ac.jp/login?url=$@',
    name: 'Hokkaido University'
  },
  {
    url: 'https://lib-ezproxy.hkbu.edu.hk/login?url=$@',
    name: 'Hong Kong Baptist University'
  },
  {
    url: 'http://ezproxy.lb.polyu.edu.hk/login?url=$@',
    name: 'Hong Kong Polytechnic University'
  },
  {
    url: 'https://ezproxy.hkpl.gov.hk/login?url=$@',
    name: 'Hong Kong Public Libraries'
  },
  {
    url: 'http://ezproxy.ust.hk/login?url=$@',
    name: 'Hong Kong University of Science and Technology'
  },
  {
    url: 'http://ezproxyhost.library.tmc.edu/login?url=$@',
    name: 'Houston Academy of Medicine - Texas Medical Center'
  },
  {
    url: 'http://librouter.hud.ac.uk/login?url=$@',
    name: 'Huddersfield University'
  },
  {
    url: 'http://ezproxy.humboldt.edu/login?url=$@',
    name: 'Humboldt State University'
  },
  {
    url: 'http://ezproxy.inn.no/login?url=$@',
    name: 'Høgskolen i Innlandet'
  },
  {
    url: 'https://login.galanga.hvl.no/login?url=$@',
    name: 'Høgskulen på Vestlandet'
  },
  {
    url: 'http://rproxy.insa-rennes.fr/login?url=$@',
    name: 'INSA de Rennes'
  },
  {
    url: 'http://ezproxy.iucaa.ernet.in:2048/login?url=$@',
    name: 'IUCAA'
  },
  {
    url: 'https://ezproxy.gl.iit.edu/login?url=$@',
    name: 'Illinois Institute of Technology'
  },
  {
    url: 'http://sfx.carli.illinois.edu/login?url=$@',
    name: 'Illinois State University'
  },
  {
    url: 'https://login.iclibezp1.cc.ic.ac.uk/login?url=$@',
    name: 'Imperial College London'
  },
  {
    url: 'http://proxyiub.uits.iu.edu/login?url=$@',
    name: 'Indiana University'
  },
  {
    url: 'https://proxy.medlib.iupui.edu/login?url=$@',
    name: 'Indiana University School of Medicine'
  },
  {
    url: 'http://proxy-iup.klnpa.org/login?url=$@',
    name: 'Indiana University of Pennsylvania'
  },
  {
    url: 'http://elibrary.jcu.edu.au/login?url=$@',
    name: 'James Cook University'
  },
  {
    url: 'https://ezproxy.welch.jhmi.edu/login?url=$@',
    name: 'Johns Hopkins University School of Medicine'
  },
  {
    url: 'http://kuleuven.ezproxy.kuleuven.be/login?url=$@',
    name: 'KULeuven'
  },
  {
    url: 'http://ezproxy.kmu.edu.tw/login?url=$@',
    name: 'Kaohsiung Medical University'
  },
  {
    url: 'http://proxy.kib.ki.se/login?url=$@',
    name: 'Karolinska Institutet University Library'
  },
  {
    url: 'http://ezproxy.keiser.edu/login?url=$@',
    name: 'Keiser University'
  },
  {
    url: 'https://proxy.library.kent.edu/login?url=$@',
    name: 'Kent State University'
  },
  {
    url: 'http://ezproxy.kustar.ac.ae:2048/login?url=$@',
    name: 'Khalifa University of Science, Technology, and Research'
  },
  {
    url: 'http://ezproxy.wildcatter.kilgore.edu:2048/login?url=$@',
    name: 'Kilgore College'
  },
  {
    url: 'http://extoljp.kfupm.edu.sa/login?url=$@',
    name: 'King Fahd University of Petroleum & Minerals (KFUPM)'
  },
  {
    url: 'http://proxy-kutztown.klnpa.org/login?url=$@',
    name: 'Kutztown University'
  },
  {
    url: 'http://libproxy.knu.ac.kr/_Lib_Proxy_Url/$@',
    name: 'Kyungpook National University'
  },
  {
    url: 'http://ez.library.latrobe.edu.au/login?url=$@ ',
    name: 'La Trobe University'
  },
  {
    url: 'http://ezproxy.lakeheadu.ca/login?url=$@',
    name: 'Lakehead University'
  },
  {
    url: 'https://libproxy.lamar.edu/login?url=$@',
    name: 'Lamar University'
  },
  {
    url: 'http://research-db.letu.edu/login?url=$@',
    name: 'LeTourneau University'
  },
  {
    url: 'http://leonardo.lee.edu/login?url=$@',
    name: 'Lee College'
  },
  {
    url: 'https://login.ezproxy.leedsmet.ac.uk/login?url=$@',
    name: 'Leeds Metropolitan University'
  },
  {
    url: 'https://ezproxy.leidenuniv.nl:2443/login?url=$@',
    name: 'Leiden University'
  },
  {
    url: 'http://ezproxy.dbazes.lsmuni.lt:2048/login?url=$@',
    name: 'Lietuvos sveikatos mokslų universitetas'
  },
  {
    url: 'http://login.ezproxy.hil.no/login?url=$@',
    name: 'Lillehammer University College'
  },
  {
    url: 'http://proxy-lincoln.klnpa.org/login?url=$@',
    name: 'Lincoln University'
  },
  {
    url: 'https://login.e.bibl.liu.se/login?url=$@',
    name: 'Linköping University'
  },
  {
    url: 'http://proxy.lnu.se/login?url=$@',
    name: 'Linnaeus University'
  },
  {
    url: 'http://proxy-lhup.klnpa.org/login?url=$@',
    name: 'Lock Haven University'
  },
  {
    url: 'http://lscsproxy.lonestar.edu/login?url=$@',
    name: 'Lone Star College'
  },
  {
    url: 'http://www.lib.lsu.edu/apps/onoffcampus.php?url=$@',
    name: 'Louisiana State University'
  },
  {
    url: 'http://ezproxy.latech.edu:2048/login?url=$@',
    name: 'Louisiana Tech University'
  },
  {
    url: 'https://electra.lmu.edu/login?url=$@',
    name: 'Loyola Marymount University | LA'
  },
  {
    url: 'http://ezproxy.loyno.edu/login?url=$@',
    name: 'Loyola University New Orleans'
  },
  {
    url: 'http://emedien.ub.uni-muenchen.de/login?url=$@',
    name: 'Ludwig-Maximilians-Universität München'
  },
  {
    url: 'http://ezproxy.lynchburg.edu/login?url=$@',
    name: 'Lynchburg College'
  },
  {
    url: 'https://ezproxymcp.flo.org/login?qurl=$@',
    name: 'MCPHS (Massachusetts College of Pharmacy and Health Science)'
  },
  {
    url: 'https://libproxy.mit.edu/cgi-bin/ezpauth?url=$@',
    name: 'MIT'
  },
  {
    url: 'http://ezproxy.ub.unimaas.nl/login?url=$@',
    name: 'Maastricht University'
  },
  {
    url: 'https://simsrad.net.ocs.mq.edu.au/login?qurl=$@',
    name: 'Macquarie University'
  },
  {
    url: 'http://libraries.maine.edu/mainedatabases/authmaine.asp?url=$@',
    name: 'Maine\'s Virtual Library'
  },
  {
    url: 'http://ezproxy.mmu.ac.uk/login?url=$@',
    name: 'Manchester Metropolitan University'
  },
  {
    url: 'http://proxy-mansfield.klnpa.org/login?url=$@',
    name: 'Mansfield University'
  },
  {
    url: 'http://login.online.library.marist.edu/login?url=$@',
    name: 'Marist College'
  },
  {
    url: 'http://ezproxy.masdar.ac.ae/login?url=$@',
    name: 'Masdar Institute'
  },
  {
    url: 'http://ezproxy.massey.ac.nz/login?url=$@',
    name: 'Massey Universtiy'
  },
  {
    url: 'http://proxy.library.mcgill.ca/login?url=$@',
    name: 'McGill University'
  },
  {
    url: 'http://ez.srv.meduniwien.ac.at/login?url=$@',
    name: 'Medical University Vienna'
  },
  {
    url: 'http://ebazy.umb.edu.pl/login?url=$@',
    name: 'Medical University of Bialystok'
  },
  {
    url: 'http://proxy-s.mercer.edu/login?url=$@',
    name: 'Mercer University'
  },
  {
    url: 'http://ezproxy.msu.edu/login?url=$@',
    name: 'Michigan State University'
  },
  {
    url: 'http://proxy-millersville.klnpa.org/login?url=$@',
    name: 'Millersville University'
  },
  {
    url: 'https://intra.mills.edu:2443/login?url=$@',
    name: 'Mills College'
  },
  {
    url: 'http://ezproxy.lib.monash.edu.au/login?url=$@',
    name: 'Monash University'
  },
  {
    url: 'https://login.libproxy.mtroyal.ca/login?qurl=$@',
    name: 'Mount Royal University'
  },
  {
    url: 'http://eresources.library.mssm.edu:2048/login?url=$@',
    name: 'Mt. Sinai School of Medicine (NYU)'
  },
  {
    url: 'https://libris.mtsac.edu/login?url=$@',
    name: 'Mt.San Antonio College'
  },
  {
    url: 'http://nlist.inflibnet.ac.in:2048/login?url=$@',
    name: 'NLIST Programme'
  },
  {
    url: 'https://www.ezpdhcs.nt.gov.au/login?url=$@',
    name: 'NT Health Library'
  },
  {
    url: 'https://ezproxy.med.nyu.edu/login?url=$@',
    name: 'NYU Medical'
  },
  {
    url: 'http://ezlibproxy1.ntu.edu.sg/login?url=$@',
    name: 'Nanyang Technological University'
  },
  {
    url: 'https://ezproxy.lib.ncu.edu.tw/login?url=$@',
    name: 'National Central University, Taiwan'
  },
  {
    url: 'https://nist.idm.oclc.org/login?url=$@',
    name: 'National Institute of Standards & Technology'
  },
  {
    url: 'http://sw.library.ntpu.edu.tw:81/login?url=$@',
    name: 'National Taipei University'
  },
  {
    url: 'https://login.ezproxy.unal.edu.co/login?url=$@',
    name: 'National University of Colombia'
  },
  {
    url: 'https://libgate.library.nuigalway.ie/login?url=$@',
    name: 'National University of Ireland, Galway'
  },
  {
    url: 'http://libproxy1.nus.edu.sg/login?url=$@',
    name: 'National University of Singapore'
  },
  {
    url: 'http://ezproxy.nioo.knaw.nl/login?url=$@ ',
    name: 'Netherlands Institute of Ecology (NIOO-KNAW)'
  },
  {
    url: 'http://libdb.njit.edu:8888/login?url=$@',
    name: 'New Jersey Institute of Technology'
  },
  {
    url: 'https://ezproxy.library.nyu.edu/login?url=$@',
    name: 'New York University (NYU)'
  },
  {
    url: 'http://roxy.nipissingu.ca/login?url=$@',
    name: 'Nipissing University'
  },
  {
    url: 'http://proxying.lib.ncsu.edu/index.php?url=$@',
    name: 'North Carolina State University'
  },
  {
    url: 'http://www.ezproxy.nctc.edu/login?url=$@',
    name: 'North Central Texas College'
  },
  {
    url: 'http://ezproxy.neu.edu/login?URL=$@',
    name: 'Northeastern University'
  },
  {
    url: 'http://normedproxy.lakeheadu.ca/login?URL=$@',
    name: 'Northern Ontario School of Medicine'
  },
  {
    url: 'https://proxy.lib.nosm.ca/login?url=$@',
    name: 'Northern Ontario School of Medicine (NOSM)'
  },
  {
    url: 'http://ezproxy.nsula.edu/login?url=$@',
    name: 'Northwestern State University of Louisiana'
  },
  {
    url: 'https://sesame.library.northwestern.edu:443/cgi-bin/ssoEzpCheck.pl?url=$@',
    name: 'Northwestern University'
  },
  {
    url: 'https://novacat.nova.edu/patroninfo?url=$@',
    name: 'Nova Southeastern University'
  },
  {
    url: 'https://ezproxy.techlib.cz/login/?url=$@',
    name: 'Národní technická knihovna'
  },
  {
    url: 'http://ezproxy.obspm.fr/login?url=$@',
    name: 'Observatoire de Paris'
  },
  {
    url: 'https://proxy.lib.ohio-state.edu/login?url=$@',
    name: 'Ohio State University'
  },
  {
    url: 'http://proxy.lib.odu.edu/login?url=$@',
    name: 'Old Dominion University'
  },
  {
    url: 'http://login.ezproxy.elib10.ub.unimaas.nl/login?url=$@',
    name: 'Open Universiteit'
  },
  {
    url: 'http://libezproxy.open.ac.uk/login?url=$@',
    name: 'Open University'
  },
  {
    url: 'http://liboff.ohsu.edu/login?url=$@',
    name: 'Oregon Health & Sciences University'
  },
  {
    url: 'https://login.ezproxy.proxy.library.oregonstate.edu/login?url=$@',
    name: 'Oregon State University'
  },
  {
    url: 'http://ezproxy.biblioottawalibrary.ca/login?url=$@',
    name: 'Ottawa Public Library'
  },
  {
    url: 'http://pas.panola.edu:2048/login?url=$@',
    name: 'Panola College'
  },
  {
    url: 'http://ezaccess.libraries.psu.edu/login?url=$@',
    name: 'Pennsylvania State University'
  },
  {
    url: 'http://ezproxy.pisa.edu/login?url=$@',
    name: 'Pisa University'
  },
  {
    url: 'http://ezproxy.puc.cl/login?url=$@',
    name: 'Pontificia Universidad Católica de Chile'
  },
  {
    url: 'https://login.ezproxy.javeriana.edu.co/login?url=$@',
    name: 'Pontificia Universidad Javeriana Bogotá'
  },
  {
    url: 'http://bdbib.javerianacali.edu.co/login?url=$@',
    name: 'Pontificia Universidad Javeriana, Cali'
  },
  {
    url: 'http://ezproxy.princeton.edu/login?url=$@',
    name: 'Princeton University'
  },
  {
    url: 'https://login.ezproxy.lib.purdue.edu/login?url=$@',
    name: 'Purdue University'
  },
  {
    url: 'http://ezproxy.library.qmul.ac.uk/login?url=$@',
    name: 'Queen Mary, University of London'
  },
  {
    url: 'http://proxy.queensu.ca/login?url=$@',
    name: 'Queen\'s University'
  },
  {
    url: 'http://ezp01.library.qut.edu.au/login?url=$@',
    name: 'Queensland University of Technology'
  },
  {
    url: 'http://ezproxy.rit.edu/login?url=$@',
    name: 'RIT'
  },
  {
    url: 'https://login.ezproxy.lib.rmit.edu.au/login?url=$@',
    name: 'RMIT University '
  },
  {
    url: 'https://ru.idm.oclc.org/login?url=$@',
    name: 'Radboud University, Nijmegen'
  },
  {
    url: 'https://library.regent.edu/wamvalidate?url=$@',
    name: 'Regent University'
  },
  {
    url: 'https://libproxy.rpi.edu/login?url=$@',
    name: 'Rensselaer Polytechnic Institute'
  },
  {
    url: 'https://login.ezproxy.rice.edu/login?url=$@',
    name: 'Rice University'
  },
  {
    url: 'http://ezproxy01.rhul.ac.uk/login?url=$@',
    name: 'Royal Holloway, University of London'
  },
  {
    url: 'https://proxy.libraries.rutgers.edu/login?url=$@',
    name: 'Rutgers University'
  },
  {
    url: 'http://ezproxy.lib.ryerson.ca/login?url=$@',
    name: 'Ryerson University'
  },
  {
    url: 'http://salus.idm.oclc.org/login?url=$@',
    name: 'SALUS'
  },
  {
    url: 'http://www.shirp.ca/doproxy?url=$@',
    name: 'SHIRP Database'
  },
  {
    url: 'http://www.sndl1.arn.dz/login?url=$@',
    name: 'SNDL Systeme National de Documentation en Ligne'
  },
  {
    url: 'http://newproxy.downstate.edu/login?url=$@',
    name: 'SUNY Downstate'
  },
  {
    url: 'https://esf.idm.oclc.org/login?url=$@',
    name: 'SUNY Environmental Science and Forestry'
  },
  {
    url: 'https://proxy.library.spbu.ru/login?url=$@',
    name: 'Saint Petersburg State University'
  },
  {
    url: 'https://salford.idm.oclc.org/login?url=$@',
    name: 'Salford University'
  },
  {
    url: 'http://login.ezproxy.shsu.edu/login?url=$@',
    name: 'Sam Houston State University'
  },
  {
    url: 'http://libaccess.sjlibrary.org/login?url=$@',
    name: 'San Jose State University'
  },
  {
    url: 'http://ezproxy.shu.edu/login?url=$@',
    name: 'Seton Hall University'
  },
  {
    url: 'http://ezlibrary.sufe.edu.cn/login?url=$@',
    name: 'Shanghai University of Finance and Economics'
  },
  {
    url: 'http://lcproxy.shu.ac.uk/login?url=$@',
    name: 'Sheffield Hallam University'
  },
  {
    url: 'http://proxy-ship.klnpa.org/login?url=$@',
    name: 'Shippensburg University'
  },
  {
    url: 'http://proxy.lib.sfu.ca/login?url=$@',
    name: 'Simon Fraser University'
  },
  {
    url: 'http://libproxy.smu.edu.sg/login?url=$@',
    name: 'Singapore Management University (SMU)'
  },
  {
    url: 'http://proxy-sru.klnpa.org/login?url=$@',
    name: 'Slippery Rock University'
  },
  {
    url: 'http://ezproxy.sau.ac.in/login?url=$@',
    name: 'South Asian University'
  },
  {
    url: 'https://stanford.idm.oclc.org/login?url=$@',
    name: 'Stanford University'
  },
  {
    url: 'http://proxy-stlib.klnpa.org/login?url=$@',
    name: 'State Library of Pennsylvania'
  },
  {
    url: 'http://ez.statsbiblioteket.dk:2048/login?url=$@',
    name: 'State and University Library, Aarhus'
  },
  {
    url: 'http://steenproxy.sfasu.edu:2048/login?url=$@',
    name: 'Stephen F. Austin State University'
  },
  {
    url: 'http://ezp.sub.su.se/login?url=$@',
    name: 'Stockholm University'
  },
  {
    url: 'http://ezproxy.hsclib.sunysb.edu/login?url=$@',
    name: 'Stony Brook University'
  },
  {
    url: 'http://proxy.library.stonybrook.edu/login?url=$@',
    name: 'Stony Brook University West Campus'
  },
  {
    url: 'http://ezproxysrv.squ.edu.om:2048/login?url=$@',
    name: 'Sultan Qaboos University'
  },
  {
    url: 'http://openlink.sa.skku.edu/link.n2s?url=$@',
    name: 'Sungkyunkwan University, Campus of Natural Science'
  },
  {
    url: 'http://openlink.ca.skku.edu/link.n2s?url=$@',
    name: 'Sungkyunkwan University, Humanities/Social Science Campus'
  },
  {
    url: 'http://ezproxy.sunway.edu.my/login?url=$@',
    name: 'Sunway University'
  },
  {
    url: 'http://ezproxy.lib.swin.edu.au/login?url=$@',
    name: 'Swinburne University'
  },
  {
    url: 'https://login.libezproxy2.syr.edu/login?url=$@',
    name: 'Syracuse University'
  },
  {
    url: 'http://ezproxy.taylors.edu.my/login?url=$@',
    name: 'Taylor\'s University'
  },
  {
    url: 'http://proxy.findit.dtu.dk/login?url=$@',
    name: 'Technical University of Denmark'
  },
  {
    url: 'http://ezlibrary.technion.ac.il/login?url=$@',
    name: 'Technion'
  },
  {
    url: 'http://rproxy.tau.ac.il/login?url=$@',
    name: 'Tel Aviv University (TAU)'
  },
  {
    url: 'http://libproxy.temple.edu/login?url=$@',
    name: 'Temple University'
  },
  {
    url: 'http://dbproxy.tamut.edu/login?url=$@',
    name: 'Texas A&M University - Texarkana'
  },
  {
    url: 'http://ezproxy.library.tamu.edu/login?url=$@',
    name: 'Texas A&M Universtiy'
  },
  {
    url: 'https://login.libproxy.txstate.edu/login?qurl=$@',
    name: 'Texas State University'
  },
  {
    url: 'http://web2.trentu.ca:2048/login?url=$@',
    name: 'Trent University'
  },
  {
    url: 'http://elib.tcd.ie/login?url=$@',
    name: 'Trinity College Dublin, Ireland'
  },
  {
    url: 'http://www.library.tufts.edu/ezproxy/exproxy.asp?LOCATION=$@',
    name: 'Tufts University'
  },
  {
    url: 'http://libproxy.tulane.edu:2048/login?url=$@',
    name: 'Tulane University'
  },
  {
    url: 'https://libproxy.berkeley.edu/login?url=$@',
    name: 'UC Berkeley'
  },
  {
    url: 'http://uchastings.idm.oclc.org/login?url=$@',
    name: 'UC Hastings College of the Law'
  },
  {
    url: 'http://proxy.library.ucsd.edu:2048/login?url=$@',
    name: 'UC San Diego'
  },
  {
    url: 'http://ezproxy.uned.es/login?url=$@',
    name: 'UNED'
  },
  {
    url: 'http://libproxy.uthscsa.edu/login?url=$@',
    name: 'UT Health Center San Antonio'
  },
  {
    url: 'http://proxy.ub.umu.se/login?url=$@',
    name: 'Umea University'
  },
  {
    url: 'http://libproxy.unm.edu/login?url=$@',
    name: 'Univeristy of New Mexico'
  },
  {
    url: 'https://login.ezproxy.uax.es/login?url=$@',
    name: 'Universidad Alfonso X El Sabio'
  },
  {
    url: 'http://pbidi.unam.mx:8080/login?url=$@',
    name: 'Universidad Autónoma de México'
  },
  {
    url: 'https://strauss.uc3m.es:2443/login?url=$@',
    name: 'Universidad Carlos III de Madrid'
  },
  {
    url: 'http://ezproxy.uis.edu.co:2048/login?url=$@',
    name: 'Universidad Industrial de Santander'
  },
  {
    url: 'https://biblioteca.ibt.unam.mx:8080/login?url=$@',
    name: 'Universidad Nacional Autónoma de México Campus Morelos'
  },
  {
    url: 'http://ezproxy.unal.edu.co/login?url=$@',
    name: 'Universidad Nacional de Colombia'
  },
  {
    url: 'http://ezproxy.unvm.edu.ar/login?url=$@',
    name: 'Universidad Nacional de Villa María'
  },
  {
    url: 'https://uchile.idm.oclc.org/login?url=$@',
    name: 'Universidad de Chile'
  },
  {
    url: 'http://bd.univalle.edu.co/login?url=$@',
    name: 'Universidad del Valle'
  },
  {
    url: 'http://ez29.periodicos.capes.gov.br/login?url=$@',
    name: 'Universidade Federal do Rio de Janeiro (UFRJ)'
  },
  {
    url: 'http://remote-lib.ui.ac.id/login?url=$@',
    name: 'Universitas Indonesia'
  },
  {
    url: 'https://login.are.uab.cat/login?url=$@',
    name: 'Universitat Autonoma de Barcelona'
  },
  {
    url: 'http://recursos.biblioteca.upc.edu/login?url=$@',
    name: 'Universitat Politècnica de Catalunya'
  },
  {
    url: 'http://ezproxy.um.edu.my/login.htm?url=$@',
    name: 'Universiti Malaya'
  },
  {
    url: 'http://ezproxy.unimap.edu.my/login?url=$@',
    name: 'Universiti Malaysia Perlis'
  },
  {
    url: 'http://ezproxy.upm.edu.my/login?url=$@',
    name: 'Universiti Putra Malaysia'
  },
  {
    url: 'https://ezproxy.usm.my/login?url=$@',
    name: 'Universiti Sains Malaysia'
  },
  {
    url: 'http://ezaccess.library.uitm.edu.my/login?url=$@',
    name: 'Universiti Teknologi MARA'
  },
  {
    url: 'https://libezp.utar.edu.my/login?url=$@',
    name: 'Universiti Tunku Abdul Rahman'
  },
  {
    url: 'https://libproxy.ucl.ac.uk/login?url=$@',
    name: 'University College London'
  },
  {
    url: 'https://ezproxy.uni-giessen.de/login?url=$@',
    name: 'University Giessen'
  },
  {
    url: 'http://ezproxy.psz.utm.my/login?url=$@',
    name: 'University Teknologi Malaysia'
  },
  {
    url: 'http://ezproxy.server.hv.se/login?url=$@',
    name: 'University West'
  },
  {
    url: 'https://proxy.library.adelaide.edu.au/login?url=$@',
    name: 'University of Adelaide'
  },
  {
    url: 'http://ezproxy.uakron.edu:2048/login?url=$@',
    name: 'University of Akron'
  },
  {
    url: 'http://fetch.mhsl.uab.edu/login?url=$@',
    name: 'University of Alabama at Birmingham '
  },
  {
    url: 'http://login.ezproxy.library.ualberta.ca/login?url=$@',
    name: 'University of Alberta'
  },
  {
    url: 'http://ezproxy.library.arizona.edu/login?url=$@',
    name: 'University of Arizona'
  },
  {
    url: 'http://ezproxy.auckland.ac.nz/login?url=$@',
    name: 'University of Auckland'
  },
  {
    url: 'http://libproxy.bath.ac.uk/login?url=$@',
    name: 'University of Bath'
  },
  {
    url: 'http://ezproxy.bham.ac.uk/login?url=$@',
    name: 'University of Birmingham'
  },
  {
    url: 'http://ezproxy.brad.ac.uk/login?url=$@',
    name: 'University of Bradford'
  },
  {
    url: 'http://ezproxy.library.ubc.ca/login?url=$@',
    name: 'University of British Columbia'
  },
  {
    url: 'http://ezproxy.lib.ucalgary.ca:2048/login?url=$@',
    name: 'University of Calgary'
  },
  {
    url: 'https://ucsf.idm.oclc.org/login?qurl=$@',
    name: 'University of California San Francisco'
  },
  {
    url: 'http://proxy.library.ucsb.edu:2048/login?url=$@',
    name: 'University of California Santa Barbara'
  },
  {
    url: 'http://ezproxy.lib.cam.ac.uk:2048/login?url=$@',
    name: 'University of Cambridge'
  },
  {
    url: 'https://login.ezproxy.canberra.edu.au/login?url=$@',
    name: 'University of Canberra'
  },
  {
    url: 'http://ezproxy.canterbury.ac.nz/login?url=$@',
    name: 'University of Canterbury, NZ'
  },
  {
    url: 'http://ezproxy.uct.ac.za/login?url=$@',
    name: 'University of Cape Town'
  },
  {
    url: 'http://ezproxy.net.ucf.edu/login?url=$@',
    name: 'University of Central Florida'
  },
  {
    url: 'https://cvpn.uchicago.edu/login?url=$@',
    name: 'University of Chicago'
  },
  {
    url: 'http://proxy.libraries.uc.edu/login?url=$@',
    name: 'University of Cincinnati'
  },
  {
    url: 'http://proxy.hsl.ucdenver.edu/login?url=$@',
    name: 'University of Colorado Anschutz Medical Campus'
  },
  {
    url: 'https://colorado.idm.oclc.org/login?url=$@',
    name: 'University of Colorado Boulder'
  },
  {
    url: 'https://libproxy.uccs.edu/login?url=$@',
    name: 'University of Colorado Colorado Springs'
  },
  {
    url: 'http://ezproxy.lib.uconn.edu/login?url=$@',
    name: 'University of Connecticut'
  },
  {
    url: 'http://du.idm.oclc.org/login?url=$@',
    name: 'University of Denver'
  },
  {
    url: 'http://ezproxy.derby.ac.uk/login?url=$@',
    name: 'University of Derby'
  },
  {
    url: 'http://ezproxy.libraries.udmercy.edu:2048/login?url=$@',
    name: 'University of Detroit Mercy'
  },
  {
    url: 'http://ezproxy.is.ed.ac.uk/login?url=$@',
    name: 'University of Edinburgh'
  },
  {
    url: 'https://login.lp.hscl.ufl.edu/login?url=$@',
    name: 'University of Florida'
  },
  {
    url: 'http://ezproxy.ub.gu.se/login?url=$@',
    name: 'University of Gothenburg'
  },
  {
    url: 'https://login.proxy-ub.rug.nl/login?url=$@',
    name: 'University of Groningen'
  },
  {
    url: 'http://subzero.lib.uoguelph.ca/login?url=$@',
    name: 'University of Guelph'
  },
  {
    url: 'https://ezproxy.haifa.ac.il/login?url=$@',
    name: 'University of Haifa'
  },
  {
    url: 'http://eres.library.manoa.hawaii.edu/login?url=$@',
    name: 'University of Hawaii, Manoa'
  },
  {
    url: 'http://eproxy.lib.hku.hk/login?url=$@',
    name: 'University of Hong Kong Libraries'
  },
  {
    url: 'http://ezproxy.lib.uh.edu/login?url=$@',
    name: 'University of Houston'
  },
  {
    url: 'http://proxy.cc.uic.edu/login?url=$@',
    name: 'University of Illinois at Chicago'
  },
  {
    url: 'https://proxy2.library.illinois.edu/login?url=$@',
    name: 'University of Illinois at Urbana-Champaign'
  },
  {
    url: 'http://ezproxy.lib.indiana.edu/login?url=$@',
    name: 'University of Indiaia'
  },
  {
    url: 'https://login.proxy.lib.uiowa.edu/login?qurl=$@',
    name: 'University of Iowa'
  },
  {
    url: 'https://login.proxy.kumc.edu/login?qurl=$@',
    name: 'University of Kansas Medical Center'
  },
  {
    url: 'http://ezproxy.uky.edu/login?url=$@',
    name: 'University of Kentucky'
  },
  {
    url: 'https://ezproxy.ukzn.ac.za:2443/login?url=$@',
    name: 'University of KwaZulu Natal'
  },
  {
    url: 'http://ezproxy.lib.le.ac.uk/login?url=$@',
    name: 'University of Leicester'
  },
  {
    url: 'http://echo.louisville.edu/login?url=$@',
    name: 'University of Louisville'
  },
  {
    url: 'http://www.library.umaine.edu/auth/EZProxy/test/authej.asp?url=$@',
    name: 'University of Maine System'
  },
  {
    url: 'http://proxy2.lib.umanitoba.ca/login?url=$@',
    name: 'University of Manitoba'
  },
  {
    url: 'http://proxy-bc.researchport.umd.edu/login?url=$@',
    name: 'University of Maryland, Baltimore County (UMBC)'
  },
  {
    url: 'http://proxy-um.researchport.umd.edu/login?url=$@',
    name: 'University of Maryland, College Park'
  },
  {
    url: 'http://ezproxy.lib.umb.edu/login?url=$@',
    name: 'University of Massachusetts Boston'
  },
  {
    url: 'http://silk.library.umass.edu/login?url=$@',
    name: 'University of Massachusetts, Amherst'
  },
  {
    url: 'https://ezp.lib.unimelb.edu.au/login?url=$@',
    name: 'University of Melbourne'
  },
  {
    url: 'http://proxy.lib.umich.edu/login?url=$@',
    name: 'University of Michigan'
  },
  {
    url: 'https://www.lib.umn.edu/log.phtml?url=$@',
    name: 'University of Minnesota'
  },
  {
    url: 'https://login.libpdb.d.umn.edu:2443/login?url=$@',
    name: 'University of Minnesota Duluth'
  },
  {
    url: 'http://ezproxy.umsl.edu/login?url=$@',
    name: 'University of Missouri - St. Louis'
  },
  {
    url: 'https://login.ezproxy.library.unlv.edu/login?url=$@',
    name: 'University of Nevada, Las Vegas'
  },
  {
    url: 'http://ezproxy.une.edu.au/login?url=$@',
    name: 'University of New England (Australia)'
  },
  {
    url: 'https://login.ezproxy.newcastle.edu.au/login?url=$@',
    name: 'University of Newcastle, Australia'
  },
  {
    url: 'http://libproxy.lib.unc.edu/login?url=$@',
    name: 'University of North Carolina at Chapel Hill'
  },
  {
    url: 'https://librarylink.uncc.edu/login?url=$@',
    name: 'University of North Carolina at Charlotte'
  },
  {
    url: 'http://uproxy.library.dc-uoit.ca/login?url=$@',
    name: 'University of Ontario Institute of Technology'
  },
  {
    url: 'https://marvin.otago.ac.nz/group_rooms/ezproxy/ezproxy_auth.php?url=$@',
    name: 'University of Otago'
  },
  {
    url: 'https://login.proxy.bib.uottawa.ca/login?url=$@',
    name: 'University of Ottawa'
  },
  {
    url: 'https://ezproxy-prd.bodleian.ox.ac.uk/login?url=$@',
    name: 'University of Oxford'
  },
  {
    url: 'https://proxy.library.upenn.edu/login?url=$@',
    name: 'University of Pennsylvania'
  },
  {
    url: 'http://pitt.idm.oclc.org/login?url=$@',
    name: 'University of Pittsburgh'
  },
  {
    url: 'http://ezproxy.library.uq.edu.au/login?url=$@',
    name: 'University of Queensland'
  },
  {
    url: 'http://uri.idm.oclc.org/login?url=$@',
    name: 'University of Rhode Island'
  },
  {
    url: 'http://ezp.lib.rochester.edu/login?url=$@',
    name: 'University of Rochester'
  },
  {
    url: 'https://ezproxy.usc.edu.ph/login?url=$@',
    name: 'University of San Carlos'
  },
  {
    url: 'https://sandiego.idm.oclc.org/login?url=$@',
    name: 'University of San Diego'
  },
  {
    url: 'http://ezproxy.ust.edu.ph/login?url=$@',
    name: 'University of Santo Tomas'
  },
  {
    url: 'http://cyber.usask.ca/login?url=$@',
    name: 'University of Saskatchewan'
  },
  {
    url: 'http://eresources.shef.ac.uk/login?url=$@',
    name: 'University of Sheffield'
  },
  {
    url: 'https://libproxy.usouthal.edu/login?url=$@',
    name: 'University of South Alabama'
  },
  {
    url: 'https://login.ezlibproxy.unisa.edu.au/login?url=$@',
    name: 'University of South Australia'
  },
  {
    url: 'https://access.library.unisa.edu.au/login?url=$@',
    name: 'University of South Australia '
  },
  {
    url: 'https://pallas2.tcl.sc.edu/login?url=$@',
    name: 'University of South Carolina'
  },
  {
    url: 'http://ezproxy.lib.usf.edu/login?url=$@',
    name: 'University of South Florida'
  },
  {
    url: 'https://libproxy.usc.edu/login?url=$@',
    name: 'University of Southern California'
  },
  {
    url: 'http://proxy1-bib.sdu.dk:2048/login?url=$@',
    name: 'University of Southern Denmark'
  },
  {
    url: 'http://ezproxy.stir.ac.uk/login?url=$@',
    name: 'University of Stirling'
  },
  {
    url: 'http://gate1.inist.fr/login?url=$@',
    name: 'University of Strasbourg'
  },
  {
    url: 'http://ezproxy.sussex.ac.uk/login?url=$@',
    name: 'University of Sussex'
  },
  {
    url: 'http://ezproxy.library.usyd.edu.au/login?url=$@',
    name: 'University of Sydney'
  },
  {
    url: 'http://ezproxy.utlib.ee/login?url=$@',
    name: 'University of Tartu'
  },
  {
    url: 'http://ezproxy.lib.uts.edu.au/login?url=$@',
    name: 'University of Technology, Sydney'
  },
  {
    url: 'https://login.proxy.lib.utk.edu:2050/login?url=$@',
    name: 'University of Tennessee, Knoxville '
  },
  {
    url: 'http://libux.utmb.edu/login?url=$@',
    name: 'University of Texas Medical Branch'
  },
  {
    url: 'http://ezhost.panam.edu:2048/login?url=$@',
    name: 'University of Texas Pan American'
  },
  {
    url: 'http://ezhost.utrgv.edu:2048/login?url=$@',
    name: 'University of Texas Rio Grande Valley'
  },
  {
    url: 'http://ezproxy.lib.utexas.edu/login?url=$@',
    name: 'University of Texas at Austin'
  },
  {
    url: 'http://pathfinder.utb.edu:2048/login?url=$@',
    name: 'University of Texas at Brownsville'
  },
  {
    url: 'https://login.libweb.lib.utsa.edu/login?url=$@',
    name: 'University of Texas at San Antonio'
  },
  {
    url: 'https://login.ezoris.lib.u-tokyo.ac.jp/login?url=$@',
    name: 'University of Tokyo (UTOKYO)'
  },
  {
    url: 'http://myaccess.library.utoronto.ca/login?url=$@',
    name: 'University of Toronto'
  },
  {
    url: 'https://login.ezproxy.lib.utah.edu/login?url=$@',
    name: 'University of Utah'
  },
  {
    url: 'http://login.ezproxy.library.uvic.ca/login?url=$@',
    name: 'University of Victoria'
  },
  {
    url: 'http://proxy.its.virginia.edu/login?url=$@',
    name: 'University of Virginia'
  },
  {
    url: 'https://ezproxy.uwtsd.ac.uk/login?url=$@',
    name: 'University of Wales Trinity St Davids'
  },
  {
    url: 'https://pugwash.lib.warwick.ac.uk/wamvalidate?url=$@',
    name: 'University of Warwick'
  },
  {
    url: 'http://offcampus.lib.washington.edu/login?url=$@',
    name: 'University of Washington'
  },
  {
    url: 'http://proxy.lib.uwaterloo.ca/login?url=$@',
    name: 'University of Waterloo'
  },
  {
    url: 'http://ezproxy.library.uwa.edu.au/login?url=$@',
    name: 'University of Western Australia'
  },
  {
    url: 'https://www.lib.uwo.ca/cgi-bin/ezpauthn.cgi?url=$@',
    name: 'University of Western Ontario'
  },
  {
    url: 'https://login.ezproxy.uws.edu.au/login?url=$@',
    name: 'University of Western Sydney'
  },
  {
    url: 'http://ezproxy.uwindsor.ca/login?url=$@',
    name: 'University of Windsor'
  },
  {
    url: 'https://ezproxy.lib.uwm.edu/login?url=$@',
    name: 'University of Wisconsin - Milwaukee'
  },
  {
    url: 'https://link.uwsuper.edu:9433/login?url=$@',
    name: 'University of Wisconsin - Superior'
  },
  {
    url: 'http://ezproxy.library.wisc.edu/login?url=$@',
    name: 'University of Wisconsin Madison'
  },
  {
    url: 'http://ezproxy.uow.edu.au/login?url=$@',
    name: 'University of Wollongong'
  },
  {
    url: 'http://ezproxy.wlv.ac.uk/login?url=$@',
    name: 'University of Wolverhampton'
  },
  {
    url: 'http://ezproxy.york.ac.uk/login?url=$@',
    name: 'University of York'
  },
  {
    url: 'http://roble.unizar.es:9090/login?url=$@',
    name: 'University of Zaragoza'
  },
  {
    url: 'http://ezproxy.pacific.edu/login?url=$@',
    name: 'University of the Pacific'
  },
  {
    url: 'http://ezproxy.engglib.upd.edu.ph/login?url=$@',
    name: 'University of the Philippines College of Engineering'
  },
  {
    url: 'https://innopac.wits.ac.za/validate?url=$@',
    name: 'University of the Witwatersrand'
  },
  {
    url: 'https://www.ezp.biblio.unitn.it/login?url=$@',
    name: 'Università di Trento'
  },
  {
    url: 'http://px.units.it/login?url=$@',
    name: 'Università di Trieste'
  },
  {
    url: 'http://acces.bibl.ulaval.ca/login?url=$@',
    name: 'Université Laval'
  },
  {
    url: 'http://ezproxy.ulb.ac.be/login?url=$@',
    name: 'Université Libre de Bruxelles'
  },
  {
    url: 'http://buproxy.univ-lille1.fr/login?url=$@',
    name: 'Université Lille 1'
  },
  {
    url: 'http://ezproxy.math-info-paris.cnrs.fr/login?url=$@',
    name: 'Université Paris 6 et 7 - Mathématiques Informatique Recherche'
  },
  {
    url: 'http://accesdistant.upmc.fr/login?url=$@',
    name: 'Université Pierre et Marie Curie - Paris 6'
  },
  {
    url: 'http://ezproxy.univ-artois.fr/login?url=$@',
    name: 'Université d\'Artois'
  },
  {
    url: 'http://ezproxy.universite-paris-saclay.fr/login?url=$@',
    name: 'Université d\'Évry Val d\'Essonne'
  },
  {
    url: 'http://proxy.bibliotheques.uqam.ca/login?url=$@',
    name: 'Université de Québec à Montréal'
  },
  {
    url: 'https://ezproxy.usherbrooke.ca/login?URL=$@',
    name: 'Université de Sherbrooke'
  },
  {
    url: 'https://scd-rproxy.u-strasbg.fr/login?url=$@',
    name: 'Université de Strasbourg'
  },
  {
    url: 'http://ezproxy.its.uu.se/login?url=$@',
    name: 'Uppsala University'
  },
  {
    url: 'http://dist.lib.usu.edu/login?url=$@',
    name: 'Utah State University'
  },
  {
    url: 'https://login.proxy.library.uu.nl/login?url=$@',
    name: 'Utrecht University'
  },
  {
    url: 'http://hvhl.idm.oclc.org/login?url=$@',
    name: 'Van Hall Larenstein'
  },
  {
    url: 'http://proxy.library.vanderbilt.edu/login?url=$@',
    name: 'Vanderbilt University'
  },
  {
    url: 'https://login.helicon.vuw.ac.nz/login?url=$@',
    name: 'Victoria University of Wellington'
  },
  {
    url: 'http://uaccess.univie.ac.at/login?url=$@',
    name: 'Vienna University Library '
  },
  {
    url: 'https://proxy.library.vcu.edu/login?url=$@',
    name: 'Virginia Commonwealth University'
  },
  {
    url: 'https://login.ezproxy.lib.vt.edu/login?qurl=$@',
    name: 'Virginia Tech'
  },
  {
    url: 'https://www.vub.ac.be/cgi-bin/ezlogin?url=$@',
    name: 'Vrije Universiteit Brussel'
  },
  {
    url: 'http://ezproxy.library.wur.nl/login?url=$@ ',
    name: 'Wageningen UR'
  },
  {
    url: 'http://ezp.waldenulibrary.org/login?url=$@',
    name: 'Walden University'
  },
  {
    url: 'https://beckerproxy.wustl.edu/login?url=$@',
    name: 'Washington University School of Medicine'
  },
  {
    url: 'http://libproxy.wustl.edu/login?url=$@',
    name: 'Washington University in St. Louis'
  },
  {
    url: 'http://proxy.lib.wayne.edu/login?url=$@',
    name: 'Wayne State University'
  },
  {
    url: 'https://ezproxy.weizmann.ac.il/login?url=$@',
    name: 'Weizmann Institute of Science'
  },
  {
    url: 'http://proxy-wcupa.klnpa.org/login?url=$@',
    name: 'West Chester University'
  },
  {
    url: 'https://login.databases.wtamu.edu/login?url=$@',
    name: 'West Texas A&M University'
  },
  {
    url: 'https://galanga.hvl.no/login?url=$@',
    name: 'Western Norway University of Applied Sciences (HVL)'
  },
  {
    url: 'http://ezproxy.library.wwu.edu/login?url=$@',
    name: 'Western Washington University'
  },
  {
    url: 'http://ezproxy.wscal.edu/login?url=$@',
    name: 'Westminster Seminary California'
  },
  {
    url: 'http://ezproxy.wheaton.edu/login?url=$@',
    name: 'Wheaton College'
  },
  {
    url: 'http://libproxy.wlu.ca/login?url=$@',
    name: 'Wilfrid Laurier University'
  },
  {
    url: 'http://ezproxy.woodbury.edu:880/login?url=$@',
    name: 'Woodbury University'
  },
  {
    url: 'http://ezproxy.wpi.edu/login?url=$@',
    name: 'Worcester Polytechnic Institute'
  },
  {
    url: 'http://proxy.wmu.se/login?url=$@',
    name: 'World Maritime University'
  },
  {
    url: 'http://ezproxy.libraries.wright.edu:2048/login?url=$@',
    name: 'Wright State University'
  },
  {
    url: 'http://ezproxy.library.yorku.ca/login?url=$@',
    name: 'York University'
  }
];


var urls = {
  'sdirect': {
    'base': 'https://www.sciencedirect.com/science/article/pii/',
    'selector': 'body'
  },
  'wiley': {
    'base': 'https://onlinelibrary.wiley.com/doi',
    'selector': '#pb-page-content > div > div.pageBody > div > div > section > div > div > div > div > article > div > div.col-sm-12.col-md-8.col-lg-8.article__content.article-row-left > nav > div'
  },
  'nature': {
    'base': 'https://www.nature.com/articles/',
    'selector': '.ie11-list-hack'
  },
  'springer': {
    'base': 'https://link.springer.com/article/',
    'selector': '.MainTitleSection'   
  },
  'uptodate': {
    'base': 'https://www.uptodate.com/',
    'selector': '.wk-navbar-container'
  },
  'bmj': {
    'base': 'bmj.com/',
    'selector': '.menu'
  },
  'tandf': {
    'base': 'https://www.tandfonline.com',
    'selector': '.toc-heading'
  },
  'sage': {
    'base': 'journals.sagepub.com',
    'selector': '.publicationContentTitle'
  },
  'ieee': {
    'base': 'ieeexplore.ieee.org',
    'selector': '.document-banner'
  },
  'oup': {
    'base': 'academic.oup.com',
    'selector': '.wi-article-title'
  },
  'ovid': {
    'base': 'insights.ovid.com',
    'selector': '.oi-article-meta'
  },
  'doi': {
    'base': 'dx.doi.org',
  },
  'jama': {
    'base': 'jamanetwork.com',
    'selector': '.toolbar'
  },
  'elsevier': {
    'base': 'elsevier.com'
  },
  'plos': { // For Chrome Web Store screenshot
    'base': 'plos.org'
  },
  'mit': {
    'base': 'mitpressjournals.org',
    'selector': '#pb-page-content > div > div.fix-width > div > div > div > div > div.journalHome > div > div > div > div > div.col-xs-11-24.publicationPagesCol2 > div > div:nth-child(1) > div > div:nth-child(3) > div.res-publication-content > div > div.ecommAbs.ja > article > div > ul'
  },
  'cam': {
    'base': 'cambridge.org/core',
    'selector': '#Top > div > div.overview.no-margin-bottom > h1'
  },
  'deg': {
    'base': 'degruyter.com',
    'selector': '.gs-titleheader'
  },
  'acs': {
    'base': 'pubs.acs.org',
    'selector': '.hlFld-Title'
  }       
};
