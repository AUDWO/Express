const express = require("express");
//기존의 직원정보들을 불러오는 함수
//let members = require("./members");

//const db = require("./models/index");
//원래는 이렇게 적어도 되는데 어차피 node특성상 특정 디렉토리 이름만 적어도
//자동으로 index.js파일을 찾게 되어있다.(node에서 모듈이 검색되는 순서 참고)

const db = require("./models");

const { Member } = db;

//express로 만든 객체에는 관습적으로 app이라는 이름을 붙인다.
const app = express();

//express의 json메소드는 특정함수를 리턴하는데
//그 함수는 서버로 온 리퀘스트의 바디에 JSON데이터가 존재할 경우
//그것을 추출해서 리퀘스트 바디의 body프로퍼티의 값으로 설정해준다.
//이런식으로 리퀘스트가 라우트 핸들러에 의해 처리되기 전에 추가적으로 필요한 전처리를 수행하는 함수를
//익스프레스에서는 미들웨어라고 한다.

//간단요약: 일단 미들웨어라는게 서버로는 모든 리퀘스트에 관해 필요한 처리를 해준 함수.
app.use(express.json());

app.get("/api/members", async (req, res) => {
  //url에 http://localhost:3000/api/members?teams=an
  //라고 입력하면 {"teams":"an"}이라는 객체가 화면에 입력된다.
  const { team } = req.query;
  if (team) {
    const teamMembers = members.filter((m) => m.team === team);
    res.send(teamMembers);
  } else {
    //이 코드는 sequelize에 의해서 결국 SQL문으로 변환되어서
    //findAll메소드 처럼 모델이 가진 대부분의 메소드들은
    //비동기함수여서 await과 async를 붙여줘야 한다.
    const members = await Member.findAll({ where: { team } });
    res.send(members);
  }
  //res.send(members);
});

//URL의 path부분이 hello라면
//(req,res)이런식으로 특정 콜백에 대응하는 방식을 route handler라고 한다.
//route는 객 request의 path부분을 보고 알맞은 작업을 수행하는 것을 의미한다.
//handler는 어떤 작업을 할 것인가에서 작업을 의미
//:id를 라우터파라미터라고 부른다.
app.get("/api/members/:id", async (req, res) => {
  const { id } = req.params;
  const member = await Member.findOne({ where: { id } });
  if (member) {
    res.send(member);
  } else {
    res.status(404).send({ message: "There is no message" });
  }
});

app.post("/api/members", (req, res) => {
  const newMember = req.body;
  members.push(newMember);
  res.send(newMember);
});

app.put("/api/members/:id", (req, res) => {
  const { id } = req.params;
  const newInfo = req.body;
  const member = members.find((m) => m.id === Number(id));
  if (member) {
    Object.keys(newInfo).forEach((prop) => {
      member[prop] = newInfo[prop];
    });
    res.send(member);
  } else {
    res.status(404).send({ message: "There is no member with the id" });
  }
});

app.delete("/api/members/:id", (req, res) => {
  const { id } = req.params;
  const membersCount = members.length;
  members = members.filter((member) => member.id !== Number(id));
  if (membersCount > members.length) {
    res.send({ message: "Deleted" });
  } else {
    res.status(404).send({ message: "There is no member with the id" });
  }
});

app.listen(3000);

//서버에 저장돼 있는 수많은 정보들을 모두 resourse라고 한다.

//query:서버에 있는 데이터를 조회할 때 기준을 정하기 위해 사용

/*
----------------------------------------
 */
