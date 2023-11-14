
// スクロール関係

// スムーススクロール
const paginations = document.querySelectorAll(".pagination a");
paginations.forEach(pagination => {
  pagination.addEventListener("click", e => {
    e.preventDefault();
    const targetId = e.target.hash;
    const target = document.querySelector(targetId);
    target.scrollIntoView({ behavior: "smooth" });
  });
});

// Intersection Observer
const sections = document.querySelectorAll(".section");
const observerRoot = document.querySelector(".fullPageScroll");
const options = {
  root: observerRoot,
  rootMargin: "-50% 0px",
  threshold: 0
};
const observer = new IntersectionObserver(doWhenIntersect, options);
sections.forEach(section => {
  observer.observe(section);
});

/**
 * 交差したときに呼び出す関数
 * @param entries - IntersectionObserverEntry IntersectionObserverが交差したときに渡されるオブジェクトです。
 */
function doWhenIntersect(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      activatePagination(entry.target);
    }
  });
}

/**
 * ページネーションの大きさを変える関数
 * @param element - HTMLElement 現在表示中のスライドのHTML要素を引数に取ります。
 */
function activatePagination(element) {
  const currentActiveIndex = document.querySelector("#pagination .active");
  if (currentActiveIndex !== null) {
    currentActiveIndex.classList.remove("active");
  }
  const newActiveIndex = document.querySelector(`a[href='#${element.id}']`);
  newActiveIndex.classList.add("active");
}


// chatGPTコード
const URL = "https://api.openai.com/v1/chat/completions";

