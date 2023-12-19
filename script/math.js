prompt2_assess = `
user는 중학교 1학년 학생, assistant는 학생의 답안을 평가하는 수학 교사입니다. 아래의 과정에 따라 [학생 Z 답안]을 평가하세요.
1. [문제]와 [모범답안]을 자세히 읽고 [모범답안]에 따라 문제를 풀어보세요. 학생 답안이 틀릴 수 있으니 [학생 답안]에 의존해서 문제를 풀지 마세요.

[문제] 어느 배구 동아리에서 회비를 걷어서 배구공을 사려고 한다. 회비를 2000원씩 걷으면 8000원이 부족하고, 3000원씩 걷으면 7000원이 남는다고 할 때, 2500원씩 걷으면 얼마가 부족한지 구하시오.

[모범답안] 
동아리원 수를 x명이라고 하자. 
회비를 2000원씩 걷으면 8000원이 부족하기 때문에 배구공의 가격은 2000x+8000원이다. 
또한, 회비를 3000원씩 걷으면 7000원이 남기 때문에 배구공의 가격은 3000x-7000원이다. 
배구공의 가격은 동일하므로 2000x+8000 = 3000x-7000이다. 
이 일차방정식을 풀면 1000x = 15000이므로 x =15이므로, 동아리원은 15명이 있다. 나아가, 배구공의 가격은 2000*15+8000 = 38000원이다. 
결론적으로 2500원씩 걷을때 부족한 금액을 y원이라고 한다면, 2500*15+y = 38000이 성립하고 이 일차방정식을 풀면 y = 500원이다. 
따라서 부족한 금액은 500원이다. 

[평가요소]
(1) 미지수인 동아리원의 수를 x명이라고 하였는가?
(2) 배구공의 가격의 조건을 통해 일차방정식 2000x+8000=3000x-7000을 세웠는가?
(3) (2)에서 세운 일차방정식을 올바르게 풀어 동아리원의 수  x=15를 구했는가?
(4) (3)에서 구한 동아리원의 수를 바탕으로 배구공의 가격 38000을 구했는가?
(5) (4)에서 구한 배구공의 가격을 바탕으로 2500원씩 걷었을 때 부족한 금액 500원을 구했는가?`;

async function diagnosis() {
    const apiKey = document.getElementById('apiKey').value;
    if (!apiKey) {
        alert('API 키를 입력해주세요.');
        return;
    }

    var answer1 = document.getElementById('answer1').value;
    var answer2 = document.getElementById('answer2').value;

    try {
        const response = await fetch('https://api.openai.com/v1/engines/davinci/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                // prompt: `Grade the following answers:\n1) ${answer1}\n2) ${answer2}\nProvide specific feedback to the student.`,
                prompt : `${prompt2_assess}, ${answer2}`,
                max_tokens: 300,
                temperature: 0.5
            })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        };

        const responseData = await response.json();
        console.log(responseData); // Debugging: Log the entire response
        console.log(responseData.choices[0].text); // Debugging: Log the entire response
        document.getElementById('diagnosis').innerText = `GPT의 피드백 결과입니다. \n${responseData.choices[0].text}`;

        return responseData.choices[0].text; // Returning the specific text response
        

    }catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        return `Error fetching data: ${error.message}`; // Returning a more informative error message
    }
}

async function gptfeedback() {
    try {
        const feedbackText = await diagnosis();
        document.getElementById('feedback').innerText = `GPT의 피드백 결과입니다. \n${feedbackText}`;
    } catch (error) {
        document.getElementById('feedback').innerText = 'Error: ' + error.message;
    }
}





async function gptfeedback() {
    var answer1 = document.getElementById('answer1').value;
    var answer2 = document.getElementById('answer2').value;

    try {
        const feedbackResult = await diagnosis();
        // Assuming the API response has a field that contains the feedback text
        const feedbackText = feedbackResult.someFieldWithFeedback || 'No feedback provided';
        document.getElementById('feedback').innerText = `GPT의 피드백 결과입니다. \n${feedbackText}`;
    } catch (error) {
        document.getElementById('feedback').innerText = 'Error: ' + error.message;
    }
}



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


