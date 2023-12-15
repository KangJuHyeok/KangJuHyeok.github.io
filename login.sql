--mysql에 들어가서 project라는 database를 만듬
CREATE DATABASE IF NOT EXISTS project CHARACTER SET utf8 COLLATE utf8_bin; 

--로그인을 위한 기본적인 유저 정보 테이블을 만든다->(id,username(실제 아이디),paswword,전화번호,주소)
CREATE TABLE IF NOT EXISTS user (
  id int(12) NOT NULL,
  username varchar(50) NOT NULL,
  password varchar(255) NOT NULL,
  phone varchar(100) NOT NULL,
  address varchar(100) NOT NULL,
  realname varchar(30) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

--id를 중복되지 않고 새로 등록하는 유저마다 자동으로 1씩 증가하게 만드는 primary key로 지정
alter table user modify id int not null auto_increment primary key;

--테스트 용도로 아이디 하나를 미리 만들었다.
INSERT INTO user (id, username, password, phone, address, realname) VALUES (1, 'test', 'test', '010-0000-0000', '행신로 131-11 sk3차 305동 1002호', '강주혁');

--yy:연도 ,mm:달 ,dd:날짜 , hh:시간 , people: 예약가능한 남은 인원수 /예약 가능한 날짜,시간 파악을 위한 테이블
CREATE TABLE IF NOT EXISTS reservation (
  yy int(5) NOT NULL,
  mm int(5) NOT NULL,
  dd int(5) NOT NULL,
  hh int(5) NOT NULL,
  people int(5) NOT NULL,
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

--예약목록(유저 정보가 담긴)
CREATE TABLE IF NOT EXISTS user_reservation (
    id INT(5) AUTO_INCREMENT PRIMARY KEY,
    yy INT(5) NOT NULL,
    mm INT(5) NOT NULL,
    dd INT(5) NOT NULL,
    hh INT(5) NOT NULL,
    pp INT(5) NOT NULL,
    username VARCHAR(50) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

--내 장바구니
CREATE TABLE my_basket (
  id INT,
  quantity INT,
  price INT,
  name VARCHAR(50),
  username VARCHAR(50)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

-- 테이블 생성 쿼리 실행
CREATE TABLE posts (
    post_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    content TEXT,
    username VARCHAR(50)
);
--위의 posts테이블에 시간도 추가
ALTER TABLE posts ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP; 
