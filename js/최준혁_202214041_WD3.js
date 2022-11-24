// 시작 시 사운드 출력
window.onload = function() {
  clickSoundPlay();
}

function bettingResult() {
  document.getElementById('bettingChipsResult').innerHTML = ( parseFloat(localStorage.getItem("bettingChips")) / 1000).toFixed(1) + "k";
}
function bettingResultWin() {
  document.getElementById('bettingChipsResult').innerHTML = ( (parseFloat(localStorage.getItem("bettingChips")) / 1000)*2).toFixed(1) + "k";
}


// 칩
let chip = {
  balance : 50000,
  bettingChips : 0,
  refresh : function() { 
    document.getElementById("chipsNumber").innerHTML = ( parseFloat(localStorage.getItem("ownChip")) / 1000).toFixed(1) + "k";
  },
  betting : function(bet) {
    document.getElementById("bettingNumber").innerHTML = bet;
    localStorage.setItem("bettingChips", bet);
    localStorage.setItem("ownChip", parseFloat(localStorage.getItem("ownChip")) - bet);
  },
  reset : function() { 
    localStorage.setItem("ownChip", 50000);
    alert("초기화되었습니다.");
  },
  bettingReset : function() {
    document.getElementById("bettingNumber").innerHTML = 0;
    this.bettingChips = 0;
  },
  setting : function() {
    if (localStorage.getItem("first") == "1"){
    }
    else {
      localStorage.setItem("first", 1);
      localStorage.setItem("ownChip", 50000);
      console.log("칩 세팅 완료");
    }
    console.log(localStorage.getItem("first") + " : first");
  }
}
// 딜레이 시간
const setTime = 10000;
// 딜러의 카드 배열과 딜러의 카드 스코어
let dealer = {
  name : '딜러',
  card : "",
  firstCard : "",
  firstScore : 0,
  score : 0,
  totalScore : function() { document.getElementById("dealerScore").innerHTML = dealer.score; },
  place : function() { return document.getElementById('dealerPlace') },
}
// 플레이어의 카드 배열과 카드 스코어
let player = {
  name : '플레이어',
  card : "",
  score : 0,
  totalScore : function() { document.getElementById("playerScore").innerHTML = player.score; },
  place : function() { return document.getElementById('playerPlace') },
}
// 덱 카드 배열
let card = ["H1", "H2", "H3", "H4", "H5", "H6", "H7", "H8", "H9", "H10", "HJ", "HQ", "HK", 
  "S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8", "S9", "S10", "SJ", "SQ", "SK"];
