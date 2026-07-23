import streamlit as st
import requests

st.title("회원 삭제")
member_id = st.number_input("회원 번호 입력", min_value=1, max_value=100, step=1)

if st.button("삭제하기"):
    response = requests.delete(f"http://127.0.0.1:8000/members/{member_id}")
    if response.status_code == 200:
        st.success("회원이 삭제되었습니다.")
    else:
        st.error("회원 삭제에 실패했습니다.")
