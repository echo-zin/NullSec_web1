import pymysql

def get_db_connection():
    
    # 데이터베이스 연결을 위한 함수
    # 이 함수는 pymysql을 사용하여 MariaDB에 연결하는 객체를 반환함
    # 데이터베이스와의 연결을 관리하는 객체를 반환하며, 
    # 반환된 연결 객체는 데이터베이스 쿼리를 실행하고, 결과를 받아오는 데 사용됨
    
    return pymysql.connect(
    # MariaDB에 연결 설정, 함수 인자에 따라 데이터베이스 서버에 접속하여 연결을 시작
    # 연결을 설정하면 연결 객체를 반환하며, 이 객체는 데이터베이스와의 통신에 사용됨
    
        host="localhost",     # 데이터베이스 서버의 호스트 주소, 로컬에서 연결
        user="root",          # MariaDB에 로그인할 사용자 이름
        password="111400",    # 사용자 비밀번호
        database="drama_db",  # 연결할 데이터베이스 이름, 드라마 관련 데이터 저장소
        charset="utf8mb4",    # 데이터베이스에서 사용할 문자 집합 설정
        cursorclass=pymysql.cursors.DictCursor  
        # 반환된 SQL 쿼리 결과를 딕셔너리 형태로 받기 위한 설정
        # 각 행이 컬럼 이름을 키로 하는 딕셔너리로 반환
        # 예) SQL 쿼리 결과가 [(1, "Drama1"), (2, "Drama2")]와 같은 튜플 목록이라면
        # [{'id': 1, 'title': 'Drama1'}, {'id': 2, 'title': 'Drama2'}]
        # 같은 딕셔너리로 반환됨
    )