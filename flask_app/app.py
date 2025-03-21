from flask import Flask, request, jsonify  
# Flask 웹 프레임워크 및 요청/응답 처리 모듈 불러오기
from flask_cors import CORS  # CORS 지원을 위한 모듈 불러오기
# CORS : 프론트와 백이 다른 도메인에서 실행될 때도 원활히 데이터 주고받을 수 있게 함
from db_config import get_db_connection  # 데이터베이스 연결 함수 불러오기

app = Flask(__name__)  # Flask 애플리케이션 객체 생성
CORS(app, resources={r"/*": {"origins": "*"}})  
# 모든 출처에서 API를 호출할 수 있도록 CORS 설정

# 모든 드라마 가져오기 + 특정 드라마 가져오기
@app.route("/get-dramas", methods=["GET"])  # 모든 드라마를 가져오는 엔드포인트
@app.route("/get-drama/<int:drama_id>", methods=["GET"])  
# 특정 ID의 드라마를 가져오는 엔드포인트
def get_drama(drama_id=None):
    db = get_db_connection()  # 데이터베이스에 연결
    cursor = db.cursor()  # 커서 객체 생성

    if drama_id is None:  # drama_id가 None일 경우
        cursor.execute("SELECT * FROM dramas")  # 모든 드라마 정보 가져오기
        dramas = cursor.fetchall()  # 모든 드라마 데이터를 가져와 dramas 리스트에 저장
    else:
        cursor.execute("SELECT * FROM dramas WHERE id = %s", (drama_id,))  
        # 특정 드라마 ID에 해당하는 정보 가져오기
        dramas = cursor.fetchone()  # 조회된 하나의 드라마 데이터 가져오기

    db.close()  # 데이터베이스 연결 종료

    if not dramas:  # 드라마가 없을 경우
        return jsonify({"error": "드라마를 찾을 수 없습니다."}), 404  
        # 404 오류 메시지 반환

    return jsonify(dramas)  # 드라마 정보를 JSON 형식으로 반환

# 드라마 추가
@app.route("/add-drama", methods=["POST"])  # 드라마 추가 엔드포인트
def add_drama():
    data = request.json  # 요청의 JSON 데이터를 파싱
    title = data.get("title")  # 제목 정보 가져오기
    content = data.get("content")  # 내용 정보 가져오기

    if not title or not content:  # 제목이나 내용이 비어있을 경우
        return jsonify({"error": "제목과 내용을 입력하세요"}), 400  # 400 오류 반환

    db = get_db_connection()  # 데이터베이스에 연결
    cursor = db.cursor()  # 커서 객체 생성
    cursor.execute("INSERT INTO dramas (title, content) VALUES (%s, %s)", (title, content))  # 데이터베이스에 드라마 추가
    db.commit()  # 변경 사항 커밋
    new_id = cursor.lastrowid  # 새롭게 추가된 드라마의 ID 가져오기
    db.close()  # 데이터베이스 연결 종료

    return jsonify({"message": "드라마 추가 완료", "id": new_id}), 201  
    # 추가 완료 메시지 및 새 ID 반환

# 특정 드라마 삭제
@app.route("/delete-drama/<int:id>", methods=["DELETE"])  # 드라마 삭제 엔드포인트
def delete_drama(id):
    db = get_db_connection()  # 데이터베이스에 연결
    cursor = db.cursor()  # 커서 객체 생성

    cursor.execute("SELECT * FROM dramas WHERE id = %s", (id,))  
    # 해당 ID의 드라마 정보 가져오기
    drama = cursor.fetchone()  # 드라마 데이터 가져오기

    if not drama:  # 드라마가 없을 경우
        db.close()  # 데이터베이스 연결 종료
        return jsonify({"error": "해당 드라마를 찾을 수 없습니다."}), 404  # 404 오류 반환

    cursor.execute("DELETE FROM dramas WHERE id = %s", (id,))  # 드라마 삭제 쿼리 실행
    db.commit()  # 변경 사항 커밋
    db.close()  # 데이터베이스 연결 종료

    return jsonify({"message": "드라마 삭제 완료"}), 200  # 삭제 완료 메시지 반환

# edit-drama 엔드포인트를 위로 이동 (매우 중요)
@app.route("/edit-drama/<int:id>", methods=["PUT", "OPTIONS"])  # 드라마 수정 엔드포인트
def edit_drama(id):
    if request.method == "OPTIONS":  # OPTIONS 요청일 경우
        return jsonify({"message": "CORS preflight OK"}), 200  
        # CORS 문제 해결을 위한 응답

    data = request.json  # 요청의 JSON 데이터를 파싱
    new_title = data.get("title")  # 새 제목 정보 가져오기
    new_content = data.get("content")  # 새 내용 정보 가져오기

    if not new_title or not new_content:  # 제목이나 내용이 비어있을 경우
        return jsonify({"error": "제목과 내용을 입력하세요"}), 400  # 400 오류 반환

    db = get_db_connection()  # 데이터베이스에 연결
    cursor = db.cursor()  # 커서 객체 생성
    cursor.execute("SELECT * FROM dramas WHERE id = %s", (id,))  
    # 해당 ID의 드라마 정보 가져오기
    drama = cursor.fetchone()  # 드라마 데이터 가져오기

    if not drama:  # 드라마가 없을 경우
        db.close()  # 데이터베이스 연결 종료
        return jsonify({"error": "해당 드라마를 찾을 수 없습니다."}), 404  # 404 오류 반환

    cursor.execute("UPDATE dramas SET title = %s, content = %s WHERE id = %s", (new_title, new_content, id))  # 드라마 정보 수정
    db.commit()  # 변경 사항 커밋
    db.close()  # 데이터베이스 연결 종료

    return jsonify({"message": "드라마 수정 완료"}), 200  # 수정 완료 메시지 반환

if __name__ == "__main__":  # 스크립트가 직접 실행될 경우
    app.run(debug=True)  # 디버그 모드로 웹 애플리케이션 실행