

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
                    <div class="row mb-4">
                            <div class="col-md-6">
                                <p>[문제${index}] ${question['문항내용']}</p>
                            </div>
                            <div class="col-md-6">
                                <input type="text" id="answer${index}" class="form-control" placeholder="여기에 답을 입력하세요" />
                            </div>
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

prompt_en = `Give me feedback in Korean on the cognitive resources I lack so that I can solve more first-order equations based on my answers and Q-matrix. 
<Usages>
- Encourage students to write the solution if they don't know or don't write an answer.
- For reference, the Q matrix is a matrix with A1, A2, and A3 as columns and each question as a row, where 1 means that the question has this cognitive element and 0 means that it does not. A1, A2, and A3 mean expressing a situation in words, calculating a first-order expression, and solving a problem, respectively. My answer according to the question information (csv format) is <Student Answer Sheet>. 
<Question>
Question id, question content, explanation, correct answer, A1, A2, A3
1,Express the number of points for answering x 2-point questions and (12-x) 3-point questions correctly. ,2x+3(12-x)=-x+36,36-x,1,0,0
2,Compute 2A-B when A=3x-5 and B=-2x+1,2*(3x-5)-(-2x+1)=6x-10+2x-1=8x-11,8x-11,0,1,0
3,Write two first order equations with x=2 as a solution,,2x-4=0 or x+3=5,0,0,1
4,Solve the first order equation 5x+13=3x-23. ,5x-3x=-23-13 and 2x=-36. Therefore, x=-18,-18,0,1,1}
5,A volleyball club wants to collect dues to buy volleyballs. Find the price of a volleyball if the club has a shortfall of 8,000 won and a surplus of 7,000 won. Let x be the number of club members. The expression for the price of a volleyball is 2000x+8000 won and 3000x-7000 won, so 2000x+8000 = 3000x-7000. Solving this first-order equation, we get 1000x = 15000, so there are x =15 club members. Therefore, the price of the volleyball is 2000*15+8000 = 38000 won. ,38000won,1,1,1
`


prompt_1 = `다음 답안에 대해 교사 입장에서 수학학습에 대한 전반적인 피드백을 해줘. 답안과 Q행렬을 바탕으로 내가 일차방정식을 더 잘 이해할 수 있도록 내가 부족한 인지요소(상황을문자로표현하기, 일차식계산, 방정식의 해의 의미)를 알려주고 피드백해줘. 
예를 들어 문항 5번만 틀리면 실수를 한거고, 3,4,5번을 틀리면 해의 의미를 이해하지 못한거야.풀이가 없다면 풀이를 쓰도록 유도해줘.
<문항>
문항번호,문항내용,해설
1,2점짜리 문항 x개와 3점짜리 문항 (12-x)개의 정답을 맞혔을 때 점수를 식으로 나타내시오. ,2x+3(12-x)=-x+36, 
2,A=3x-5이고 B=-2x+1일 때 2A-B를 계산하시오.,2*(3x-5)-(-2x+1)=6x-10+2x-1=8x-11
3,x=2를 해로 갖는 일차방정식을 두개 쓰시오.,2x-4=0 혹은 x+3=5
4,일차방정식 5x+13=3x-23을 푸시오. ,5x-3x=-23-13이고 2x=-36이다. 따라서 x=-18
5,배구공을 사기 위해 회비를 2000원씩 걷으면 8000원이 부족하고 3000원씩 걷으면 7000원이 남는다고 할 때 배구공의 가격을 구하시오. ,동아리원 수를 x명이라고 하자. 배구공의 가격의 식은 2000x+8000원이고 3000x-7000원이므로 2000x+8000 = 3000x-7000이다. 이 일차방정식을 풀면 1000x = 15000이므로 x =15 동아리원은 15명이 있다. 따라서 배구공의 가격은 2000*15+8000 = 38000원이다.
<Q행렬>
[[1,0,0],[0,1,0],[0,0,1],[0,1,1],[1,1,1]] 열은 '상황을문자로표현하기', '일차식계산', '방정식의해'이고 행을 다섯개의 문항을 의미해. 1은 인지요소가 있다는 뜻, 0은 없다는 뜻
`

