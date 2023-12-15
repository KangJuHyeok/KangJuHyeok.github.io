window.onload=function(){
  var wrapper = document.querySelector('.wrapper'),
    page = document.querySelectorAll('.page'),
    indicator = document.getElementById('indicator'),
    indicator_li = indicator.querySelectorAll('li');

  var yDeg = 0,
    indicator_num = 1,
    indicator_length = page.length,
    w = page[0].offsetWidth,
    page_angle = 0,
    page_vector = 0;

  var lightbox=document.querySelector('#lightbox'),
    block=document.querySelector('#block'),
    move=document.querySelector('.move'),
    details=document.querySelectorAll('i'),
    btn_close=document.querySelector('.btn-close');

  var menu=document.querySelectorAll('.menu');
  

  //3D효과
  function init_page(){
    w = page[0].offsetWidth;

    for(var i = 0; i < page.length; i++){
      page[i].style.transform = 'rotateY(' + page_angle + 'deg) translateZ(' + (w/2) + 'px)';
      page_angle += 90;
    }

    wrapper.style.transform = 'translateZ(' + (-w/2) + 'px) rotateY(' + yDeg + 'deg)';
  }			

  function init_indicator(){
    for(var i = 0; i < indicator_length; i++){
      indicator.innerHTML += '<li>' + (i+1) + '</li>';
    }		

    indicator_li = indicator.querySelectorAll('li'); 
    change_page(indicator_num);		
  }

  function change_page(inum){
    indicator_li[inum-1].setAttribute('class', 'active');
    yDeg = -90 * (inum - 1);
    wrapper.style.transform = 'translateZ(' + (-w/2) + 'px) rotateY(' + yDeg + 'deg)';

    for(var i = 0; i < indicator_li.length; i++){
      indicator_li[i].removeAttribute('class');
    }
    indicator_li[inum - 1].setAttribute('class', 'active');			
  }

  init_page();
  init_indicator();

  for(var i = 0; i < indicator_li.length; i++){
    indicator_li[i].addEventListener('click', function(){
      indicator_num = parseInt(this.innerText);
      change_page(indicator_num);
    });
  }

  //3d 효과 시간 설정 
  
  var a=setInterval(function(){
    if(indicator_num<4){
      indicator_num++;
    }
    else{
      indicator_num=1;
    }
    change_page(indicator_num)
  },5000);

  // 자세히 누르면 라이트박스
function lightbox_open(num) {
  lightbox.setAttribute('class', 'active');
  block.setAttribute('class', 'active');

  for (let i = 0; i < menu.length; i++) {
      menu[i].style.display = "none";
  }

  menu[num].style.display = "block";
  change_img(num, 0); // 초기 이미지를 첫 번째 이미지로 설정
}

food_data=[["트러플 버섯","바질페스토 스테이크","두부","메추리 알"],
["리크 완자","타말레","빵","스쿼브 샹테렐"],
["마늘","해산물 알","와규","캐비어 타르트"],
["참치","빵과 크림","차완무시","바닐라 아이스크림"]]
//이미지 파일 출처는 nightbirds와 밍글스라는 음식점

function change_img(val, delta) {
  var imgs = document.querySelectorAll('.menu')[val].querySelectorAll('figure > img');
  var activeIndex = -1;

  for (var i = 0; i < imgs.length; i++) {
      if (imgs[i].classList.contains('active')) {
          activeIndex = i;
          imgs[i].removeAttribute('class');
      }
  }
  // 이미지 변경
  var newIndex = (activeIndex + delta + imgs.length) % imgs.length;
  imgs[newIndex].setAttribute('class', 'active');

  imgs[newIndex].style.width = '100%';
  imgs[newIndex].style.height = '100%';

  var paragraphs = document.querySelectorAll('.menu p');
    paragraphs.forEach(function (paragraph, idx) {
      paragraph.textContent = (newIndex + 1) + '번째 요리 : ' + food_data[idx][newIndex]; // 적절한 내용으로 변경
    });
}

for (var i = 0; i < details.length; i++) {
  details[i].addEventListener('click', function (event) {
      var index = i;
      return function () {
          lightbox_open(index);
      };
  }());
}

// 라이트박스 화살표 버튼 구현
document.querySelectorAll('.move span').forEach(function (arrow, index) {
  arrow.addEventListener('click', function () {
      var currentMenu = document.querySelector('.menu[style="display: block;"]');
      var currentIndex = Array.from(menu).indexOf(currentMenu);
      change_img(currentIndex, index === 0 ? -1 : 1);
  });
});

// 라이트박스 x 버튼 구현
document.querySelector('.btn-close').addEventListener('click', function () {
  lightbox.removeAttribute('class');
  block.removeAttribute('class');
});

  
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
  //윈도우 사이즈에 맞게 3d페이지 resize
  window.onresize = function(){
    init_page();	
  }
}
