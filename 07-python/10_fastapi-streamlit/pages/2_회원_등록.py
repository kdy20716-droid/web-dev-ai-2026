import streamlit as st
import requests

# st.form() : 여러 입력창을 하나로 묶어서 제출 버튼을 눌렀을 때 한 번에 처리할 수 있게 해주는 기능
# st.text_input() : 텍스트 입력창 생성
# st.form_submit_button() : 폼 제출 버튼 생성

st.title("회원 등록")
with st.form("회원 등록 폼"):
    name = st.text_input("이름")
    address = st.text_input("주소")
    email = st.text_input("이메일")
    phone_number = st.text_input("전화번호")
    job = st.text_input("직업")
    company = st.text_input("회사")

    if st.form_submit_button("등록"):
        response = requests.post("http://127.0.0.1:8000/members", json={
            "name": name,
            "address": address,
            "email": email,
            "phone_number": phone_number,
            "job": job,
            "company": company
        })
        if response.status_code == 200:
            st.success("회원이 등록되었습니다.")
        else:
            st.error("회원 등록에 실패했습니다.")