// bet 버튼을 누를 시 배팅 시작
function betting() {
  console.log('betting 함수 실행');

  let bet = Number(prompt('베팅할 금액을 입력해주세요.'));

  console.log('bet prompt 창 실행');

  if (bet < 1000 || isNaN(bet)) {
    alert('숫자가 아니거나 1,000 미만인 금액은 입력하실 수 없습니다.');
  }
  else if( bet > parseInt(localStorage.getItem("ownChip")) ) {
    alert('보유한 금액보다 큰 금액을 입력할 수 없습니다. \n현재 보유 금액 ' + parseInt(localStorage.getItem("ownChip")));
  }
  else {
    // 정상 작동 시 게임 시작
    // 게임 시작 전 초기화
    bettingSoundPlay();
    gameReset();
    // 현재 보유한 Chips에서 bet을 차감
    chip.betting(bet);
    chip.refresh();
    chip.bettingChips = bet;
    // 카드 배열에서 랜덤으로 뽑아 카드 배열에서 제거, 그 카드를 다른 배열에 저장한 뒤
    //  dealerCards Or playerCards 에 이미지로 추가
    firstDraw(dealer);
    random(player);
    random(dealer);
    random(player);

    // addCards(dealer, dealerPlace);
    // 랜덤으로 뽑은 카드를 어딘가에 저장해서 그것을 숫자로 변환한 뒤 dealer혹은 player의 점수에 등록
    if( (dealer.score + dealer.firstScore) == 21){
      alert('딜러가 블랙잭이므로 플레이어가 패배합니다.');

      let firstCard = document.getElementsByClassName('firstCard');
      cardCheck(firstCard);

      setTimeout(burst(), setTime);
    }
    console.log(dealer.score + dealer.firstScore + ' : 딜러의 현재 점수');
    // 위의 행위를 dealer - player - dealer - player 순으로 반복
    console.log(localStorage.getItem("ownChip") + "현재 소유한 chip");
  }
}
// hit 버튼을 누를 시 실행
function hit() {
  if ( dealer.score == 0 ){
    alert('베팅을 먼저 해주세요.');
  }
  else{
    bettingSoundPlay();
    random(player);
    // burst인지 체크
    if (burstCheck(player)) {
      let firstCard = document.getElementsByClassName('firstCard');
      cardCheck(firstCard);

      setTimeout(burst(), setTime);
    }
  }
}
// stand 버튼을 누를 시 실행
function stand() {
  if ( dealer.score == 0 ){
    alert('베팅을 먼저 해주세요.');
  }
  else{
    bettingSoundPlay();
    do {
      if( (dealer.score + dealer.firstScore) < 17){
        random(dealer);
      }
      else {
        break;
      }
    } while (true);
  
    if( (dealer.score + dealer.firstScore) > 21 ||  player.score > (dealer.score + dealer.firstScore) ){
      let firstCard = document.getElementsByClassName('firstCard');
      cardCheck(firstCard);

      setTimeout(win(), setTime);
    }
    else if( (dealer.score + dealer.firstScore) == player.score ){
      let firstCard = document.getElementsByClassName('firstCard');
      cardCheck(firstCard);

      setTimeout(push(), setTime);
    }
    else {
      let firstCard = document.getElementsByClassName('firstCard');
      cardCheck(firstCard);

      setTimeout(burst(), setTime);
    }
  }
}

// burst 체크 함수
function burstCheck(who) {
  if (who.score > 21) return 1;
  else return 0;
}
// burst 실행
function burst() {
  console.log('플레이어 패배');
  alert('플레이어 ' + player.score + '점, 딜러 ' + (dealer.score + dealer.firstScore) + '점으로 플레이어가 패배합니다.');

  var burst = window.open('./최준혁_202214041_WD3-burst.html', 'U R burst', 'width=1200, height=700');

  chip.bettingReset();
  gameReset();
  setting();
  chip.refresh();
}
// win 실행
function win() {
  console.log('플레이어 승리');
  alert('플레이어 ' + player.score + '점, 딜러 ' + (dealer.score + dealer.firstScore) + '점으로 플레이어가 승리합니다.');

  var win = window.open('./최준혁_202214041_WD3-win.html', 'U R WIN', 'width=1200, height=700');

  localStorage.setItem("ownChip", (parseFloat(localStorage.getItem("ownChip")) + chip.bettingChips * 2));
  chip.bettingReset();
  gameReset();
  setting();
  chip.refresh();
}
// push 실행
function push() {
  console.log('무승부');
  alert('플레이어 ' + player.score + '점, 딜러 ' + (dealer.score + dealer.firstScore) + '점으로 무승부됩니다.');

  var push = window.open('./최준혁_202214041_WD3-push.html', 'U R PUSH', 'width=1200, height=700');

  localStorage.setItem("ownChip", (parseFloat(localStorage.getItem("ownChip")) + chip.bettingChips));
  chip.bettingReset();
  gameReset();
  setting();
  chip.refresh();
}

function random(who) {
  let r = Math.floor(Math.random() * card.length);
  who.card = card[r];
  score(who);
  addCards(who);
  who.totalScore();
  card.splice(r, 1);
}

function firstDraw(who) {
  let r = Math.floor(Math.random() * card.length);
  who.card = card[r];
  who.firstCard = who.card;

  score(who);
  who.firstScore = who.score;
  who.score = 0;

  let dealerCard = dealer.place();

  let img = document.createElement('img');
  img.className = "card";
  img.src = backImgLoad();
  dealerCard.appendChild(img);

  console.log(who.firstCard + ', ' + who.firstScore);

  card.splice(r, 1);
}

