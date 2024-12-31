let quizData = []; // CSVのデータを格納する配列
let remainingQuestions = []; // 残りの問題を格納する配列
let currentQuestion = {}; // 現在出題中の問題を保持

// CSVデータを読み込む関数
function loadCSV() {
    fetch('data.csv') // ファイルパスを確認
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTPエラー: ${response.status} ${response.statusText}`);
            }
            return response.text();
        })
        .then(data => {
            // CSVデータを解析して問題データを作成
            const lines = data.split('\n');
            lines.forEach((line, index) => {
                if (index === 0 || !line.trim()) return; // ヘッダー行と空行をスキップ
                const [Ans, Qus] = line.split(',');
                if (Ans && Qus) {
                    quizData.push({ Ans: parseInt(Ans.trim()), Qus: Qus.trim() });
                } else {
                    console.warn(`CSVフォーマットエラー: ${line} (行: ${index + 1})`);
                }
            });
            remainingQuestions = [...quizData]; // 最初に全ての問題を残り問題リストにコピー
            loadRandomQuestion(); // 最初のランダムな問題をロード
        })
        .catch(error => {
            console.error('CSV読み込みエラー:', error);
            document.getElementById('question-text').innerText = 'CSVデータを読み込めませんでした。';
        });
}

// ランダムな問題を表示する関数
function loadRandomQuestion() {
    if (remainingQuestions.length === 0) {
        document.getElementById('question-text').innerText = 'クイズ終了！';
        document.getElementById('result').innerHTML = '';
        document.getElementById('Ans-input').disabled = true; // 終了後に入力を無効にする
        document.getElementById('retry-btn').style.display = 'inline-block'; // 再挑戦ボタンを表示
        return;
    }

    // ランダムに問題を選択
    const randomIndex = Math.floor(Math.random() * remainingQuestions.length);
    currentQuestion = remainingQuestions[randomIndex];

    // 問題を表示
    document.getElementById('question-text').innerText = `${currentQuestion.Qus}`;
    document.getElementById('result').innerHTML = ''; // 結果をリセット
    document.getElementById('Ans-input').value = ''; // 入力フィールドをリセット

    // 選ばれた問題を残りの問題リストから削除
    remainingQuestions.splice(randomIndex, 1);
}

// 答え合わせを行う関数
function checkAnswer() {
    const userInput = parseInt(document.getElementById('Ans-input').value);

    if (isNaN(userInput)) {
        document.getElementById('result').innerHTML = "<p style='color: red;'>年号を入力してください。</p>";
        return;
    }

    const correctAns = currentQuestion.Ans;

    if (userInput === correctAns) {
        document.getElementById('result').innerHTML = "<p style='color: green;'>正解です！</p>";
    } else {
        document.getElementById('result').innerHTML = `<p style='color: red;'>不正解です。正解は${correctAns}年です。</p>`;
    }

    // 次の問題に進む
    setTimeout(loadRandomQuestion, 2000); // 2秒後に次の問題を表示
}

// 再挑戦する関数
function retryQuiz() {
    remainingQuestions = [...quizData]; // データをリセット
    document.getElementById('Ans-input').disabled = false; // 入力を有効にする
    loadRandomQuestion(); // 最初の問題を再度ロード
    document.getElementById('retry-btn').style.display = 'none'; // 再挑戦ボタンを非表示
}

// ページが読み込まれたらCSVをロード
window.onload = loadCSV;
