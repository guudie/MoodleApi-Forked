# HTTP Code

- 200: Yêu cầu được tiếp nhận và xử lý hành công
- 400: Yêu cầu từ client không hợp lệ
- 500: Yêu cầu từ client hợp lệ, nhưng server xử xử lý không thành công

# File construction

- routes: chuyển hướng xử lý
- controllers: xử lý yêu cầu từ client
- collections: truy vấn đến collection của database
- validations: kiểm tra thông tin từ client gửi lên
- modules: các tính năng dùng chung

# Document

\*Note : Tất cả giá trị ở request và response đều dạng string

- Login: Api đăng nhập

  - url: /auth/login
  - method: POST
  - params:

    - email: <Địa chỉ enail>,
    - password: <Mật khẩu>

  - result:
    - msg: <Thông báo>,
    - items:
      - token: <Chỉ trả về token khi đăng nhập thành công>

- Register: Api đăng ký tài khoản

  - url: /auth/register
  - method: POST
  - params:

    - name: <Tên người dùng>,
    - email: <Địa chỉ enail>,
    - level: <Mặc định = 0 | (0: Student, 1: Teacher)>,
    - password: <Mật khẩu>,

  - result:
    - msg: <Thông báo>,
    - items:
      - name: < >,
      - email: < >,
      - level: < >,
      - phone: "",
      - date_birth: "",
      - address: "",

- Get Profile: Lấy thông tin profile

  - url: /user/profile
  - method: GET
  - headers:

    - x_authorization: <token>,

  - result:
    - msg: <Thông báo>,
    - items:
      - name: ,
      - email: < >,
      - level: < >,
      - phone: < >,
      - date_birth: < >,
      - address: < >,

- Edit Profile: Sửa thông tin profile

  - url: /user/edit
  - method: POST
  - headers:

    - x_authorization: <token>,

  - params:

    - name: < >,
    - phone: < >,
    - date_birth: < >,
    - address: < >,

  - result:
    - msg: <Thông báo>,
    - items:
      - name: < >,
      - email: < >,
      - level: < >,
      - phone: < >,
      - date_birth: < >,
      - address: < >,

- Change Password: Đổi password

  - url: /user/changePassword
  - method: POST
  - headers:

    - x_authorization: <token>,

  - params:

    - old_password: < >,
    - new_password: < >,

  - result:
    - msg: <Thông báo>,
    - items:
      - status: "1", - Thành công

- OTP: Lấy OTP

  - url: /user/otp
  - method: GET
  - headers:

    - x_authorization: <token>,

  - result:
    - msg: <Thông báo>,
    - items:
      - status: "1", - Thành công

- Change Email: Đổi Email

  - url: /user/changeEmail
  - method: POST
  - headers:

    - x_authorization: <token>,

  - params:

    - otp: < >,
    - new_email: < >,

  - result:
    - msg: <Thông báo>,
    - items:
      - email: < email mới >,

- Get List Course: Lấy danh sách khóa học

  - url: /course?category=${category_id} - 0: Lấy tất cả
  - method: GET
  - headers:

    - x_authorization: <token>,

  - result:
    - msg: <Thông báo>,
    - items:<Danh sách khóa học>,
