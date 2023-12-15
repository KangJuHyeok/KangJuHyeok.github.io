window.onload = function () {
  var my = document.querySelector('.my');

  function fetchData() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4 && xhr.status == 200) {
        // 받은 XML 데이터를 처리
        var xmlData = xhr.responseText;
        if (xmlData[0][0] !== '<') {
          // <로 오는거면 로그인이 안된것
          data = JSON.parse(xmlData);
          realname = data[0].realname;
          my.innerHTML = `<a href="/logged/my.html">${realname}님</a>`;
        }
      }
    };
    // 서버에 XML 데이터를 요청
    xhr.open('GET', '/getName', true);
    xhr.send();
  }

  fetchData();

  var detailsContainer = document.getElementById('detailsContainer');
  function displayPostDetails(postId) {
    // 서버에 글의 세부 정보 요청
    fetch(`/getPostDetails/${postId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(postDetails => {
        postDetails=postDetails[0];
        postDetails.created_at=formatDate(postDetails.created_at);
        console.log(postDetails);
        // postDetails를 이용하여 세부 정보를 표시
        detailsContainer.innerHTML = `
        <div class="post-details">
          <h2>${postDetails.title}</h2>
          <p>작성자: ${postDetails.username}</p>
          <p>작성일: ${postDetails.created_at}</p>
          <p>${postDetails.content}</p>
        </div>
      `;
        // 여기에서 화면에 세부 정보를 표시하는 코드를 작성
      })
      .catch(error => console.error('fetch 에러:', error));
  }

  function createTableRow(result) {
    // 새로운 행 생성
    const row = document.createElement('tr');

    // 각 열에 데이터 추가
    const columns = [
      document.createElement('td'),
      document.createElement('td'),
      document.createElement('td'),
    ];

    columns[0].textContent = result.title; // 글 제목
    columns[1].textContent = result.username; // 글쓴이
    columns[2].textContent = formatDate(result.created_at); // 작성날짜

    columns.forEach((column, index) => {
      // 글 제목에 클릭 이벤트 추가
      if (index === 0) {
        column.addEventListener('click', () => {
          // 클릭된 행의 글 ID를 가져와서 해당 글의 세부 정보를 표시
          const postId = result.post_id; // 예시: result 객체에 글의 ID
          displayPostDetails(postId);
        });
      }
      row.appendChild(column);
    });

    return row;
  }
  function formatDate(dateString) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'UTC' };
    const formattedDate = new Date(dateString).toLocaleString('ko-KR', options);
    return formattedDate;
  }

  // 글 정보 찾아오기
  fetch('/findReview', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      const results = data.results.reverse();
      const tbody = document.querySelector('.review tbody');

      // results를 이용하여 동적으로 테이블 채우기
      results.forEach(result => {
        const row = createTableRow(result);
        tbody.appendChild(row);
      });
    })
    .catch(error => console.error('fetch 에러:', error));
};