window.onload=function(){
  const productList = document.querySelector('.product-list');
  const cartList = document.querySelector('.cart-list');
  var my=document.querySelector('.my');

  // 사용자의 로그인 상태
  let isLoggedIn = false;

  // 장바구니 아이템을 객체로 저장하는 배열
  const cartItems = [];

  // 상품 목록에서 클릭 시 장바구니에 추가
  productList.addEventListener('click', (event) => {
    const target = event.target;
    if (target.tagName === 'IMG' || target.tagName==='LI') {
      tmp_li=target.closest('li');
      if (isLoggedIn) {
        addToCart(tmp_li);
      } else {
        // 로그인되어 있지 않으면 알림창 띄우고 로그인 페이지로 이동
        alert('로그인이 필요합니다.');
        window.location.href = '/login.html';
      }
    }
  });

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
          isLoggedIn=true;
       }
      }
    };
    // 서버에 XML 데이터를 요청
    xhr.open('GET', '/getName', true);
    xhr.send();
  }
  fetchData();

  // 장바구니에 아이템 추가 함수
  function addToCart(item) {
    const productId = item.dataset.id;
    const productName = item.dataset.name;
    const productPrice = item.dataset.price;

    // 이미 장바구니에 있는지 확인
    const existingItem = cartItems.find(item => item.id === productId);

    if (existingItem) {
      // 이미 장바구니에 있는 경우 개수만 증가
      existingItem.quantity += 1;
      updateCartUI();
    } else {
      // 장바구니에 없는 경우 새로운 아이템으로 추가
      const newItem = {
        id: productId,
        name: productName,
        price: productPrice,
        quantity: 1,
      };

      cartItems.push(newItem);
      updateCartUI();
    }
  }

  var btn_basket=document.querySelector('.btn_basket');

  //서버로 현재 장바구니 정보 전달하는 함수
  function sendCartDataToServer() {
    fetch('/saveCartData', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cartItems }),
    })
    .then(response => response.json())
    .then(data => {
      alert("나의 장바구니에 저장되었습니다. 확인 및 결제는 나의 페이지를 이용해주세요.")
      cartItems.length = 0;
      updateCartUI();
    })
    .catch(error => console.error('데이터 전송 중 오류:', error));
  }

  btn_basket.addEventListener('click',function(){
    if(cartItems.length>0){
      sendCartDataToServer();
    }
    else{
      alert("임시 장바구니에 담은 게 없습니다.");
    }
  })
  // 장바구니 UI 업데이트 함수
  function updateCartUI() {
    // 기존 UI 삭제
    cartList.innerHTML = '';

    // 장바구니 아이템
    cartItems.forEach(item => {
      const cartItem = document.createElement('li');
      cartItem.textContent = `${item.name} - ${item.price}원 x ${item.quantity}`;

      // 장바구니 아이템 삭제 버튼
      const removeButton = document.createElement('button');
      removeButton.textContent = '삭제';
      removeButton.addEventListener('click', () => {
        removeFromCart(item.id);
      });

      cartItem.appendChild(removeButton);
      cartList.appendChild(cartItem);
    });
  }

  // 장바구니에서 아이템 삭제 함수
  function removeFromCart(itemId) {
    const index = cartItems.findIndex(item => item.id === itemId);

    if (index !== -1) {
      cartItems.splice(index, 1);
      updateCartUI();
    }
  }
}