

// 문항 정보 불러오기
document.addEventListener('DOMContentLoaded', () => {
    fetch('data/문항 정보.csv')
        .then(response => response.text())
        .then(data => {
            const questions = parseCSV(data);
            const container = document.getElementById('question-container');
            questions.forEach((question, index) => {
                if (index > 0 && index < 6) { // 첫 번째 행(헤더) 제외
                    container.innerHTML += `
                        <div class="mb-4">
                            <p>[문제${index}] ${question['문항내용']}</p>
                            <input type="text" id="answer${index}" class="form-control answer-input" placeholder="여기에 답을 입력하세요" />
                        </div>
                    `;
                }
            });
        })
        .catch(error => console.error('Error:', error));
});

function parseCSV(csvData) {
    // CSV 파싱 로직을 여기에 구현하세요.
    // 아래는 CSV 파싱의 간단한 예시입니다.
    const lines = csvData.split('\n');
    return lines.map(line => {
        const [문항번호, 종류, 문항내용, 해설, 정답, A1, A2, A3] = line.split(',');
        return { 문항번호, 종류, 문항내용, 해설, 정답, A1, A2, A3 };
    });
}



// CSV 데이터를 문자열 상수로 포함
iteminfo = `문항 정보(csv형식)에 따른 나의 답안이 <학생답안> 이야. 내 답안과 Q행렬을 바탕으로 내가 일차방정식을 더 잘 이해하기 위한 전반적인 조언을 해줘. 참고로 Q행렬은 열을 각각 A1, A2, A3, 행을 각 문항으로 하는 행렬로, 1은 해당 문항에 이 인지요소가 있다는 뜻이고 0은 없다는 뜻이야.

문항번호,종류,문항내용,해설,정답,A1,A2,A3
1,2점짜리 문항 x개와 3점짜리 문항 (12-x)개의 정답을 맞혔을 때 점수를 식으로 나타내시오. ,2x+3(12-x)=-x+36,36-x,1,0,0
2,A=3x-5이고 B=-2x+1일 때 2A-B를 계산하시오.,2*(3x-5)-(-2x+1)=6x-10+2x-1=8x-11,8x-11,0,1,0
3,x=2를 해로 갖는 일차방정식을 두개 쓰시오.,,2x-4=0 혹은 x+3=5,0,0,1
4,일차방정식 5x+13=3x-23을 푸시오. ,5x-3x=-23-13이고 2x=-36이다. 따라서 x=-18,-18,0,1,1}
5,어느 배구 동아리에서 회비를 걷어서 배구공을 사려고 한다. 회비를 2000원씩 걷으면 8000원이 부족하고 3000원씩 걷으면 7000원이 남는다고 할 때 배구공의 가격을 구하시오. ,동아리원 수를 x명이라고 하자. 배구공의 가격의 식은 2000x+8000원이고 3000x-7000원이므로 2000x+8000 = 3000x-7000이다. 이 일차방정식을 풀면 1000x = 15000이므로 x =15 동아리원은 15명이 있다. 따라서 배구공의 가격은 2000*15+8000 = 38000원이다. ,38000원,1,1,1

<학생답안>
답안1: 2x+3(12-x)=-x+36
답안2: 2*(3x-5)-(-2x+1)=6x-10+2x-1=6x-11
답안3: 2x-4=0, x=1
답안4: x=-18
답안5: 동아리원 수를 x명이라고 하자. 배구공의 가격의 식은 2000x+8000원이고 3000x-7000원이므로 2000x+8000 = 3000x-7000이다. 이 일차방정식을 풀면 1000x = 15000이므로 x =15 동아리원은 15명이 있다. 따라서 배구공의 가격은 2000*15+8000 = 38000원이다."} ] )`


prompt = `내 답안과 Q행렬을 바탕으로 내가 일차방정식을 더 풀 수 있도록 조언을 해줘. 참고로 Q행렬은 열을 각각 A1, A2, A3, 행을 각 문항으로 하는 행렬로, 1은 해당 문항에 이 인지요소가 있다는 뜻이고 0은 없다는 뜻이야. A1, A2, A3는 각각 상황을 문자로 표현하기, 일차식의 계산, 해의 의미야. 문항 정보(csv형식)에 따른 나의 답안이 <학생답안> 이야. 

문항번호,종류,문항내용,해설,정답,A1,A2,A3
1,2점짜리 문항 x개와 3점짜리 문항 (12-x)개의 정답을 맞혔을 때 점수를 식으로 나타내시오. ,2x+3(12-x)=-x+36,36-x,1,0,0
2,A=3x-5이고 B=-2x+1일 때 2A-B를 계산하시오.,2*(3x-5)-(-2x+1)=6x-10+2x-1=8x-11,8x-11,0,1,0
3,x=2를 해로 갖는 일차방정식을 두개 쓰시오.,,2x-4=0 혹은 x+3=5,0,0,1
4,일차방정식 5x+13=3x-23을 푸시오. ,5x-3x=-23-13이고 2x=-36이다. 따라서 x=-18,-18,0,1,1}
5,어느 배구 동아리에서 회비를 걷어서 배구공을 사려고 한다. 회비를 2000원씩 걷으면 8000원이 부족하고 3000원씩 걷으면 7000원이 남는다고 할 때 배구공의 가격을 구하시오. ,동아리원 수를 x명이라고 하자. 배구공의 가격의 식은 2000x+8000원이고 3000x-7000원이므로 2000x+8000 = 3000x-7000이다. 이 일차방정식을 풀면 1000x = 15000이므로 x =15 동아리원은 15명이 있다. 따라서 배구공의 가격은 2000*15+8000 = 38000원이다. ,38000원,1,1,1
`

