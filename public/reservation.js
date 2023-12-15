window.onload=function(){

	while(true){
		people=prompt("예약할 인원 수 입력해주세요","4");
		pp=Number(people);
		if(pp>0 && pp<9){break;}
		else{alert("1명 이상 8명 이하만 가능합니다. ")}
	}
	



	li=document.querySelectorAll(".pop_inner li");

	box=document.getElementById('pop_info');
	btn_close=document.getElementsByClassName('btn_close')[0];
	btn_close.addEventListener('click',function(){
		box.style.display='none';
	})

	table=document.getElementById('calendar');

	table.addEventListener('click', function (event) {
    if (event.target.nodeName == 'TD' && event.target.innerText > 0 && event.target.innerText < 32) {
        box.style.display = 'block';
        tmp = 10000 * (year - 2000) + 100 * (month + 1) + Number(event.target.innerText);
        box.children[0].children[0].innerHTML = year + '년 ' + (month + 1) + '월 ' + event.target.innerText + '일';

        tmp_date = parseInt(event.target.innerText);

        dataSending_1 = {
            yy: year,
            mm: month + 1,
            dd: tmp_date,
            hh: 12,
            pp: pp
        };

        dataSending_2 = {
            yy: year,
            mm: month + 1,
            dd: tmp_date,
            hh: 18,
            pp: pp
        };

        // 기존에 등록된 이벤트 리스너 제거
        li[0].removeEventListener('click', handleLiClick_1);
        li[1].removeEventListener('click', handleLiClick_2);

        // 첫 번째 fetch 호출
        fetch('/processClick_1', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ data: dataSending_1 }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.ok) {
                // 새로운 이벤트 리스너 추가
                li[0].addEventListener('click', handleLiClick_1);
                li[0].style.color="white";
            }
            else{
                li[0].style.color="yellow";
            }
        })
        .catch(error => console.error('첫 번째 fetch 에러:', error))
        .finally(() => {
            // 두 번째 fetch 호출
            fetch('/processClick_1', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ data: dataSending_2 }),
            })
            .then(response =>response.json())
            .then(data => {
                // 서버에서 받은 데이터로 업데이트
                // 예: data를 사용하여 UI 업데이트 등
                if (data.ok) {
                    // 새로운 이벤트 리스너 추가
                    li[1].addEventListener('click', handleLiClick_2);
                    li[1].style.color="white";
                }
                else{
                    li[1].style.color="yellow";
                }
                console.log('두 번째 fetch 응답:', data.ok);
            })
            .catch(error => console.error('두 번째 fetch 에러:', error));
        });
    }
});

	function handleLiClick_1(event) {
    tmp_r = window.confirm("예약하시겠습니까?");
    if (tmp_r) {
        fetch('/processClick_2', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ data: dataSending_1 }),
        })
        .then(response =>response.json())
        .then(data => {
					if(data.ok){
						alert("예약되었습니다!");
					}
					else{
						alert("예약이 가득 찼습니다!");
					}
        })
        .catch(error => console.error('세 번째 fetch 에러:', error));
    }
}

function handleLiClick_2(event) {
	tmp_r = window.confirm("예약하시겠습니까?");
	if (tmp_r) {
			fetch('/processClick_2', {
					method: 'POST',
					headers: {
							'Content-Type': 'application/json',
					},
					body: JSON.stringify({ data: dataSending_2 }),
			})
			.then(response =>response.json())
			.then(data => {
				if(data.ok){
					alert("예약되었습니다!");
				}
				else{
					alert("예약이 가득 찼습니다!");
				}
			})
			.catch(error => console.error('세 번째 fetch 에러:', error));
	}
}

	// calendar 함수
	function calendar(new_year, new_month){
		// 특정 年月을 시작일부터 조회(year, month, date)
		d = new Date(new_year, new_month-1, 1),
				// 월별 일수 구하기
		d_length = 32 - new Date(new_year, new_month-1, 32).getDate(),
		year = d.getFullYear(),
		month = d.getMonth(),
		date = d.getDate(),
		day = d.getDay();

		// caption 영역 날짜 표시 객체
		var caption_year = document.querySelector('.year'),
				caption_month = document.querySelector('.month');

		start_day = document.querySelectorAll('tr td');

		// 테이블 초기화
		for(var i = 0; i < start_day.length; i++){
			start_day[i].innerHTML = '&nbsp;';
		}
		

		for(var i = day; i < day + d_length; i++){
			start_day[i].innerHTML = date;
			date++;
		}

		// caption 날짜 표시
		caption_year.innerHTML = year;
		caption_month.innerHTML = month + 1;		
	}

	(function(){
		var prev = document.getElementById('prev'),
			next = document.getElementById('next'),
			year = new Date().getFullYear(),
			month = new Date().getMonth() + 1;
			
		calendar(year, month);
		prev.onclick = function(){
			calendar(year, --month);
		};
		next.onclick = function(){
			calendar(year, ++month);
		};		
	})();
	
	var my=document.querySelector('.my');

	//~님 ->로그인 상태
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