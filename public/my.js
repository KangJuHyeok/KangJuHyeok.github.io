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

  //나의 예약정보 찾아오기
  fetch('/findMyReservation', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
  })
  .then(response =>response.json())
  .then(data => {
        results=data.results;
        const tbody = document.querySelector('.reserve tbody');

        // results를 이용하여 동적으로 테이블 채우기
        results.forEach(result => {
        // 새로운 행 생성
          const row = document.createElement('tr');

          // 각 열에 데이터 추가
          const columns = [
            document.createElement('td'),
            document.createElement('td'),
            document.createElement('td'),
            document.createElement('td'),
            document.createElement('td'),
            document.createElement('td')
          ];

          columns[0].textContent = result.id; // 예약번호
          columns[1].textContent = result.username; // 예약자
          columns[2].textContent = `${result.yy}-${result.mm}-${result.dd}`; // 날짜
          columns[3].textContent = `${result.hh}:00`; // 시간
          columns[4].textContent = `${result.pp}`;//예약한 사람

          const cancelButton = document.createElement('button');
          cancelButton.textContent = '취소';

          cancelButton.classList.add('cancel-button'); // 클래스 추가

          cancelButton.addEventListener('click',function(){
            tmp_r = window.confirm("예약 취소하시겠습니까?");
            if (tmp_r) {
              fetch('/cancelMyReservation', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ data: result}),
              })
              .then(response =>response.json())
              .catch(error => console.error('fetch 에러:', error));

              row.remove();
            }
          })
          columns[5].appendChild(cancelButton);

          columns.forEach(column => row.appendChild(column));

          tbody.appendChild(row);
       });
  })
  .catch(error => console.error('fetch 에러:', error));
  



   //나의 장바구니 정보 찾아오기
  fetch('/findMyBasket', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
  })
  .then(response =>response.json())
  .then(data => {
        results=data.results;
        const tbody = document.querySelector('.basket tbody');
        console.log(results);

        // results를 이용하여 동적으로 테이블 채우기
        results.forEach(result => {
        // 새로운 행 생성
          const row = document.createElement('tr');

          // 각 열에 데이터 추가
          const columns = [
            document.createElement('td'),
            document.createElement('td'),
            document.createElement('td'),
            document.createElement('td'),
            document.createElement('td'),
            document.createElement('td')
          ];

          columns[0].textContent = result.id; // 물건번호
          columns[1].textContent = result.name; // 물건이름
          columns[2].textContent = result.price; // 물건가격
          columns[3].textContent = result.quantity; // 물건개수
          columns[4].textContent = result.price*result.quantity;//가격합

          const cancelButton = document.createElement('button');
          cancelButton.textContent = '취소';
          cancelButton.classList.add('cancel-button'); // 클래스 추가

          cancelButton.addEventListener('click',function(){
            tmp_r = window.confirm("장바구니에서 비우겠습니까?");
            if (tmp_r) {
              fetch('/cancelMyBasket', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ data: result}),
              })
              .then(response =>response.json())
              .catch(error => console.error('fetch 에러:', error));
              row.remove();
            }
          })
          columns[5].appendChild(cancelButton);

          columns.forEach(column => row.appendChild(column));

          tbody.appendChild(row);
       });
       })
  .catch(error => console.error('fetch 에러:', error));

  btn_account=document.querySelector('.account');

  btn_account.addEventListener('click', function () {
    // 서버로부터 장바구니 정보 받아오기
    fetch('/accountMyBasket', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        // 장바구니 정보 업데이트
        results = data.results;
        user_results=data.user_results[0];
  
        // 계산
        totalAmount = results.reduce((total, item) => total + (item.price * item.quantity), 0);
        tmp_ok = window.confirm("웹에 저장된 "+user_results.realname+"님의 주소는 "+user_results.address+"입니다.\n"+"총 가격은"+totalAmount + "원 입니다. 계산하시겠습니까?");
      })
      .catch(error => console.error('fetch 에러:', error));
  });
}