prompt_en = `Give me advice on how to solve more first-order equations based on my answers and the Q-matrix. For reference, the Q matrix is a matrix with columns A1, A2, A3, and rows for each question, where 1 means that the question has this cognate and 0 means that it does not. A1, A2, and A3 are the textual representation of the situation, the calculation of the first-order equation, and the solution, respectively. My answer according to the question information (csv format) is <Student Answer Sheet>. 

Question number, type, question content, explanation, correct answer, A1, A2, A3
1,Express the number of points for answering x 2-point questions and (12-x) 3-point questions correctly. ,2x+3(12-x)=-x+36,36-x,1,0,0
2,Compute 2A-B when A=3x-5 and B=-2x+1,2*(3x-5)-(-2x+1)=6x-10+2x-1=8x-11,8x-11,0,1,0
3,Write two first order equations with x=2 as a solution,,2x-4=0 or x+3=5,0,0,1
4,Solve the first order equation 5x+13=3x-23. ,5x-3x=-23-13 and 2x=-36. Therefore, x=-18,-18,0,1,1}
5,A volleyball club wants to collect dues to buy volleyballs. Find the price of a volleyball if the club has a shortfall of 8,000 won and a surplus of 7,000 won. Let x be the number of club members. The expression for the price of a volleyball is 2000x+8000 won and 3000x-7000 won, so 2000x+8000 = 3000x-7000. Solving this first-order equation, we get 1000x = 15000, so there are x =15 club members. Therefore, the price of the volleyball is 2000*15+8000 = 38000 won. ,38000won,1,1,1
`



async function studentanswer() {
    var answer1 = document.getElementById('answer1').value;
    var answer2 = document.getElementById('answer2').value;
    var answer3 = document.getElementById('answer3').value;
    var answer4 = document.getElementById('answer4').value;
    var answer5 = document.getElementById('answer5').value;

    var every_answer = `문항1에 대한 답:${answer1}\n문항2에 대한 답:${answer2}\n문항3에 대한 답:${answer3}\n문항4에 대한 답:${answer4}\n문항5에 대한 답:${answer5}\n`;
    document.getElementById('studentanswer_all').innerText = every_answer;
}




function checkApiKey() {
    // API 키를 확인하는 코드를 여기에 작성
    var apiKey = document.getElementById('apiKey').value;
    if (apiKey) {
        alert("API key 확인 완료!")
    } else{
        alert("API key를 입력하세요!")
    } 
    console.log(apiKey);
    // 여기에 API 키 유효성 검사 로직을 추가할 수 있습니다.
    return apiKey
}

async function diagnosis_feedback() {
    // const apiKey = config.apiKey;
    apiKey = checkApiKey();
    console.log('diagnosis_feedback');

    var answer1 = document.getElementById('answer1').value;
    var answer2 = document.getElementById('answer2').value;
    var answer3 = document.getElementById('answer3').value;
    var answer4 = document.getElementById('answer4').value;
    var answer5 = document.getElementById('answer5').value;    
    var answeronly = `문항 1에 대한 답변:${answer1}\문항 2에 대한 답변:${answer2}\문항 3에 대한 답변:${answer3}\문항 4에 대한 답변:${answer4}\문항 5에 대한 답변:${answer5}\n`;
    // var answeronly = `Answer to question 1:${answer1}\nAnswer to question 2:${answer2}\nAnswer to question 3:${answer3}\nAnswer to question 4:${answer4}\nAnswer to question 5:${answer5}\n`;
    var final_prompt = `${prompt}\n<student answer>${answeronly}`


    try {
        const response = await fetch('https://api.openai.com/v1/engines/gpt-3.5-turbo-instruct/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                prompt : final_prompt,
                // messages:[{
                //     role:'user',
                //     content:'say this is a test!!!'}],
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
        document.getElementById('final_result').innerText = `GPT의 피드백 결과입니다. \n${responseData.choices[0].text}`;

        return responseData.choices[0].text; // Returning the specific text response
        

    }catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        return `Error fetching data: ${error.message}`; // Returning a more informative error message
    }
}