function gameReset() {
  let dealerCard = dealer.place();
  dealerCard.innerHTML = "";

  let playerCard = player.place();
  playerCard.innerHTML = "";

  let dScore = document.getElementById('dealerScore');
  dScore.innerHTML = 0;

  let pScore = document.getElementById('playerScore');
  pScore.innerHTML = 0;

  dealer.card = "";
  player.card = "";

  dealer.score = 0;
  player.score = 0;

  dealer.firstCard = "";
  dealer.firstScore = 0;

  card = ["H1", "H2", "H3", "H4", "H5", "H6", "H7", "H8", "H9", "H10", "HJ", "HQ", "HK", 
  "S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8", "S9", "S10", "SJ", "SQ", "SK"];
}

function setting() {
  for (let i = 0; i < 2; i++) {
    addBackCard(dealer);
  }
  for (let i = 0; i < 2; i++) {
    addBackCard(player);
  }
}
function addBackCard(who) {
  let place = who.place();

  let backImg = document.createElement('img');
  backImg.className = "card";
  backImg.src = backImgLoad();

  place.appendChild(backImg);
}
// 카드를 추가하여 딜러의 area에 놓음
function addCards(who) {
  var cardImg = document.createElement('img');
  cardImg.className = "card";

  switch (who.card) {
    case "H1":
      cardImg.src = "https://upload.wikimedia.org/wikipedia/commons/d/d4/English_pattern_ace_of_hearts.svg";
      break;
    case "S1":
      cardImg.src = "https://upload.wikimedia.org/wikipedia/commons/1/19/English_pattern_ace_of_spades.svg";
      break;
    case "H2":
      cardImg.src = "https://upload.wikimedia.org/wikipedia/commons/2/26/English_pattern_2_of_hearts.svg";
      break;
    case "S2":
      cardImg.src = "https://upload.wikimedia.org/wikipedia/commons/0/0b/English_pattern_2_of_spades.svg";
      break;
    case "H3":
      cardImg.src = "https://upload.wikimedia.org/wikipedia/commons/0/0f/English_pattern_3_of_hearts.svg";
      break;
    case "S3":
      cardImg.src = "https://upload.wikimedia.org/wikipedia/commons/a/a5/English_pattern_3_of_spades.svg";
      break;
    case "H4":
      cardImg.src = "https://upload.wikimedia.org/wikipedia/commons/b/bb/English_pattern_4_of_hearts.svg";
      break;
    case "S4":
      cardImg.src = "https://upload.wikimedia.org/wikipedia/commons/3/34/English_pattern_4_of_spades.svg";
      break;
    case "H5":
      cardImg.src = "https://upload.wikimedia.org/wikipedia/commons/c/c6/English_pattern_5_of_hearts.svg";
      break;
    case "S5":
      cardImg.src = "https://upload.wikimedia.org/wikipedia/commons/9/9c/English_pattern_5_of_spades.svg";
      break;
    case "H6":
      cardImg.src = "https://upload.wikimedia.org/wikipedia/commons/d/da/English_pattern_6_of_hearts.svg";
      break;
    case "S6":
      cardImg.src = "https://upload.wikimedia.org/wikipedia/commons/a/ac/English_pattern_6_of_spades.svg";
      break;
    case "H7":
      cardImg.src = "https://upload.wikimedia.org/wikipedia/commons/c/cb/English_pattern_7_of_hearts.svg";
      break;
    case "S7":
      cardImg.src = "https://upload.wikimedia.org/wikipedia/commons/d/d1/English_pattern_7_of_spades.svg";
      break;
    case "H8":
      cardImg.src = "https://upload.wikimedia.org/wikipedia/commons/3/3c/English_pattern_8_of_hearts.svg";
      break;
    case "S8":
      cardImg.src = "https://upload.wikimedia.org/wikipedia/commons/4/4d/English_pattern_8_of_spades.svg";
      break;
    case "H9":
      cardImg.src = "https://upload.wikimedia.org/wikipedia/commons/2/22/English_pattern_9_of_hearts.svg";
      break;
    case "S9":
      cardImg.src = "https://upload.wikimedia.org/wikipedia/commons/f/f0/English_pattern_9_of_spades.svg";
      break;
    case "H10":
      cardImg.src = "https://upload.wikimedia.org/wikipedia/commons/b/bb/English_pattern_10_of_hearts.svg";
      break;
    case "HJ":
      cardImg.src = "https://upload.wikimedia.org/wikipedia/commons/5/56/English_pattern_jack_of_hearts.svg";
      break;
    case "HQ":
      cardImg.src = "https://upload.wikimedia.org/wikipedia/commons/9/9d/English_pattern_queen_of_hearts.svg";
      break;
    case "HK":
      cardImg.src = "https://upload.wikimedia.org/wikipedia/commons/1/14/English_pattern_king_of_hearts.svg";
      break;
    case "S10":
      cardImg.src = "https://upload.wikimedia.org/wikipedia/commons/d/da/English_pattern_10_of_spades.svg";
      break;
    case "SJ":
      cardImg.src = "https://upload.wikimedia.org/wikipedia/commons/4/4f/English_pattern_jack_of_spades.svg";
      break;
    case "SQ":
      cardImg.src = "https://upload.wikimedia.org/wikipedia/commons/c/ca/English_pattern_queen_of_spades.svg";
      break;
    case "SK":
      cardImg.src = "https://upload.wikimedia.org/wikipedia/commons/f/f1/English_pattern_king_of_spades.svg";
      break;
    default:
      break;
  }

  console.log(who.card + '의 카드가 ' + who.name + '의 카드로 추가 됨');

  let place = who.place();
  place.appendChild(cardImg);
}
// 스코어 계산기
function score(who) {
  switch (who.card) {
    case "H1":
    case "S1":
      who.score += 11;
      break;
    case "H2":
    case "S2":
      who.score += 2;
      break;
    case "H3":
    case "S3":
      who.score += 3;
      break;
    case "H4":
    case "S4":
      who.score += 4;
      break;
    case "H5":
    case "S5":
      who.score += 5;
      break;
    case "H6":
    case "S6":
      who.score += 6;
      break;
    case "H7":
    case "S7":
      who.score += 7;
      break;
    case "H8":
    case "S8":
      who.score += 8;
      break;
    case "H9":
    case "S9":
      who.score += 9;
      break;
    case "H10":
    case "HJ":
    case "HQ":
    case "HK":
    case "S10":
    case "SJ":
    case "SQ":
    case "SK":
      who.score += 10;
      break;
    default:
      break;
  }
  console.log(who.name + '의 현재 점수 ' + who.score);
}

