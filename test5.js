$(function () {
    $('#js-slider-3').slick({
      arrows: true, // 前・次のボタンを表示する
      dots: true, // ドットナビゲーションを表示する
      appendDots: $('.dots-3'), // ドットナビゲーションの生成位置を変更
      speed: 1000, // スライドさせるスピード（ミリ秒）
      slidesToShow: 3, // 表示させるスライド数
      variableWidth: true, // スライド幅の自動計算を無効化
    });
  });

// そのまま印刷する場合のコード
function clickBtn16() {
  const ta3 = document.getElementById("textarea16").value;
  document.getElementById("span16").textContent = ta3;
}

function clickBtn2() {
  const ta3 = document.getElementById("textarea2").value;
  document.getElementById("span2").textContent = ta3;
}

// chatgpt API
const URL = "https://api.openai.com/v1/chat/completions";


function reply() {
  var text = document.getElementById("textarea9").value;
  var text2 = document.getElementById("textarea10").value;
  var text3 = document.getElementById("textarea11").value;
  var text4 = document.getElementById("textarea12").value;

  async function getResponse() {
      try {
          const response = await axios.post(
              URL,
              {
                  "model": "gpt-3.5-turbo",
                  "messages": [
                      {"role": "system", "content": "You are a helpful assistant. Please summarize the sentence in Japanese."},
                      { "role": "user", "content": text + text2 + text3 + text4}
                  ]
              },
              {
                  headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${API_KEY}`,
                  },
              }
          );
          var chatgpt_response = response.data.choices[0].message.content;
          // $("#response_text").val(chatgpt_response);
          document.getElementById("response_text").textContent = chatgpt_response;
      } catch (error) {
          console.log(error);
      }
  }
  getResponse();
}

// document.querySelector('#print').addEventListener('click', () => {
//   reply();
//   clickBtn16();
//   clickBtn2();
//   setTimeout(window.print(),3000);
// });

var button = document.getElementById("baseObject");
document.getElementById('baseObject').addEventListener('click', () => {
  reply();
  clickBtn16();
  button.className = "click";
  button.innerHTML = "<span></span>ローディング中";
  setTimeout(function(){ button.className = button.className.replace("click", ""); button.innerHTML = "<span></span>印刷する"; }, 3000);
  setTimeout(function() {window.print();}, 3000);
});

// document.querySelector('#chat').addEventListener('click', () => {
//   reply();
// });