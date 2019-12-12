//data variables
const container = document.querySelector(".container")
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
//loading data
function preload() {
  //인기대출도서 조회
  //bookRankingLoad();
  //gotLibData();
  loadedData = loadJSON("./DTLib.json", gotData);
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
  button.mousePressed(findBookInfo);
  canvas = createCanvas(50,50)
  canvas.parent('container');
  
}

function draw() {
  // ellipse(50, 50, 80, 80);
  
}

function findBookInfo(params) {
  console.log(params);
  let bookTitle =input.value();
  console.log(bookTitle);
  let bookTitleKey = strip(bookTitle);
  
  bookTitleKey = bookTitleKey.toLowerCase();
  console.log(bookTitleKey)
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

function gotData(data) {
  libBookList = data.response.docs;
  libBookList.forEach(element => {
    let bookName = element.doc.bookname;
    bookName = strip(bookName);
    bookName = bookName.toLowerCase();
    const loanCount = element.doc.loan_count;
    const ISBN = element.doc.isbn13;
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