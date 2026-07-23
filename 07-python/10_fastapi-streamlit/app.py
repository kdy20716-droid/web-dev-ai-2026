"""
streamlit
- 파이썬 코드만으로 웹화면(버튼, 입력창, 표, 그래프 등)을 만들 수 있게 해주는 라이브러리
- HTML/CSS/JS를 몰라도 웹화면을 만들 수 있음

uv add streamlit 로 설치
실행은 streamlit run app.py (주의! FastAPI 호출시 서버가 켜져 있는 상태여야 하므로 
uvicorn main:app --reload 로 FastAPI 서버를 켠 상태에서 실행해야 함)
"""
import streamlit as st
import requests

st.title("회원 관리 대시보드")
response = requests.get("http://127.0.0.1:8000/members")
st.dataframe(response.json())

st.title("회원")
response = requests.get("http://127.0.0.1:8000/members")
members = response.json()["members"]
st.dataframe(members)

