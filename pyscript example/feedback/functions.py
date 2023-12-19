import streamlit as st
import pandas as pd
import openai
from prompt import *
import re

@st.cache_data
def generate_df(item, answer, assess, feedback, conf, sat):
    data = {
        "Item": item,
        "Answer" : answer,
        "Assess" : assess,
        "Feedback" : feedback,
        "Conf" : conf,
        "Sat" : sat
    }
    df = pd.DataFrame(data)
    return df

@st.cache_resource
def process_string(text):
    text = text.strip()
    text = text.replace(",","cc")
    return text

@st.cache_resource
def generate_fb_1(response):
    response = "[학생Z 답안]\n" + response + "\n\n[학생Z 답안 평가]"    
    assess =openai.ChatCompletion.create(model="gpt-3.5-turbo-0613", messages=[{"role": "system", "content": prompt1_assess}, {"role": "user", "content": response}])
    assess = assess.choices[0].message.content
    response = response + "\n" + assess + "\n\n[학생Z 피드백]"
    fb = openai.ChatCompletion.create(model="gpt-3.5-turbo-0613", messages=[{"role": "system", "content": prompt1_feedback}, {"role": "user", "content": response}])
    fb = fb.choices[0].message.content
    return assess, fb

@st.cache_resource
def generate_fb_2(response):
    response = "[학생Z 답안]\n" + response + "\n\n[학생Z 답안 평가]"    
    assess =openai.ChatCompletion.create(model="gpt-3.5-turbo-0613", messages=[{"role": "system", "content": prompt2_assess}, {"role": "user", "content": response}])
    assess = assess.choices[0].message.content
    response = response + "\n" + assess + "\n\n[학생Z 피드백]"
    fb = openai.ChatCompletion.create(model="gpt-3.5-turbo-0613", messages=[{"role": "system", "content": prompt2_feedback}, {"role": "user", "content": response}])
    fb = fb.choices[0].message.content
    return assess, fb

@st.cache_resource
def generate_fb_3(response):
    response = "[학생Z 답안]\n" + response + "\n\n[학생Z 답안 평가]"    
    assess =openai.ChatCompletion.create(model="gpt-3.5-turbo-0613", messages=[{"role": "system", "content": prompt3_assess}, {"role": "user", "content": response}])
    assess = assess.choices[0].message.content
    response = response + "\n" + assess + "\n\n[학생Z 피드백]"
    fb = openai.ChatCompletion.create(model="gpt-3.5-turbo-0613", messages=[{"role": "system", "content": prompt3_feedback}, {"role": "user", "content": response}])
    fb = fb.choices[0].message.content
    return assess, fb

@st.cache_resource
def code_print(x):
    return re.sub(r"([_*])", r"\\\1", x)