function cardCheck(card) {
  switch (card) {
    case "H1":
      card.src = "https://upload.wikimedia.org/wikipedia/commons/d/d4/English_pattern_ace_of_hearts.svg";
      break;
    case "S1":
      card.src = "https://upload.wikimedia.org/wikipedia/commons/1/19/English_pattern_ace_of_spades.svg";
      break;
    case "H2":
      card.src = "https://upload.wikimedia.org/wikipedia/commons/2/26/English_pattern_2_of_hearts.svg";
      break;
    case "S2":
      card.src = "https://upload.wikimedia.org/wikipedia/commons/0/0b/English_pattern_2_of_spades.svg";
      break;
    case "H3":
      card.src = "https://upload.wikimedia.org/wikipedia/commons/0/0f/English_pattern_3_of_hearts.svg";
      break;
    case "S3":
      card.src = "https://upload.wikimedia.org/wikipedia/commons/a/a5/English_pattern_3_of_spades.svg";
      break;
    case "H4":
      card.src = "https://upload.wikimedia.org/wikipedia/commons/b/bb/English_pattern_4_of_hearts.svg";
      break;
    case "S4":
      card.src = "https://upload.wikimedia.org/wikipedia/commons/3/34/English_pattern_4_of_spades.svg";
      break;
    case "H5":
      card.src = "https://upload.wikimedia.org/wikipedia/commons/c/c6/English_pattern_5_of_hearts.svg";
      break;
    case "S5":
      card.src = "https://upload.wikimedia.org/wikipedia/commons/9/9c/English_pattern_5_of_spades.svg";
      break;
    case "H6":
      card.src = "https://upload.wikimedia.org/wikipedia/commons/d/da/English_pattern_6_of_hearts.svg";
      break;
    case "S6":
      card.src = "https://upload.wikimedia.org/wikipedia/commons/a/ac/English_pattern_6_of_spades.svg";
      break;
    case "H7":
      card.src = "https://upload.wikimedia.org/wikipedia/commons/c/cb/English_pattern_7_of_hearts.svg";
      break;
    case "S7":
      card.src = "https://upload.wikimedia.org/wikipedia/commons/d/d1/English_pattern_7_of_spades.svg";
      break;
    case "H8":
      card.src = "https://upload.wikimedia.org/wikipedia/commons/3/3c/English_pattern_8_of_hearts.svg";
      break;
    case "S8":
      card.src = "https://upload.wikimedia.org/wikipedia/commons/4/4d/English_pattern_8_of_spades.svg";
      break;
    case "H9":
      card.src = "https://upload.wikimedia.org/wikipedia/commons/2/22/English_pattern_9_of_hearts.svg";
      break;
    case "S9":
      card.src = "https://upload.wikimedia.org/wikipedia/commons/f/f0/English_pattern_9_of_spades.svg";
      break;
    case "H10":
      card.src = "https://upload.wikimedia.org/wikipedia/commons/b/bb/English_pattern_10_of_hearts.svg";
      break;
    case "HJ":
      card.src = "https://upload.wikimedia.org/wikipedia/commons/5/56/English_pattern_jack_of_hearts.svg";
      break;
    case "HQ":
      card.src = "https://upload.wikimedia.org/wikipedia/commons/9/9d/English_pattern_queen_of_hearts.svg";
      break;
    case "HK":
      card.src = "https://upload.wikimedia.org/wikipedia/commons/1/14/English_pattern_king_of_hearts.svg";
      break;
    case "S10":
      card.src = "https://upload.wikimedia.org/wikipedia/commons/d/da/English_pattern_10_of_spades.svg";
      break;
    case "SJ":
      card.src = "https://upload.wikimedia.org/wikipedia/commons/4/4f/English_pattern_jack_of_spades.svg";
      break;
    case "SQ":
      card.src = "https://upload.wikimedia.org/wikipedia/commons/c/ca/English_pattern_queen_of_spades.svg";
      break;
    case "SK":
      card.src = "https://upload.wikimedia.org/wikipedia/commons/f/f1/English_pattern_king_of_spades.svg";
      break;
    default:
      break;
  }
}



