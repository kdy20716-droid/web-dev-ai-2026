import streamlit as st
import requests

# 수정할 회원 id를 입력받아서 회원이 없을시 해당 id의 회원이 없습니다
# 있을시 st.session_state에 member['member_to_edit'] = response.json() 결과값 저장

# if member_to_edit in st.session_state: 사용해서
# member = st.session_state['member_to_edit'] 로 가져와서 수정 폼에 보여주기

# st.text_input() : 텍스트 입력창 생성


st.title("회원 수정")
member_id = st.number_input("회원 번호 입력", min_value=1, max_value=100, step=1)

if st.button("조회하기"):
    response = requests.get(f"http://127.0.0.1:8000/members/{member_id}")
    if response.status_code == 200:
        member_to_edit = response.json()
        st.session_state['member_to_edit'] = member_to_edit
        st.dataframe(member_to_edit)
    else:
        st.error("회원 정보를 찾을 수 없습니다.")

if 'member_to_edit' in st.session_state:
    member = st.session_state['member_to_edit']
    with st.form("회원 수정 폼"):
        name = st.text_input("이름", value=member['name'])
        address = st.text_input("주소", value=member['address'])
        email = st.text_input("이메일", value=member['email'])
        phone_number = st.text_input("전화번호", value=member['phone_number'])
        job = st.text_input("직업", value=member['job'])
        company = st.text_input("회사", value=member['company'])

        if st.form_submit_button("수정"):
            response = requests.put(f"http://127.0.0.1:8000/members/{member_id}", json={
                "name": name,
                "address": address,
                "email": email,
                "phone_number": phone_number,
                "job": job,
                "company": company
            })
            if response.status_code == 200:
                st.success("회원 정보가 수정되었습니다.")
            else:
                st.error("회원 정보 수정에 실패했습니다.")

