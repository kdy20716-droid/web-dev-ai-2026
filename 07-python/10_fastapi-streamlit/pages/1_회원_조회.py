import streamlit as st
import requests

st.title("회원 조회")
members_id = st.number_input("회원 번호 입력", min_value=1, max_value=100, step=1)

if st.button("조회하기"):
    response = requests.get(f"http://127.0.0.1:8000/members/{members_id}")
    if response.status_code == 200:
        member = response.json()
        st.dataframe(member)
    else:
        st.error("회원 정보를 찾을 수 없습니다.")
    

# members = response.json()
# st.dataframe(members)