//あとで消す
function reply(request_text) {
    var text = document.getElementById("request_text").value;
    async function getResponse() {
        try {
            const response = await axios.post(
                URL,
                {
                    "model": "gpt-3.5-turbo",
                    "messages": [
                        { "role": "system", "content": "語尾ににゃんをつけてください"},
                        { "role": "user", "content": text }
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
            $("#response_text").val(chatgpt_response);
        } catch (error) {
            console.log(error);
        }
    }
    getResponse();
}


async function updateChatListWithGpt3Response(userInput, chatListIndex) {
    try {
        const response = await axios.post(
            URL,
            {
                "model": "gpt-3.5-turbo",
                "messages": [
                    { "role": "system", "content": "同じ文字列を返してください"},
                    { "role": "user", "content": userInput }
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
        chatList[chatListIndex].text = chatgpt_response;
    } catch (error) {
        console.log(error);
    }
}


//厳格モード、つまり、的確なエラーチェックが行われる
'use strict';

/*
【補足】
- チャットの画面にある「ul」にJavaScriptで「li」を追加していく仕組みです。
- ロボットが返信する度に、「robotCount」を1ずつ足していきます。この値がロボットが話す内容をまとめた「chatList」オブジェクトの数値に対応します。自分がテキストを入力し、送信ボタンを押した瞬間の「robotCount」の値に応じて、配列から次のメッセージを選び返信させます。
- 今回作った関数は、ロボットの投稿をする「robotOutput()」と、自分が送信ボタンを押したときの関数（無名関数）です。


【開発状況】
[✓] ロボットからの投稿 20190918完成
[✓] 自分の投稿 20190918完成
[✓] option.normal 処理
[✓] option.random 処理
[✓] option.select 処理 利用 20210524完成
[✓] continue 処理
[✓] save 処理，chatDataList 利用 20210524完成
[×] さらなる会話の分岐 
[✓] ロボットからのリンクの送信
[×] 正解なし質問に応じた返答
[×] テキストマイニング
[✓] ロボットの考え中のアニメーション
[×] ロボットのアイコン
[×] 「他に知りたいことはありますか？」というようなループ
[×] 「」というようなループ
[×] ロボットの質問番号の自動化


【開発捕捉】
■ chatList のoptionの種類
- chatList[n].option = ['normal', 'random', 'select'];

■ chatList のプロパティの種類
- text -> ロボットが表示する文字
- continue -> 次もロボットが連続で投稿するときは true を指定する
- option -> normal は普通，random は配列状態の text をランダムで一つ投稿する，select は選択肢（個数に制限なし）を提示する
- link: trueでリンク化
*/


// ロボットからの投稿一覧のオブジェクト
// textには投稿文，continueは次も連続で投稿するかどうか，optionは普通の投稿or選択肢orランダム投稿など
const chatList = {
    1: {text: '「ことばのまもり」へようこそ', continue: true, option: 'normal'},
    2: {text: '会話内容は管理者へ送信されませんので、ご安心ください。', continue: true, option: 'normal'},
    3: {text: 'あなたのお名前を教えてください。', continue: false, option: 'normal'},
    // userCount2：名前
    4: {text: '', continue: true, option: 'normal'},
    5: {text: '本作品では、あなたのことばと紐づく記憶を伺います。質問内容は、あなたの回答にあわせて変化するので、「わからない/無回答」は避け、気負わずに等身大のあなたを教えてくださいね。', continue: true, option: 'normal'},
    6: {text: 'まずは、あなたが最近1番幸せを感じた経験を教えてください', continue: false, option: 'normal'},
    7: {text: 'その時の記憶で、あなたが1番記憶に残っていることばは何ですか？', continue: false, option: 'normal'},
    8: {text: 'なぜ最も記憶に残っていると思いますか？あなたの心になぜ響いたのでしょうか？', continue: false, option: 'normal'},
    9: {text: '教えてくださりありがとうございます！', continue: true, option: 'normal'},
    10: {text: '次にあなたの学生時代で最も印象に残っている記憶を教えてください。', continue: false, option: 'normal'},
    11: {text: '', continue: false, option: 'normal'},
    // userCount3：体調
    12: {text: 'これまでの質問を踏まえて、あなたが最も大切にしたい記憶を教えてください', continue: true, continue: false, option: 'normal'},
    13: {text: 'これが最後の質問になります。その時の記憶にある最も大切にしたいことばを教えてください', continue: false, option: 'normal'},
    14: {text: '以上になります。短い時間でしたが、あなただけの素敵な記憶とことばに触れることができて幸せでした。', continue: true, option: 'normal'},
    15: {text: '最後にささやかになりますが、今日あなたが想いを馳せたことばと記憶が込められた「おまもり」をお送りします。次のページへスクロールしてください。', continue: true, option: 'normal'},
};


// 上記の投稿文（空の「text」）を加工する関数（中に相手の名前などを挿入する際に用いる）
// userData === ["何を知りたいですか？", 名前","体調","山の質問","満足度","感想"];
// userData はユーザーの回答内容の全てを記憶
function textSpecial() {
    chatList[4].text = `${userData[0]}さん、よろしくお願いします！`;
    if (robotCount == 4) {
        updateChatListWithGpt3Response(userText.value, 11);
    }   
}


// 「userCount」は実質必要ないが、管理しやすくするために導入する（「chatList」のコメントアウト，最後のやまびこ，今後の開発）
let userCount = 0;
// ユーザーの発言，回答内容を記憶する配列
let userData = [];

// 一番下へ
function chatToBottom() {
    const chatField = document.getElementById('chatbot-body');
    chatField.scroll(0, chatField.scrollHeight - chatField.clientHeight);
}

const userText = document.getElementById('chatbot-text');
const chatSubmitBtn = document.getElementById('chatbot-submit');

// ロボットが投稿をする度にカウントしていき、投稿を管理する
let robotCount = 0;
// 選択肢の正解個数
let qPoint = 0;

// 選択肢ボタンを押したときの次の選択肢（textのa，bなど）
let nextTextOption = '';

// 選択肢ボタンを押したとき（必要があれば、正解判別）
function pushChoice(e) {
    userCount ++;
    console.log(`userCount: ${userCount}`);

    const choicedId = e.getAttribute('id'); // 選択した選択肢のid
    // 回答内容の保存
    userData.push(document.getElementById(choicedId).textContent);
    if (chatList[robotCount].text.answer) {
        // 正解，不正解のある選択肢
        const trueChoice = `q-${robotCount}-${chatList[robotCount].text.answer}`// 正解選択肢のid
        if (choicedId === trueChoice) {
            // 正解
            nextTextOption = 'qTrue';
            qPoint ++;
        } else {
            // 不正解
            nextTextOption = 'qFalse';
        }
    } else {
        // 正解のない質問
        if(chatList[robotCount].questionNextSupport) {
            if (String(robotCount).length === 1) {
                // robotCountの桁数が1桁の時
                nextTextOption = choicedId.slice(4);
            } else if (String(robotCount).length === 2) {
                // robotCountの桁数が2桁の時
                nextTextOption = choicedId.slice(5);
            } else if (String(robotCount).length === 3) {
                // robotCountの桁数が3桁の時
                nextTextOption = choicedId.slice(6);
            }
        }
    }
    for (let i = 0; i < chatList[robotCount].text.choices.length; i ++) {
        document.getElementById('q-' + robotCount + '-' + i).disabled = true;
        document.getElementById('q-' + robotCount + '-' + i).classList.add('choice-button-disabled');
        document.getElementById(choicedId).classList.remove('choice-button-disabled');
    }

  　robotOutput();

    console.log(userData);
}

// 拡大ボタン
let chatbotZoomState = 'none';
const chatbot = document.getElementById('chatbot');
const chatbotBody = document.getElementById('chatbot-body');
const chatbotFooter = document.getElementById('chatbot-footer');
const chatbotZoomIcon = document.getElementById('chatbot-zoom-icon');


// --------------------ロボットの投稿--------------------
function robotOutput() {
    // 相手の返信が終わるまで、その間は返信不可にする
    // なぜなら、自分の返信を複数受け取ったことになり、その全てに返信してきてしまうから
    // 例："Hi!〇〇!"を複数など
    chatSubmitBtn.disabled = true;

    robotCount ++;
    console.log('robotCount' + robotCount);
    
  // ulとliを作り、左寄せのスタイルを適用し投稿する
    const ul = document.getElementById('chatbot-ul');
    const li = document.createElement('li');
    li.classList.add('left');
    ul.appendChild(li);
    
    // 考え中アニメーションここから
    const robotLoadingDiv = document.createElement('div');

    setTimeout( ()=> {
        li.appendChild(robotLoadingDiv);
        robotLoadingDiv.classList.add('chatbot-left');
        robotLoadingDiv.innerHTML = '<div id= "robot-loading-field"><span id= "robot-loading-circle1" class="material-icons">circle</span> <span id= "robot-loading-circle2" class="material-icons">circle</span> <span id= "robot-loading-circle3" class="material-icons">circle</span>';
        console.log('考え中');
        // 考え中アニメーションここまで

        // 一番下までスクロール
        // chatToBottom();
    }, 800);

    setTimeout( ()=> {

        // 考え中アニメーション削除
        robotLoadingDiv.remove();

        if (chatList[robotCount].option === 'choices') {
            const qAnswer = `q-${robotCount}-${chatList[robotCount].text.answer}`;
            const choiceField = document.createElement('div');
            choiceField.id = `q-${robotCount}`;
            choiceField.classList.add('chatbot-left-rounded');
            li.appendChild(choiceField);
          
            // 質問タイトル
            const choiceTitle = document.createElement('div');
            choiceTitle.classList.add('choice-title');
            choiceTitle.textContent = chatList[robotCount].text.title;
            choiceField.appendChild(choiceTitle);
            // 質問文
            const choiceQ = document.createElement('div');
            choiceQ.textContent = chatList[robotCount].text.question;
            choiceQ.classList.add('choice-q');
            choiceField.appendChild(choiceQ);
          
            // 選択肢作成
            for (let i = 0; i < chatList[robotCount].text.choices.length; i ++) {
                const choiceButton = document.createElement('button');
                choiceButton.id = `${choiceField.id}-${i}`; // id設定
                choiceButton.setAttribute('onclick', 'pushChoice(this)'); // ボタンを押した際の合図
                choiceButton.classList.add('choice-button');
                choiceField.appendChild(choiceButton);
                choiceButton.textContent = chatList[robotCount].text.choices[i];
            }
          
        } else {
            // このdivにテキストを指定
            const div = document.createElement('div');
            li.appendChild(div);
            div.classList.add('chatbot-left');
            
            // テキストを加工する場合（次の回答が選択型でも使えるようにここに設置）
            textSpecial();  
          
            switch(chatList[robotCount].option) {
                case 'normal':
                    if (chatList[robotCount].text.qTrue) {
                        // 複数のテキストのうち特定のものを設定するとき
                        if(chatList[robotCount].link) {
                            div.innerHTML = `<a href= "${chatList[robotCount].text[nextTextOption]}" onclick= "chatbotLinkClick()">${chatList[robotCount].text[nextTextOption]}</a>`;
                        } else {
                            div.textContent = chatList[robotCount].text[nextTextOption];
                        }
                    } else if (robotCount > 1 && chatList[robotCount - 1].questionNextSupport) {
                        console.log('次の回答の選択肢は' + nextTextOption);
                        // 答えのない質問（次にサポートあり）
                        if(chatList[robotCount].link) {
                            div.innerHTML = `<a href= "${String(chatList[robotCount].text[nextTextOption])}" onclick= "chatbotLinkClick()">${String(chatList[robotCount].text[nextTextOption])}</a>`;
                        } else {
                            div.textContent = String(chatList[robotCount].text[nextTextOption]);
                        }
                    } else {
                        // 通常
                        if(chatList[robotCount].link) {
                            div.innerHTML = `<a href= "${chatList[robotCount].text}" onclick= "chatbotLinkClick()">${chatList[robotCount].text}</a>`;
                        } else {
                            div.textContent = chatList[robotCount].text;
                        }
                    }
                break;

                case 'random':
                    if(chatList[robotCount].link) {
                        div.innerHTML = `<a href= "${chatList[robotCount].text[Math.floor(Math.random() * chatList[robotCount].text.length)]}" onclick= "chatbotLinkClick()">${chatList[robotCount].text[Math.floor(Math.random() * chatList[robotCount].text.length)]}</a>`;
                    } else {
                        div.textContent = chatList[robotCount].text[Math.floor(Math.random() * chatList[robotCount].text.length)];
                    }
                    
                break;
            }
            chatSubmitBtn.disabled = false;
        }

        // 一番下までスクロール
        chatToBottom();

        // 連続投稿
        if (chatList[robotCount].continue) {
            robotOutput();
        }
    }, 2000);

    if(chatbotZoomState === 'large' && window.matchMedia('(min-width:700px)').matches) {
        document.querySelectorAll('.chatbot-left').forEach((cl) => {
            cl.style.maxWidth = '52vw';
        });
        document.querySelectorAll('.chatbot-right').forEach((cr) => {
            cr.style.maxWidth = '52vw';
        });
        document.querySelectorAll('.chatbot-left-rounded').forEach((cr) => {
            cr.style.maxWidth = '52vw';
        });
    }
}

// 最初にロボットから話しかける
robotOutput();


// --------------------自分の投稿（送信ボタンを押した時の処理）--------------------
chatSubmitBtn.addEventListener('click', async () => {
    // 空行の場合送信不可
    if (!userText.value || !userText.value.match(/\S/g)) return false;

    userCount ++;
    console.log(`userCount: ${userCount}`);

    // 投稿内容を後に活用するために、配列に保存しておく
    userData.push(userText.value);
    console.log(userData);

  // ulとliを作り、右寄せのスタイルを適用し投稿する
  const ul = document.getElementById('chatbot-ul');
  const li = document.createElement('li');
  // このdivにテキストを指定
  const div = document.createElement('div');

  li.classList.add('right');
  ul.appendChild(li);
  li.appendChild(div);
  div.classList.add('chatbot-right');
  div.textContent = userText.value;

    // GPT-3を用いて特定のチャットリストを更新
    // if (userCount === 5) {
    //     await updateChatListWithGpt3Response(userText.value, 11);
    // }

    if (userCount === 7) {
        // 新しいpタグを作成
        let newPTag = document.createElement('h3');
        newPTag.className = 'body2';

        // pタグの内容をuserDataの6番目の要素で設定
        newPTag.textContent = userText.value ;

        // 既存のliタグを選択
        let liTag = document.querySelector('.col1 li');

        // liタグの子要素として新たに作成したpタグを追加
        liTag.appendChild(newPTag);
}

if (userCount === 8) {
    // 新しいpタグを作成
    let newPTag = document.createElement('h3');
    newPTag.className = 'body1';

    // pタグの内容をuserDataの6番目の要素で設定
    newPTag.textContent = userText.value ;

    // 既存のliタグを選択
    let liTag = document.querySelector('.col3 li');

    // liタグの子要素として新たに作成したpタグを追加
    liTag.appendChild(newPTag);
}
  if(robotCount < Object.keys(chatList).length) {
    robotOutput();

  } else {
    // repeatRobotOutput(userText.value);
    repeatRobotOutput();
  }

  // 一番下までスクロール
  chatToBottom();

  // テキスト入力欄を空白にする
  userText.value = '';
});

// 最後やまびこ
function repeatRobotOutput() {
    robotCount ++;
    console.log(robotCount);

    chatSubmitBtn.disabled = true;
                   
    const ul = document.getElementById('chatbot-ul');
    const li = document.createElement('li');
    li.classList.add('left');
    ul.appendChild(li);

    // 考え中アニメーションここから
    const robotLoadingDiv = document.createElement('div');

    setTimeout( ()=> {
        li.appendChild(robotLoadingDiv);
        robotLoadingDiv.classList.add('chatbot-left');
        robotLoadingDiv.innerHTML = '<div id= "robot-loading-field"><span id= "robot-loading-circle1" class="material-icons">circle</span> <span id= "robot-loading-circle2" class="material-icons">circle</span> <span id= "robot-loading-circle3" class="material-icons">circle</span>';
        console.log('考え中');
        // 考え中アニメーションここまで

        // 一番下までスクロール
        chatToBottom();
    }, 800);
    
    setTimeout( ()=> {

        // 考え中アニメーション削除
        robotLoadingDiv.remove();
      
        // このdivにテキストを指定
        const div = document.createElement('div');
        li.appendChild(div);
        div.classList.add('chatbot-left');

        div.textContent = userData[userCount - 1];
      
        // 一番下までスクロール
        chatToBottom();

        chatSubmitBtn.disabled = false;

    }, 2000);

    if(chatbotZoomState === 'large') {
        document.querySelectorAll('.chatbot-left').forEach((cl) => {
            cl.style.maxWidth = '52vw';
        });
        document.querySelectorAll('.chatbot-right').forEach((cr) => {
            cr.style.maxWidth = '52vw';
        });
        document.querySelectorAll('.chatbot-left-rounded').forEach((cr) => {
            cr.style.maxWidth = '52vw';
        });
    }
}




// PC用の拡大縮小機能
function chatbotZoomShape() {
    chatbotZoomState = 'large';
    console.log(chatbotZoomState);
    
    chatbot.classList.add('chatbot-zoom');
    chatbotBody.classList.add('chatbot-body-zoom');
    chatbotFooter.classList.add('chatbot-footer-zoom');
    // 縮小アイコンに変更
    chatbotZoomIcon.textContent = 'fullscreen_exit';
    chatbotZoomIcon.setAttribute('onclick', 'chatbotZoomOff()');

    if (window.matchMedia('(min-width:700px)').matches) {
        //PC処理
        document.querySelectorAll('.chatbot-left').forEach((cl) => {
            cl.style.maxWidth = '52vw';
        });
        document.querySelectorAll('.chatbot-right').forEach((cr) => {
            cr.style.maxWidth = '52vw';
        });
        document.querySelectorAll('.chatbot-left-rounded').forEach((cr) => {
            cr.style.maxWidth = '52vw';
        });
    }
}
function chatbotZoom() {
    // 拡大する
    chatbotZoomShape();
    window.location.href = '#chatbot';
    // フルスクリーン
    // document.body.requestFullscreen();
}
function chatbotZoomOffShape() {
    chatbotZoomState = 'middle';
    console.log(chatbotZoomState);

    chatbot.classList.remove('chatbot-zoom');
    chatbotBody.classList.remove('chatbot-body-zoom');
    chatbotFooter.classList.remove('chatbot-footer-zoom');
    // 拡大アイコンに変更
    chatbotZoomIcon.textContent = 'fullscreen';
    chatbotZoomIcon.setAttribute('onclick', 'chatbotZoom()');

    document.querySelectorAll('.chatbot-left').forEach((cl) => {
        cl.style.maxWidth = '70%';
    });
    document.querySelectorAll('.chatbot-right').forEach((cr) => {
        cr.style.maxWidth = '70%';
    });
    document.querySelectorAll('.chatbot-left-rounded').forEach((cr) => {
        cr.style.maxWidth = '70%';
    });
}
function chatbotZoomOff() {
    // 縮小する
    chatbotZoomOffShape();
    window.history.back();
    // フルスクリーン解除
    // document.exitFullscreen();
}


// チャットボット内のリンクが押されたとき
function chatbotLinkClick() {
    chatbotZoomOffShape();
    // 折りたたむ
    document.getElementById('chatbot').classList.add('chatbot-none');
    document.getElementById('chatbot-back').classList.add('none');
    document.getElementById('chatbot-start-button-icon').textContent = 'question_answer';
}

//印刷
document.querySelector('#print').addEventListener('click', () => {
    window.print();
  });


document.addEventListener('DOMContentLoaded', function() {
document.getElementById("reloadBtn").addEventListener("click", function(){
window.location.reload();
})
});