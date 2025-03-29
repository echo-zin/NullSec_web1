from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
from db_config import get_db_connection
from werkzeug.utils import secure_filename
import re
import uuid


app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

def korean_secure_filename(filename):
    filename = filename.strip().replace(" ", "_")
    filename = re.sub(r"[^ㄱ-ㅎ가-힣a-zA-Za-z0-9_.-]", "", filename)
    return filename

UPLOAD_FOLDER = os.path.join(os.getcwd(), "uploads")
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# -------------------------------------------------
# 드라마 관련 엔드포인트
# -------------------------------------------------
@app.route("/get-dramas", methods=["GET"])
@app.route("/get-drama/<int:drama_id>", methods=["GET"])
def get_drama(drama_id=None):
    db = get_db_connection()
    cursor = db.cursor()
    if drama_id is None:
        cursor.execute("SELECT * FROM dramas")
        dramas = cursor.fetchall()
        db.close()
        return jsonify(dramas), 200
    else:
        cursor.execute("SELECT * FROM dramas WHERE id = %s", (drama_id,))
        drama = cursor.fetchone()
        db.close()
        if not drama:
            return jsonify({"error": "드라마를 찾을 수 없습니다."}), 404
        return jsonify(drama), 200

@app.route("/add-drama", methods=["POST"])
def add_drama():
    title = request.form.get("title")
    content = request.form.get("content")
    is_secret = request.form.get("is_secret") in ["true", "on"]
    password = request.form.get("password") or None
    user_id = request.form.get("user_id")
    try:
        user_id = int(user_id)  # user_id를 정수로 변환
    except (ValueError, TypeError):
        return jsonify({"error": "잘못된 사용자 ID입니다."}), 400


    if not title or not content:
        return jsonify({"error": "필수 항목이 누락되었습니다."}), 400

    if is_secret and not password:
        return jsonify({"error": "비밀글 비밀번호를 입력해주세요."}), 400

    uploaded_file = request.files.get("attachment")
    filename = None
    if uploaded_file and uploaded_file.filename:
        origin_name = korean_secure_filename(uploaded_file.filename)
        unique_id = uuid.uuid4().hex[:8]
        filename = f"{unique_id}_{origin_name}"
        upload_folder = "uploads"
        os.makedirs(upload_folder, exist_ok=True)
        uploaded_file.save(os.path.join(upload_folder, filename))

    db = get_db_connection()
    cursor = db.cursor()
    cursor.execute("""
        INSERT INTO dramas (title, content, is_secret, password, filename, user_id)
        VALUES (%s, %s, %s, %s, %s, %s)
    """, (title, content, is_secret, password, filename, user_id))
    db.commit()
    new_id = cursor.lastrowid
    db.close()
    return jsonify({"message": "드라마 등록 성공", "id": new_id})

@app.route("/delete-drama/<int:drama_id>", methods=["DELETE", "OPTIONS"])
def delete_drama(drama_id):
    if request.method == "OPTIONS":
        return jsonify({"message": "CORS OK"}), 200

    db = get_db_connection()
    cursor = db.cursor()
    try:
        cursor.execute("DELETE FROM dramas WHERE id = %s", (drama_id,))
        db.commit()
        db.close()
        return jsonify({"message": "드라마 삭제 성공"}), 200
    except Exception as e:
        db.rollback()
        db.close()
        return jsonify({"error": f"삭제 실패: {str(e)}"}), 500


@app.route("/edit-drama/<int:id>", methods=["POST"])
def edit_drama(id):
    title = request.form.get("title")
    content = request.form.get("content")
    is_secret = request.form.get("is_secret") in ["true", "on"]  # ✅ 체크박스 "on" 처리
    password = request.form.get("password") or None

    if not title or not content:
        return jsonify({"error": "제목과 내용을 입력하세요"}), 400

    if is_secret and not password:
        return jsonify({"error": "비밀글 비밀번호를 입력해주세요."}), 400

    uploaded_file = request.files.get("attachment")
    filename = None
    if uploaded_file and uploaded_file.filename:
        import uuid
        origin_name = korean_secure_filename(uploaded_file.filename)
        unique_id = uuid.uuid4().hex[:8]
        filename = f"{unique_id}_{origin_name}"
        upload_folder = "uploads"
        os.makedirs(upload_folder, exist_ok=True)
        uploaded_file.save(os.path.join(upload_folder, filename))

    db = get_db_connection()
    cursor = db.cursor()
    cursor.execute("SELECT * FROM dramas WHERE id = %s", (id,))
    drama = cursor.fetchone()
    if not drama:
        db.close()
        return jsonify({"error": "해당 드라마를 찾을 수 없습니다."}), 404

    cursor.execute("""
        UPDATE dramas
        SET title = %s, content = %s, is_secret = %s, password = %s, filename = IFNULL(%s, filename)
        WHERE id = %s
    """, (title, content, is_secret, password, filename, id))
    db.commit()
    db.close()
    return jsonify({"message": "드라마 수정 완료"}), 200

# -------------------------------------------------
# 사용자 관련 엔드포인트
# -------------------------------------------------
@app.route("/login", methods=["POST"])
def login():
    data = request.json
    username = data.get("id")
    password = data.get("password")
    if not username or not password:
        return jsonify({"error": "아이디와 비밀번호를 입력해주세요"}), 400
    db = get_db_connection()
    cursor = db.cursor()
    cursor.execute("SELECT * FROM users WHERE username = %s", (username,))
    user = cursor.fetchone()
    db.close()
    if user and user["password"] == password:
        return jsonify({"message": "로그인 성공", "user": user}), 200
    else:
        return jsonify({"error": "아이디 또는 비밀번호가 일치하지 않습니다"}), 401

