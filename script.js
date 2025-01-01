let quizData = []; // CSVのデータを格納する配列
let remainingQuestions = []; // 残りの問題を格納する配列
let currentQuestion = {}; // 現在出題中の問題を保持

// CSVデータを読み込む関数
function loadCSV() {
    fetch('JPHS.csv') // ファイル名を修正
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTPエラー: ${response.status} ${response.statusText}`);
            }
            return response.text();
        })
        .then(data => {
            parseCSV(data); // CSVデータを解析
            loadRandomQuestion(); // 最初の問題を表示
        })
        .catch(error => {
            console.error('CSV読み込みエラー:', error);
            document.getElementById('question-text').innerText = 'CSVデータを読み込めませんでした。';
        });
}

// CSVデータを解析する関数
function parseCSV(data) {
    const lines = data.split('\n');
    lines.forEach((line, index) => {
        if (index === 0 || !line.trim()) return; // ヘッダー行と空行をスキップ
        const [Ans, Qus] = line.split(',');
        if (Ans && Qus) {
            quizData.push({ Ans: Ans.trim(), Qus: Qus.trim() });
        } else {
            console.warn(`CSVフォーマットエラー: ${line} (行: ${index + 1})`);
        }
    });
    remainingQuestions = [...quizData]; // 全ての問題を残りの問題リストにコピー
}

// ランダムな問題を表示する関数
function loadRandomQuestion() {
    if (remainingQuestions.length === 0) {
        endQuiz(); // 問題がなくなったら終了
        return;
    }

    const randomIndex = Math.floor(Math.random() * remainingQuestions.length);
    currentQuestion = remainingQuestions[randomIndex];

    document.getElementById('question-text').innerText = `${currentQuestion.Qus}`;
    document.getElementById('result').innerHTML = ''; // 結果をリセット
    document.getElementById('Ans-input').value = ''; // 入力フィールドをリセット
    document.getElementById('next-btn').style.display = 'none'; // 次の問題ボタンを非表示

    remainingQuestions.splice(randomIndex, 1); // 出題済みの問題をリストから削除
}

// クイズ終了時の処理
function endQuiz() {
    document.getElementById('question-text').innerText = 'クイズ終了！';
    document.getElementById('result').innerHTML = '';
    document.getElementById('Ans-input').disabled = true;
    document.getElementById('retry-btn').style.display = 'block';
    document.getElementById('next-btn').style.display = 'none';
}

// 答え合わせを行う関数
function checkAnswer() {
    const userInput = document.getElementById('Ans-input').value.trim();

    if (!userInput) {
        document.getElementById('result').innerHTML = "<p style='color: red;'>答えを入力してください。</p>";
        return;
    }

    const correctAns = currentQuestion.Ans;

    if (userInput.toLowerCase() === correctAns.toLowerCase()) {
        document.getElementById('result').innerHTML = "<p style='color: green;'>正解です！次の問題へ進んでください。</p>";
    } else {
        document.getElementById('result').innerHTML = `<p style='color: red;'>不正解です。正解は「${correctAns}」です。次の問題へ進んでください。</p>`;
    }

    document.getElementById('next-btn').style.display = 'block';
}

// クイズを再挑戦する関数
function retryQuiz() {
    remainingQuestions = [...quizData];
    document.getElementById('Ans-input').disabled = false;
    document.getElementById('retry-btn').style.display = 'none';
    document.getElementById('next-btn').style.display = 'none';
    loadRandomQuestion();
}

// ページ読み込み時にCSVをロード
window.onload = loadCSV;
