import requests
from bs4 import BeautifulSoup
import time
import re
from fastapi import FastAPI, Query, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional

# --- Pydantic Models ---
class Book(BaseModel):
    rank: int = Field(..., description="베스트셀러 순위")
    title: str = Field(..., description="도서 제목")
    author: str = Field(..., description="저자")
    price: str = Field(..., description="판매가")
    sales_index: Optional[int] = Field(None, description="판매지수 (상세 페이지에서 수집)")
    detail_url: str = Field(..., description="도서 상세 정보 URL")

# --- FastAPI App ---
app = FastAPI(
    title="Yes24 Bestseller API",
    description="Yes24 종합 베스트셀러 목록을 크롤링하여 제공하는 API입니다.",
    version="1.0.0",
)

BASE_URL = "https://www.yes24.com"
BESTSELLER_URL = "/Product/Category/BestSeller"
HEADERS = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36"}

def get_sales_index(detail_url: str) -> Optional[int]:
    try:
        res = requests.get(detail_url, headers=HEADERS, timeout=10)
        res.raise_for_status()
        soup = BeautifulSoup(res.text, "html.parser")
        sell_num_tag = soup.select_one(".gd_sellNum")
        if not sell_num_tag:
            return None
        sell_text = sell_num_tag.get_text(strip=True)
        match = re.search(r"[\d,]+", sell_text)
        if match:
            return int(match.group(0).replace(",", ""))
        return None
    except Exception:
        return None

@app.get("/", summary="API 상태 확인")
def root():
    return {"message": "Yes24 Bestseller API is running!", "docs": "/docs"}

@app.get("/bestsellers", response_model=List[Book], summary="Yes24 베스트셀러 목록 조회")
def get_bestsellers(
    pages: int = Query(1, ge=1, le=5, description="수집할 페이지 수 (1~5)"),
    include_sales_index: bool = Query(False, description="판매지수 포함 여부")
):
    bestsellers = []
    current_rank = 1

    for page in range(1, pages + 1):
        list_url = f"{BASE_URL}{BESTSELLER_URL}?categoryNumber=001&pageNumber={page}"
        try:
            res = requests.get(list_url, headers=HEADERS, timeout=10)
            res.raise_for_status()
            soup = BeautifulSoup(res.text, "html.parser")

            book_items = soup.select("#yesBestList > li:not(.ad)")
            if not book_items:
                break

            for item in book_items:
                title_tag = item.select_one(".gd_name")
                author_tag = item.select_one(".auth_pub")
                price_tag = item.select_one(".yes_b") or item.select_one(".sale_prc") or item.select_one(".price")

                if not title_tag:
                    continue

                title = title_tag.text.strip()
                detail_path = title_tag.get("href", "")
                detail_url = f"{BASE_URL}{detail_path}"
                author = author_tag.text.strip().split("|")[0].strip() if author_tag else "저자 정보 없음"
                price = price_tag.text.strip() if price_tag else "가격 정보 없음"

                sales_index = None
                if include_sales_index:
                    sales_index = get_sales_index(detail_url)
                    time.sleep(0.5)

                bestsellers.append(Book(
                    rank=current_rank,
                    title=title,
                    author=author,
                    price=price,
                    sales_index=sales_index,
                    detail_url=detail_url
                ))
                current_rank += 1

        except requests.RequestException as e:
            raise HTTPException(status_code=503, detail=f"페이지 {page} 크롤링 실패: {str(e)}")

        if page < pages:
            time.sleep(1)

    if not bestsellers:
        raise HTTPException(status_code=404, detail="베스트셀러 데이터를 가져올 수 없습니다.")

    return bestsellers

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)