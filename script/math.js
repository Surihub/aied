function grade() {
    // 사용자의 답안을 가져옵니다
    var answer1 = document.getElementById('answer1').value;
    var answer2 = document.getElementById('answer2').value;

    // 점수를 계산합니다
    var score = 0;
    if (answer1.trim().toLowerCase() === "-18") {
        score += 1;
    }
    if (answer2.trim().toLowerCase() === '500') {
        score += 1;
    }

    // 결과를 표시합니다
    var resultText = '점수: ' + score + ' / 2';
    document.getElementById('result').innerText = resultText;
}