prompt = `저는 중학교 1학년 학생이고 당신은 나의 답안을 평가하는 수학선생님입니다. 아래 과정에 따라 제 답안을 평가하고 부족한 인지요소를 말해줘. 답안과 Q행렬을 바탕으로 제가 수학을 더 잘할 수 있도록 도와주세요.
<문항정보>
문항번호,문항내용,해설
1번문제,2점짜리 문항 x개와 3점짜리 문항 (12-x)개의 정답을 맞혔을 때 점수를 식으로 나타내시오. ,2x+3(12-x)=-x+36
2번문제,A=3x-5이고 B=-2x+1일 때 2A-B를 계산하시오.,2*(3x-5)-(-2x+1)=6x-10+2x-1=8x-11
3번문제,x=2를 해로 갖는 일차방정식을 두개 쓰시오.,2x-4=0 혹은 x+3=5
4번문제,일차방정식 5x+13=3x-23을 푸시오. ,5x-3x=-23-13이고 2x=-36이다. 따라서 x=-18
5번문제,배구공을 사기 위해 회비를 2000원씩 걷으면 8000원이 부족하고 3000원씩 걷으면 7000원이 남는다고 할 때 배구공의 가격을 구하시오. ,동아리원 수를 x명이라고 하자. 배구공의 가격의 식은 2000x+8000원이고 3000x-7000원이므로 2000x+8000 = 3000x-7000이다. 이 일차방정식을 풀면 1000x = 15000이므로 x =15 동아리원은 15명이 있다. 따라서 배구공의 가격은 2000*15+8000 = 38000원이다.
<Q행렬-문항에 따른 인지요소>
문항번호,인지요소(문자로 표현하기),인지요소(일차식계산),인지요소(방정식의해)
1번문제,1,0,0
2번문제,0,1,0
3번문제,0,0,1
4번문제,0,1,1
5번문제,1,1,1
<유의사항>
- 
- 내가 모르겠다고 하거나 답안을 안 쓸 경우 도움을 줘서 풀이를 쓰도록 유도할 것
- 참고로 Q행렬은 열을 각각 A1, A2, A3, 행을 각 문항으로 하는 행렬로, 1은 해당 문항에 이 인지요소가 있다는 뜻이고 0은 없다는 뜻이야. <문항>에 따른 나의 답안이 <학생답안> 이야. 
<부족한 인지요소>를 말해주고 조언해주세요.`


guide_eval = `저는 중학교 1학년 학생이고 당신은 나의 답안을 평가하는 수학선생님입니다. 세 개의 인지요소(문자의 식 표현, 일차식 계산, 방정식의 해)를 학생이 갖고 있는지 1,0으로 판단해주세요. 
<문항정보>
문항번호,문항내용,모범답안
1번문제,2점짜리 문항 x개와 3점짜리 문항 (12-x)개의 정답을 맞혔을 때 점수를 식으로 나타내시오. ,2x+3(12-x)=-x+36
2번문제,A=3x-5이고 B=-2x+1일 때 2A-B를 계산하시오.,2*(3x-5)-(-2x+1)=6x-10+2x-1=8x-11
3번문제,x=2를 해로 갖는 일차방정식을 두개 쓰시오.,2x-4=0 혹은 x+3=5
4번문제,일차방정식 5x+13=3x-23을 푸시오. ,5x-3x=-23-13이고 2x=-36이다. 따라서 x=-18
5번문제,배구공을 사기 위해 회비를 2000원씩 걷으면 8000원이 부족하고 3000원씩 걷으면 7000원이 남는다고 할 때 배구공의 가격을 구하시오. ,동아리원 수를 x명이라고 하자. 배구공의 가격의 식은 2000x+8000원이고 3000x-7000원이므로 2000x+8000 = 3000x-7000이다. 이 일차방정식을 풀면 1000x = 15000이므로 x =15 동아리원은 15명이 있다. 따라서 배구공의 가격은 2000*15+8000 = 38000원이다.
<Q행렬>
문항번호,인지요소(문자로 표현하기),인지요소(일차식계산),인지요소(방정식의해)
1번문제,1,0,0
2번문제,0,1,0
3번문제,0,0,1
4번문제,0,1,1
5번문제,1,1,1
<학생 예시 답안>
답안1:2x+3(12-x)=2x+36-3x=-x+36
답안2:2*(3x-5)-(-2x+1) =6x-10+2x-1= 8x-11
답안3:x-2=0, -2x+4=0
답안4:5x-3x=-23-13이므로 2x=-36,  x=-18
답안5:2000x+8000 과 3000x-7000 이 같아야 하므로 일차방정식 2000x+8000=3000x-7000을 풀면 x=15가 나온다. 구하는 값은 배구공의 가격이므로 2000x+8000에 대입하면 38000원이 나온다.
<학생 예시 답안 진단 결과>
문자로 표현하기:1
일차식계산:1
방정식의해:1
`

