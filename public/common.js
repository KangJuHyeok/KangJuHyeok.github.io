window.onload=function(){
  var my=document.querySelector('.my');
  function fetchData() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4 && xhr.status == 200) {
        // 받은 XML 데이터를 처리
        var xmlData = xhr.responseText;
        if(xmlData[0][0]!='<'){ //<로 오는거면 로그인이 안된것
          data=JSON.parse(xmlData);
          realname=data[0].realname;
          my.innerHTML=`<a href="/logged/my.html">${realname}님</a>`;
       }
      }
    };
    // 서버에 XML 데이터를 요청
    xhr.open('GET', '/getName', true);
    xhr.send();
  }
  fetchData();
}