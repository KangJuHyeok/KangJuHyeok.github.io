var fs = require('fs');
var path = require('path');
var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
const { register } = require('module');

var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'web2023',
	password : 'web2023',
	database : 'project'
});

var app = express();
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

function restrict(req, res, next) {
  if (req.session.loggedin) {
    next();
  } else {
    req.session.error = '로그인 후 사용가능!';
    response.sendFile(path.join(__dirname + '/public/login.html'));
  }
}

app.use('/', function(request, response, next) {
  const allowedPaths = ["/login", "/register", "/findReview", "/getPostDetails"];

  // 현재 URL이 허용된 경로인지 확인
  if (request.session.loggedin || allowedPaths.some(path => request.url.startsWith(path))) {
    next();
  } else {
    response.sendFile(path.join(__dirname + '/public/login.html'));
  }
});

//로그인 폼
app.post('/login', function(request, response) {
	username = request.body.ID;
	var password = request.body.PW;
	if (username && password) {
		connection.query('SELECT * FROM user WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			if (error) throw error;
			if (results.length > 0) {
				request.session.loggedin = true;
				request.session.username = username;
				response.redirect('/index.html');
				response.end();
			} else {
				response.send("<script>alert('아이디 또는 비밀번호가 틀립니다!');history.back();</script>");
			}			
		});
	} else {
		response.send("<script>alert('아이디와 비밀번호를 입력해주세요!');history.back();</script>");
		response.end();
	}
});

//회원가입 폼
app.post('/register', function(request, response) {
	var username = request.body.ID;
	var realname = request.body.name;
	var password = request.body.PW;
	var password2 = request.body.PW2;
	var phone = request.body.phone;
	var address = request.body.address;


	if (username && password && realname && address && phone && password2) {
		if (password != password2){
			response.send("<script>alert('비밀번호가 서로 다릅니다!');history.back();</>");
		}
		connection.query('SELECT * FROM user WHERE username = ? OR (realname = ? AND phone = ?)', [username, realname, phone], function(error, results, fields) {
			if (error) throw error;
			if (results.length <= 0) {
        connection.query('INSERT INTO user (username, password, phone, address, realname) VALUES(?,?,?,?,?)', [username, password, phone, address, realname],
            function (error, data) {
                if (error)
                  console.log(error);
                else
                  console.log(data);
        });
				response.send("<script>alert('회원가입이 완료되었습니다!');location.href='login.html';</script>");
			} else {
				response.send("<script>alert('아이디 중복 혹은 해당 명의 아이디가 이미 존재합니다!');history.back();</script>");
			}			
			response.end();
		});
	} else {
		response.send("<script>alert('정보를 모두 입력해주세요!');history.back();</script>");
		response.end();
	}
});

//로그아웃 폼
app.get('/logout', function(request, response) {
  request.session.loggedin = false;
	response.send('<script>alert("로그아웃 되었습니다!");location.href="index.html";</script>');
	response.end();
});


//예약 페이지 (로그인 필요)
app.get('/logged/reservation.html', restrict, function(request, response) {
	if (request.session.loggedin) {
		response.sendFile(path.join(__dirname + '/logged/reservation.html'));
	} else {
		response.send('Please login to view this page!');
		response.end();
	}
});

//내 정보(예약+장바구니) 페이지 (로그인 필요)
app.get('/logged/my.html', restrict, function(request, response) {
	response.sendFile(path.join(__dirname + '/logged/my.html'));
});

//글쓰기 페이지 (로그인 필요)
app.get('/logged/write.html', restrict, function(request, response) {
	response.sendFile(path.join(__dirname + '/logged/write.html'));
});







//로그인하면 로그인 링크를 이름으로 바꿀 때 쓰는 xml
app.get('/getName', (request, response) => {
  	// 서버에서 XML 데이터 생성
	if (request.session.loggedin){
		connection.query('SELECT realname FROM user WHERE username = ?', [username], function(error, results, fields) {
			if (error) throw error;
			realname=results;
			const xmlData = realname;

			// XML 데이터를 클라이언트에게 전송
			response.set('Content-Type', 'text/text');
			response.send(xmlData);
		});
	}
	else{
		response.set('Content-Type', 'text/text');
		response.send("로그인");
	}
});

//달력 날짜 클릭하면 예약 가능 확인
app.post('/processClick_1', (req, res) => {
	const clientData = req.body.data;
	connection.query('SELECT * FROM reservation WHERE yy = ? AND mm = ? AND dd = ? AND hh = ?', [clientData.yy, clientData.mm, clientData.dd, clientData.hh], function(error, results, fields) {
		if (error) throw error;
		if(results.length<=0){
			connection.query('INSERT INTO reservation (yy, mm, dd, hh, people) VALUES (?, ?, ?, ?, 8)', [clientData.yy, clientData.mm, clientData.dd, clientData.hh], function(error, insertResults, insertFields) {
				if (error) throw error;
				ok=true;
				res.json({ok});
			});
		}
		else{
			if(results[0].people>=clientData.pp){
				ok=true;
				res.json({ok});
			}
			else{
				ok=false;
				res.json({ok})
			}
		}
	});
});

