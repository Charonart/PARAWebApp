@echo off
:: ==========================================
:: SCRIPT EXPORT SCHEMA & DATA TU DOCKER
:: Tránh lỗi Version Mismatch (v18 vs v17)
:: ==========================================

:: 1. Cấu hình thông số
SET CONTAINER_NAME=para_postgres_db
SET DB_NAME=para_db
SET DB_USER=root
SET EXPORT_DIR=D:\1._Project\PARA_Web\BE\DB

:: 2. Tạo thư mục chứa file export nếu chưa có
if not exist "%EXPORT_DIR%" mkdir "%EXPORT_DIR%"

echo [INFO] Dang bat dau qua trinh export...

:: 3. Export SCHEMA (Chi lay cau truc, khong lay du lieu)
:: Flag -s (--schema-only): Chi lay dinh nghia bang, index, enum...
docker exec -t %CONTAINER_NAME% pg_dump -U %DB_USER% -s %DB_NAME% > "%EXPORT_DIR%\schema.sql"

:: 4. Export DATA (Chi lay du lieu, khong lay cau truc)
:: Flag -a (--data-only): Chi lay cac cau lenh INSERT du lieu
docker exec -t %CONTAINER_NAME% pg_dump -U %DB_USER% -a %DB_NAME% > "%EXPORT_DIR%\data_dump.sql"

:: 5. Kiem tra ket qua
if %ERRORLEVEL% EQU 0 (
    echo ------------------------------------------
    echo [SUCCESS] Export hoan tat!
    echo [1] Cau truc: %EXPORT_DIR%\schema.sql
    echo [2] Du lieu : %EXPORT_DIR%\data_dump.sql
    echo ------------------------------------------
) else (
    echo [ERROR] Co loi xay ra. Vui long kiem tra Docker.
)

pause