let quizData = []; // CSVのデータを格納する配列
let remainingQuestions = []; // 残りの問題を格納する配列
let currentQuestion = {}; // 現在出題中の問題を保持

// CSVデータを読み込む関数
function loadCSV() {
    fetch('data.csv')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTPエラー: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            // CSVデータを解析して問題データを作成
            const lines = data.split('\n');
            lines.forEach((line, index) => {
                if (index === 0 || !line.trim()) return; // ヘッダー行と空行をスキップ
                const [year, event] = line.split(',');
                if (year && event) {
                    quizData.push({ year: parseInt(year.trim()), event: event.trim() });
                }
            });
            remainingQuestions = [...quizData]; // 最初に全ての問題を残り問題リストにコピー
            loadRandomQuestion();  // 最初のランダムな問題をロード
        })
        .catch(error => {
            console.error('CSVの読み込みエラー:', error);
            document.getElementById('question-text').innerText = 'CSVデータを読み込めませんでした。';
        });
}

// ランダムな問題を表示する関数
function loadRandomQuestion() {
    if (remainingQuestions.length === 0) {
        document.getElementById('question-text').innerText = 'クイズ終了！';
        document.getElementById('result').innerHTML = '';
        document.getElementById('year-input').disabled = true; // 終了後に入力を無効にする
        return;
    }

    // ランダムに問題を選択
    const randomIndex = Math.floor(Math.random() * remainingQuestions.length);
    currentQuestion = remainingQuestions[randomIndex];

    // 問題を表示
    document.getElementById('question-text').innerText = `${currentQuestion.event}`;
    document.getElementById('result').innerHTML = ''; // 結果をリセット
    document.getElementById('year-input').value = ''; // 入力フィールドをリセット

    // 選ばれた問題を残りの問題リストから削除
    remainingQuestions.splice(randomIndex, 1);
}

// 答え合わせを行う関数
function checkAnswer() {
    const userInput = parseInt(document.getElementById('year-input').value);

    if (isNaN(userInput)) {
        document.getElementById('result').innerHTML = "<p style='color: red;'>年号を入力してください。</p>";
        return;
    }

    const correctYear = currentQuestion.year;

    if (userInput === correctYear) {
        document.getElementById('result').innerHTML = "<p style='color: green;'>正解です！</p>";
    } else {
        document.getElementById('result').innerHTML = `<p style='color: red;'>不正解です。正解は${correctYear}年です。</p>`;
    }

    // 次の問題に進む
    setTimeout(loadRandomQuestion, 2000); // 2秒後に次の問題を表示
}

// ページが読み込まれたらCSVをロード
window.onload = loadCSV;