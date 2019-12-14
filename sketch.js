//data variables
const hostIp = 'http://192.168.15.12:8080'
const container = document.querySelector("#container")
let loadedData;
let loadedLibData;
let rankedBookList;
let rankedBookNames = [];
let libBooks = [];
let libBookList;
let authKey =
  "aec2972736d2fddc06da29cead7a5251c924f514671befb9ce02ee7f51dd9df9";
let libCode = "111473";
//DOM
let button, input, canvas;
let imgURLS = [];
let imgDatas = [];
//loading data
function preload() {
  //인기대출도서 조회
  //bookRankingLoad();
  //gotLibData();
  loadedData = loadJSON("./DTLib2.json", gotData);
}

function setup() {
  //인기대출도서 순서대로 표시하기
  // for (let index = 0; index < rankedBookList.length; index++) {
  //     const element = rankedBookList[index].doc.bookname;
  //     rankedBookNames.push(element);
  //     createP(`${index + 1}.${element}`);
  //     console.log(`${index+1}.${element}`);
  // }
  button = select("#submit");
  input = select("#bookNameInput");
  button2 = select("#submitB");
  input2 = select("#bookNameInputB");
  button.mousePressed(findBookInfo);
  button2.mousePressed(findRecomendBooks);
  canvas = createCanvas(900,900)
  canvas.parent('container2');
  imageSprites = new Group();
}

function draw() {
  background(255);
  imageSprites.bounce(imageSprites);
  for (let i = 0; i < allSprites.length; i++) {
    const s = allSprites[i];
    if(s.position.x<0) {
      s.position.x = 1;
      s.velocity.x = abs(s.velocity.x);
    }

    if(s.position.x>width) {
      s.position.x = width-1;
      s.velocity.x = -abs(s.velocity.x);
    }

    if(s.position.y<0) {
      s.position.y = 1;
      s.velocity.y = abs(s.velocity.y);
    }

    if(s.position.y>height) {
      s.position.y = height-1;
      s.velocity.y = -abs(s.velocity.y);
    }
    drawSprites();
  }
}
function findRecomendBooks(){
  const usrISBN = input2.value();
  loadJSON(`http://data4library.kr/api/recommandList?authKey=${authKey}&isbn13=${usrISBN}&format=json`,"jsonp",recommendBokkHandler,errorHandler)
  input2.value('');
}
function errorHandler(params) {
  console.log(params);
  
}
function recommendBokkHandler(data){
  const recommendBokkList = data.response.docs;
  const splicedList = recommendBokkList.slice(0,15);
  imgURLS = [];
  // const splicedList = recommendBokkList
  // console.log(splicedList)
  splicedList.forEach((element) => {
    // const imgURL = `https://cors-anywhere.herokuapp.com/${element.book.bookImageURL}`
    const imgURL = `${hostIp}/${element.book.bookImageURL}`
    imgURLS.push(imgURL);
  });
  console.log(imgURLS);
  loadImages(imgURLS)
}
function loadImages(imgArray) {
  imgArray.forEach((imgUrl,index) => {
    loadImage(imgUrl, img=>{
      console.log(index)
      // image(img,50*index,50*index)
      var imageSprite = createSprite(random(0,width),random(0,height));
      imageSprite.addAnimation('normal',img,img);
      imageSprite.setCollider('rectangle',2,2,150,200);
      imageSprite.setSpeed(random(2, 3), random(0, 360));
      imageSprite.scale = random(0.5,1);
      imageSprite.mass = imageSprite.scale;
      imageSprites.add(imageSprite);
    })
  });
}

function findBookInfo() {
  let bookTitle =input.value();
  let bookTitleKey = strip(bookTitle);
  bookTitleKey = bookTitleKey.toLowerCase();
  const isMatching = (element) => element.bookName === bookTitleKey;
  currentISBN = libBooks[libBooks.findIndex(isMatching)].ISBN
  if(currentISBN===undefined){
    // createP(`책의 정보가 없습니다!(제목을 잘 입력했는지 확인해주세요.)`)
  }else{
    createP(`${bookTitle} : ${currentISBN}`).parent('list');
  }
  // console.log(matching)
  
  input.value('');
}

function bookRankingLoad() {
  loadJSON(
    `http://data4library.kr/api/loanItemSrch?authKey=${authKey}&startDt=2019-01-01&endDt=2019-12-04&format=json`,
    gotRankingData,
    "jsonp"
  );
}

function searchDTLib() {
  //총 데이터 수 3215개!
  loadJSON(
    `http://data4library.kr/api/itemSrch?libCode=${libCode}&startDt=2019-01-01&endDt=2019-11-30&authKey=${authKey}&format=json&pageSize=3215`,
    gotLibData,
    "jsonp"
  );
}

function searchDTLibInfo() {
  loadJson(
    `http://data4library.kr/api/libSrch?authKey=${authKey}&libCode=${libCode}`,
    gotLibInfo,
    "jsonp"
  );
}

// function gotData(data) {
//   libBookList = data.response.docs;
//   libBookList.forEach(element => {
//     let bookName = element.doc.bookname;
//     bookName = strip(bookName);
//     bookName = bookName.toLowerCase();
//     const loanCount = element.doc.loan_count;
//     const ISBN = element.doc.isbn13;
//     bookObj = {
//       bookName : bookName,
//       loanCount : loanCount,
//       ISBN : ISBN
//     }
//     libBooks.push(bookObj)
//   });
//   console.log(libBooks);
// }
function gotData(data) {
  libBookList = data
  libBookList.forEach(element => {
    let bookName = element.bookname;
    bookName = strip(bookName);
    bookName = bookName.toLowerCase();
    const loanCount = element.loan_count;
    const ISBN = element.ISBN;
    bookObj = {
      bookName : bookName,
      loanCount : loanCount,
      ISBN : ISBN
    }
    libBooks.push(bookObj)
  });
  console.log(libBooks);
}

function gotRankingData(data) {
  console.log("Data Loaded!");
  loadedData = data;
  rankedBookList = loadedData.response.docs;
}

function gotLibData(data) {
  console.log("Data Loaded!");
  loadedLibData = data;
}

function gotLibInfo(data) {
  console.log("Lib Info Data Loaded");
  loadedLibInfo = data;
}

function strip(str) {
  return str.replace(/\s+/g, "");
}