@app.route("/signup", methods=["POST"])
def signup():
    username = request.form.get("username")
    password = request.form.get("password")
    name = request.form.get("name")
    school = request.form.get("school")
    file = request.files.get("profile_image")
    if not (username and password and name and school):
        return jsonify({"error": "모든 필드를 입력해주세요"}), 400
    profile_filename = None
    if file:
        upload_folder = "uploads"
        os.makedirs(upload_folder, exist_ok=True)
        profile_filename = file.filename  # 실제 서비스에서는 secure_filename() 권장
        file.save(os.path.join(upload_folder, profile_filename))
    db = get_db_connection()
    cursor = db.cursor()
    try:
        cursor.execute("""
            INSERT INTO users (username, password, name, school, profile_image)
            VALUES (%s, %s, %s, %s, %s)
        """, (username, password, name, school, profile_filename))
        db.commit()
        new_id = cursor.lastrowid
        db.close()
        return jsonify({"message": "회원가입 성공", "id": new_id}), 201
    except Exception as e:
        db.rollback()
        db.close()
        return jsonify({"error": f"회원가입 실패: {str(e)}"}), 400

# 사용자 정보 조회 (DB에서 최신 정보를 GET)
@app.route("/user/<int:user_id>", methods=["GET"])
def get_user(user_id):
    db = get_db_connection()
    cursor = db.cursor()
    cursor.execute("SELECT id, username, name, school, profile_image FROM users WHERE id = %s", (user_id,))
    user = cursor.fetchone()
    db.close()
    if user:
        return jsonify(user), 200
    else:
        return jsonify({"error": "사용자를 찾을 수 없습니다."}), 404

# 회원정보 수정 (파일 업로드 포함)
@app.route("/update-user/<int:user_id>", methods=["PUT", "POST"])
def update_user(user_id):
    name = request.form.get("name")
    school = request.form.get("school")
    file = request.files.get("profile_image")

    if not name or not school:
        return jsonify({"error": "이름과 학교는 필수입니다"}), 400

    profile_filename = None
    if file:
        upload_folder = "uploads"
        os.makedirs(upload_folder, exist_ok=True)
        profile_filename = file.filename
        file.save(os.path.join(upload_folder, profile_filename))

    db = get_db_connection()
    cursor = db.cursor()
    try:
        if profile_filename:
            cursor.execute("""
                UPDATE users
                SET name = %s, school = %s, profile_image = %s
                WHERE id = %s
            """, (name, school, profile_filename, user_id))
        else:
            cursor.execute("""
                UPDATE users
                SET name = %s, school = %s
                WHERE id = %s
            """, (name, school, user_id))
        db.commit()
        cursor.execute("SELECT * FROM users WHERE id = %s", (user_id,))
        updated_user = cursor.fetchone()
        db.close()
        return jsonify({"message": "수정 성공", "user": updated_user}), 200
    except Exception as e:
        db.rollback()
        db.close()
        return jsonify({"error": f"수정 실패: {str(e)}"}), 500

# 회원 탈퇴
@app.route("/delete-user/<int:user_id>", methods=["DELETE", "OPTIONS"])
def delete_user(user_id):
    if request.method == "OPTIONS":
        return jsonify({"message": "CORS preflight OK"}), 200
    db = get_db_connection()
    cursor = db.cursor()
    try:
        cursor.execute("DELETE FROM users WHERE id = %s", (user_id,))
        db.commit()
        db.close()
        return jsonify({"message": "회원탈퇴 성공"}), 200
    except Exception as e:
        db.rollback()
        db.close()
        return jsonify({"error": f"회원탈퇴 실패: {str(e)}"}), 500

# 업로드된 이미지 제공 (URL: /uploads/파일명)
@app.route("/uploads/<filename>")
def uploaded_file(filename):
    return send_from_directory(app.config["UPLOAD_FOLDER"], filename, as_attachment=True)

@app.route("/verify-password", methods=["POST"])
def verify_password():
    data = request.json
    drama_id = data.get("id")
    input_pw = data.get("password")

    db = get_db_connection()
    cursor = db.cursor()
    cursor.execute("SELECT password FROM dramas WHERE id = %s AND is_secret = TRUE", (drama_id,))
    row = cursor.fetchone()
    db.close()

    if not row:
        return jsonify({"error": "비밀글이 아니거나 존재하지 않습니다."}), 404

    if row["password"] == input_pw:
        return jsonify({"message": "비밀번호 확인 성공"}), 200
    else:
        return jsonify({"error": "비밀번호 불일치"}), 403

@app.route("/find-id", methods=["POST"])
def find_id():
    data = request.json
    name = data.get("name")
    school = data.get("school")
    db = get_db_connection()
    cursor = db.cursor()
    cursor.execute("SELECT username FROM users WHERE name = %s AND school = %s", (name, school))
    user = cursor.fetchone()
    db.close()
    if user:
        return jsonify({"username": user["username"]}), 200
    else:
        return jsonify({"error": "일치하는 사용자가 없습니다."}), 404

@app.route("/find-password", methods=["POST"])
def find_password():
    data = request.json
    username = data.get("username")
    name = data.get("name")
    db = get_db_connection()
    cursor = db.cursor()
    cursor.execute("SELECT password FROM users WHERE username = %s AND name = %s", (username, name))
    user = cursor.fetchone()
    db.close()
    if user:
        return jsonify({"password": user["password"]}), 200
    else:
        return jsonify({"error": "일치하는 사용자 정보가 없습니다."}), 404


if __name__ == "__main__":
    app.run(debug=True)