function clickSoundPlay() {
  var clickSound = new Audio('./src/sound/clickSound.mp3');
  clickSound.currentTime = 0;
  clickSound.muted = "true";
  clickSound.play();
  clickSound.muted = "false";
}
function bettingSoundPlay() {
  var clickSound = new Audio('./src/sound/bettingSound.mp3');
  clickSound.currentTime = 0;
  clickSound.play();
}

function backImgLoad() {
  if (localStorage.getItem('backImg') == "0") {
    return "./src/img/cardBackImg_0.png";
  }
  else if(localStorage.getItem('backImg') == "1"){
    return "./src/img/cardBackImg_1.svg";
  }
  else if(localStorage.getItem('backImg') == "2"){
    return "./src/img/cardBackImg_2.svg";
  }
  else if(localStorage.getItem('backImg') == "3"){
    return "./src/img/cardBackImg_3.png";
  }
  else if(localStorage.getItem('backImg') == "4"){
    return "./src/img/cardBackImg_4.png";
  }
  else {
    return "./src/img/cardBackImg_0.png";
  }
}
function backgroundMusicPlay() {
  var music = new Audio('/src/sound/backgroundMusic.mp3');
  music.currentTime = 0;
  music.loop();
  music.muted = false;
  music.play();
  music.volume = 0.2;
}