guide_feedback = `당신은 수학선생님입니다. 일차방정식에 대한 학생의 답안을 보고 학생의 수학 학습을 위한 따뜻한 조언을 해주세요. 피드백만으로 제가 이해할 수 있도록 소크라테스의 산파법으로 알려주세요.
<문항정보>
문항번호,문항내용,모범답안
1번문제,2점짜리 문항 x개와 3점짜리 문항 (12-x)개의 정답을 맞혔을 때 점수를 식으로 나타내시오. ,2x+3(12-x)=-x+36
2번문제,A=3x-5이고 B=-2x+1일 때 2A-B를 계산하시오.,2*(3x-5)-(-2x+1)=6x-10+2x-1=8x-11
3번문제,x=2를 해로 갖는 일차방정식을 두개 쓰시오.,2x-4=0 혹은 x+3=5
4번문제,일차방정식 5x+13=3x-23을 푸시오. ,5x-3x=-23-13이고 2x=-36이다. 따라서 x=-18
5번문제,배구공을 사기 위해 회비를 2000원씩 걷으면 8000원이 부족하고 3000원씩 걷으면 7000원이 남는다고 할 때 배구공의 가격을 구하시오. ,동아리원 수를 x명이라고 하자. 배구공의 가격의 식은 2000x+8000원이고 3000x-7000원이므로 2000x+8000 = 3000x-7000이다. 이 일차방정식을 풀면 1000x = 15000이므로 x =15 동아리원은 15명이 있다. 따라서 배구공의 가격은 2000*15+8000 = 38000원이다.
<Q행렬>
문항번호,인지요소(문자로 표현하기),인지요소(일차식계산),인지요소(방정식의해)
1번문제,1,0,0
2번문제,0,1,0
3번문제,0,0,1
4번문제,0,1,1
5번문제,1,1,1`




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


async function diagnosis_f() {
    // const apiKey = config.apiKey;
    apiKey = checkApiKey();
    console.log('diagnosis');

    var answer1 = document.getElementById('answer1').value;
    var answer2 = document.getElementById('answer2').value;
    var answer3 = document.getElementById('answer3').value;
    var answer4 = document.getElementById('answer4').value;
    var answer5 = document.getElementById('answer5').value;    
    var answeronly = `문항 1에 대한 답변:${answer1}\문항 2에 대한 답변:${answer2}\문항 3에 대한 답변:${answer3}\문항 4에 대한 답변:${answer4}\문항 5에 대한 답변:${answer5}\n`;
    var eval_prompt = `${guide_eval}\n<저의 답안>${answeronly}<내 답안 진단 결과>`

    const response = await fetch('https://api.openai.com/v1/engines/gpt-3.5-turbo-instruct/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            prompt : eval_prompt,
            max_tokens: 500,
            temperature: 0.1
        })
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    };

    const responseData = await response.json();
    const diagnosis = responseData.choices[0].text;
    document.getElementById('diagnosis_result').innerText = `GPT의 진단 결과입니다. \n${responseData.choices[0].text}`;

    console.log(eval_prompt);
    console.log(diagnosis);
    return diagnosis; // Returning the specific text response
}



async function feedback_f() {

    apiKey = checkApiKey();
    console.log('feedback');

    var answer1 = document.getElementById('answer1').value;
    var answer2 = document.getElementById('answer2').value;
    var answer3 = document.getElementById('answer3').value;
    var answer4 = document.getElementById('answer4').value;
    var answer5 = document.getElementById('answer5').value;    
    var answeronly = `문항 1에 대한 답변:${answer1}\문항 2에 대한 답변:${answer2}\문항 3에 대한 답변:${answer3}\문항 4에 대한 답변:${answer4}\문항 5에 대한 답변:${answer5}\n`;


    var diagnosis_gpt = await diagnosis_f();
    // var diagnosis_gpt = document.getElementById('diagnosis_result').value;    
    console.log(diagnosis_gpt);



    var feedback_prompt = `${guide_feedback}\n<저의 답안>${answeronly}\n<저의 답안 진단 결과>${diagnosis_gpt}`;

    const response = await fetch('https://api.openai.com/v1/engines/gpt-3.5-turbo-instruct/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            prompt : feedback_prompt,
            max_tokens: 1200,
            temperature: 0.8
        })
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    };

    const responseData = await response.json();
    const feedback_result = responseData.choices[0].text;
    console.log(feedback_prompt); // Debugging: Log the entire response
    console.log(feedback_result); // Debugging: Log the entire response
    document.getElementById('feedback_result').innerText = `GPT의 피드백 결과입니다. \n${feedback_result}`;

    return feedback_result; // Returning the specific text response
     
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
        // const response = await fetch('https://api.openai.com/v1/engines/davinchi-002/completions',{
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
                max_tokens: 1200,
                temperature: 0.1
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
