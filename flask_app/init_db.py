from db_config import get_db_connection

def init_tables():
    db = get_db_connection()
    cursor = db.cursor()

    # dramas 테이블 생성
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS dramas (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        is_secret BOOLEAN DEFAULT FALSE,
        password VARCHAR(100),
        filename VARCHAR(255),
        user_id INT,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    );
    """)

    # users 테이블 생성
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        password VARCHAR(100) NOT NULL,
        name VARCHAR(50) NOT NULL,
        school VARCHAR(100) NOT NULL,
        profile_image VARCHAR(200) NULL
    );
    """)

    db.commit()
    db.close()
    print("테이블 생성 완료")

if __name__ == "__main__":
    init_tables()