// 커스터마이징
function buyBackImg(card) {
 let select = confirm("구매하시겠습니까?");

 if (select) {
  if (card == 1) {
    if (parseFloat(localStorage.getItem("ownChip")) >= 10000){
      if (localStorage.getItem("card1") == "1"){
        alert('이미 구매한 카드입니다.');
      }
      else {
        localStorage.setItem("card1", 1);
        localStorage.setItem("ownChip", parseFloat(localStorage.getItem("ownChip")) - 10000 );
        chip.refresh();
        alert('구매 완료되었습니다.');
      }
    }
    else {
      alert('금액이 부족합니다.');
    }
  }
  else if (card == 2) {
    if (parseFloat(localStorage.getItem("ownChip")) >= 10000){
      if (localStorage.getItem("card2") == "1"){
        alert('이미 구매한 카드입니다.');
      }
      else {
        localStorage.setItem("card2", 1);
        localStorage.setItem("ownChip", parseFloat(localStorage.getItem("ownChip")) - 10000 );
        chip.refresh();
        alert('구매 완료되었습니다.');
      }
    }
    else {
      alert('금액이 부족합니다.');
    }
  }
  else if (card == 3) {
    if (parseFloat(localStorage.getItem("ownChip")) >= 10000){
      if (localStorage.getItem("card3") == "1"){
        alert('이미 구매한 카드입니다.');
      }
      else {
        localStorage.setItem("card3", 1);
        localStorage.setItem("ownChip", parseFloat(localStorage.getItem("ownChip")) - 10000 );
        chip.refresh();
        alert('구매 완료되었습니다.');
      }
    }
    else {
      alert('금액이 부족합니다.');
    }
  }
  else if (card == 4) {
    if (parseFloat(localStorage.getItem("ownChip")) >= 10000){
      if (localStorage.getItem("card4") == "1"){
        alert('이미 구매한 카드입니다.');
      }
      else {
        localStorage.setItem("card4", 1);
        localStorage.setItem("ownChip", parseFloat(localStorage.getItem("ownChip")) - 10000 );
        chip.refresh();
        alert('구매 완료되었습니다.');
      }
    }
    else {
      alert('금액이 부족합니다.');
    }
  }
  else {
    alert('이미 구매한 카드입니다.')
  }

 }
}

function apply(card) {
  if (card == 1) {
    if (localStorage.getItem("card1") == "1") {
      if(localStorage.getItem("backImg") == "1") {
        alert("이미 적용된 카드입니다.");
      }
      else {
        localStorage.setItem("backImg", "1");
        alert("카드 뒷면이 바뀌었습니다.");
      }
    }
    else {
      alert("구매하지 않은 카드입니다.");
    }
  }
  else if (card == 2) {
    if (localStorage.getItem("card2") == "1") {
      if(localStorage.getItem("backImg") == "2") {
        alert("이미 적용된 카드입니다.");
      }
      else {
        localStorage.setItem("backImg", "2");
        alert("카드 뒷면이 바뀌었습니다.");
      }
    }
    else {
      alert("구매하지 않은 카드입니다.");
    }
  }
  else if (card == 3) {
    if (localStorage.getItem("card3") == "1") {
      if(localStorage.getItem("backImg") == "3") {
        alert("이미 적용된 카드입니다.");
      }
      else {
        localStorage.setItem("backImg", "3");
        alert("카드 뒷면이 바뀌었습니다.");
      }
    }
    else {
      alert("구매하지 않은 카드입니다.");
    }
  }
  else if (card == 4) {
    if (localStorage.getItem("card4") == "1") {
      if(localStorage.getItem("backImg") == "4") {
        alert("이미 적용된 카드입니다.");
      }
      else {
        localStorage.setItem("backImg", "4");
        alert("카드 뒷면이 바뀌었습니다.");
      }
    }
    else {
      alert("구매하지 않은 카드입니다.");
    }
  }
  else {
    if(localStorage.getItem("backImg") == "0") {
      alert("이미 적용된 카드입니다.");
    }
    else {
      localStorage.setItem("backImg", "0");
      alert("카드 뒷면이 바뀌었습니다.");
    }
  }
}



// 볼륨조절 실패작
// const audio = document.getElementById('audioPlayer');
// const audioVolume = document.getElementById('volume');

// audioVolume.addEventListener("change", function(e) {
//   localStorage.setItem("volume", (this.value / 10));
//   audio.volume = parseFloat(localStorage.getItem("volume"));
// })

// function volumeControl() {
//   audio.volume = parseFloat(localStorage.getItem("volume"));
// }