//예약 팝업창에서 li눌렀을 때 예약 처리
app.post('/processClick_2', (req, res) => {
	const clientData = req.body.data;
	connection.query('SELECT * FROM reservation WHERE yy = ? AND mm = ? AND dd = ? AND hh = ? AND people >= ?', [clientData.yy, clientData.mm, clientData.dd, clientData.hh, clientData.pp], function(error, results, fields) {
		if (error) throw error;
		if (results.length > 0) {
			var newPeopleValue = results[0].people - clientData.pp;//인원 수 차감
			connection.query('UPDATE reservation SET people = ? WHERE yy = ? AND mm = ? AND dd = ? AND hh = ? AND people >= ?', [newPeopleValue, clientData.yy, clientData.mm, clientData.dd, clientData.hh, clientData.pp], function(updateError, updateResults, updateFields) {
				if (updateError) {
					throw updateError;
				}});

				var insertData = {
					yy: clientData.yy,
					mm: clientData.mm,
					dd: clientData.dd,
					hh: clientData.hh,
					pp: clientData.pp,
					username: username, //username은 전역변수로 로그인하면 계속 쓰임
				};
				connection.query('INSERT INTO user_reservation SET ?', insertData, (error, result, field) => {
					if (error) throw error;
				});
			
			ok=true;
			res.json({ok});
		}
		else{
			ok=false;
			res.json({ok});
		}
	});
});

//my페이지에서 예약 출력
app.post('/findMyReservation', (req, res) => {
	connection.query('SELECT * FROM user_reservation WHERE username = ?', [username], function(error, results, fields) {
		if (error) throw error;
		if(results.length>0){
			res.json({results});
		}
	});
});

//my페이지에서 예약 취소
app.post('/cancelMyReservation', (req, res) => {
	const clientData = req.body.data;
	connection.query('DELETE FROM user_reservation WHERE id = ?', [clientData.id], function(error, results, fields) {
		if (error) throw error;
	});
	connection.query('UPDATE reservation SET people = people + ? WHERE yy = ? AND mm = ? AND dd = ? AND hh = ?', [clientData.pp,clientData.yy,clientData.mm,clientData.dd,clientData.hh], function(error, results, fields) {
		if (error) throw error;
	});
});

//order 페이지에서 장바구니
app.post('/saveCartData', (req, res) => {
  const cartItems = req.body.cartItems;
	for(let i=0;i<cartItems.length;i++){
		connection.query('SELECT * FROM my_basket WHERE username = ? AND id = ?',[username,cartItems[i].id],function(error, results, fields){
			if (error) throw error;
			if(results.length>0){//나의 장바구니가 이미 존재할 때
				connection.query('UPDATE my_basket SET quantity = quantity + ? WHERE username = ? AND id = ?', [cartItems[i].quantity, username,cartItems[i].id], function(updateErro,updateResults, updateFields) {
					if (error) throw error;
				});
			}
			else{
				connection.query('INSERT INTO my_basket (id, quantity, price, name, username) VALUES (?, ?, ?, ?, ?)',[cartItems[i].id,cartItems[i].quantity,cartItems[i].price,cartItems[i].name,username],function(error, result, field){
					if (error) throw error;
				})
			}
		})
	}

  res.json({ message: '장바구니 데이터가 성공적으로 저장되었습니다.' });
});

//my페이지에서 장바구니 출력
app.post('/findMyBasket', (req, res) => {
	connection.query('SELECT * FROM my_basket WHERE username = ?', [username], function(error, results, fields) {
		if (error) throw error;
		if(results.length>0){
			res.json({results});
		}
	});
});

//my페이지에서 예약 취소
app.post('/cancelMyBasket', (req, res) => {
	const clientData = req.body.data;
	connection.query('DELETE FROM my_basket WHERE username = ? AND id = ?', [username,clientData.id], function(error, results, fields) {
		if (error) throw error;
	});
});

//my페이지에서 장바구니 계산
//my페이지에서 장바구니 출력
app.post('/accountMyBasket', (req, res) => {
	connection.query('SELECT * FROM my_basket WHERE username = ?', [username], function(error, results, fields) {
		if (error) throw error;
		connection.query('SELECT address, realname FROM user WHERE username = ?', [username], function(error, user_results, field) {
			if (error) {
				throw error;
			}
			res.json({results,user_results});
		});
	});
});


//글쓰면 데이터베이스에 저장됨
app.post('/writeReview', (req, res) => {
	tmp_content=req.body.maincontent;
	tmp_title=req.body.title;
	connection.query('INSERT INTO posts (title, content, username, created_at) VALUES (?, ?, ?, NOW())', [tmp_title, tmp_content, username], function(error, results, fields) {
		if (error) throw error; //글을 데이터베이스에 저장
	});
});

//리뷰글들 정보 보내줌
app.get('/findReview',(req, res) =>{
		connection.query('SELECT * from posts',function(error, results, fields) {
			if (error) throw error; 
			res.json({results});
		});
});

// 클라이언트로부터 글의 세부 정보 요청
app.get('/getPostDetails/:postId', (req, res) => {
  const postId = req.params.postId;

  // 데이터베이스에서 해당 글의 세부 정보를 가져옴
  connection.query('SELECT * FROM posts WHERE post_id = ?', [postId], (error, results, fields) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: '서버 오류' });
    }

    if (results.length === 0) {
      // 해당하는 글이 없을 경우
      return res.status(404).json({ error: '글을 찾을 수 없습니다.' });
    }
    res.json(results);
  });
});


app.listen(3000, function () {
    console.log('Server Running at http://127.0.0.1:3000');
});