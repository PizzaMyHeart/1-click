window.onload = function() {
  if (window.location.href.indexOf('https://www.sciencedirect.com/science/article/pii/') > -1 ) {
    fullpdf();
  }
}



/*
window.onload = function() {
  //alert("hello");
  if (document.contains(document.querySelector('[title="Other institution login"]'))) {
    document.querySelector('[title="Other institution login"]').click()
  } 
  else if (document.contains(document.querySelector('[title="View all institutions"]')) && !document.contains(document.querySelector('#sdBody > div.pageContent > div:nth-child(4) > div:nth-child(2) > p:nth-child(6) > a:nth-child(318)'))) {
    document.querySelector('[title="View all institutions"]').click()
  }
  else if (document.contains(document.querySelector('#sdBody > div.pageContent > div:nth-child(4) > div:nth-child(2) > p:nth-child(6) > a:nth-child(318)'))) {
    document.querySelector('#sdBody > div.pageContent > div:nth-child(4) > div:nth-child(2) > p:nth-child(6) > a:nth-child(318)').click()
  }
  else if (document.contains(document.querySelector(".brand_heading"))) {
    document.getElementByName("_eventId_proceed").click();
  }
}
*/