// 
const express = require('express');
// 객체를 만들기
const app = express();

app.listen(8080, function(){
    console.log('포트 8080에서 실행중입니다....')

});

app.get('/aied/home', function(요청, 응답){
    응답.sendFile(__dirname+"/index.html")
})

app.get('/aied/math', function(요청, 응답){
    응답.sendFile(__dirname+"/math.html")
})

app.get('/aied/XR', function(요청, 응답){
    응답.sendFile(__dirname+"/XR.html")
})

// 누군가가 /eda로 방문을 하면 관련 안내문을 띄워주자
app.get('/aied/EDA', function(요청, 응답){
    응답.sendFile(__dirname+"/EDA.html")
})

