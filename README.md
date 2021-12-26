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

- Get List Category: Lấy danh sách catrgory

  - url: /course/categories
  - method: GET

  - result:
    - msg: <Thông báo>,
    - items:<Danh sách>,

- Get List Course: Lấy danh sách khóa học theo catrgory

  - url: /course?category=${category_id} - 0: Lấy tất cả
  - method: GET

  - result:
    - msg: <Thông báo>,
    - items:<Danh sách khóa học>,

- Get List Course Registered: Lấy danh sách khóa học đã đăng ký

  - url: /course/registered
  - method: GET
  - headers:

    - x_authorization: <token>,

  - result:
    - msg: <Thông báo>,
    - items:<Danh sách khóa học>,

- Get List Course Related: Lấy danh sách khóa học liên quan

  - url: /course/related
  - method: GET
  - headers:

    - x_authorization: <token>, // có hoặc không

  - result:
    - msg: <Thông báo>,
    - items:<Danh sách khóa học>,

- Register Course: Đăng ký khóa học

  - url: /course/register
  - method: POST
  - headers:

    - x_authorization: <token>,

  - params:

  - course_id: < ID khóa học >,

  - result:
    - msg: <Thông báo>,

- Unregister Course: Hủy đăng ký khóa học

  - url: /course/unregister
  - method: POST
  - headers:

    - x_authorization: <token>,

  - params:

    - course_id: < ID khóa học >,

  - result:
    - msg: <Thông báo>,

- Get Course Detail: Lấy chi tiết khóa học

  - url: /course/detail?course=< ID khóa học>
  - method: GET
  - headers:

    - x_authorization: <token>, // có hoặc không

  - result:
    - msg: <Thông báo>,
    - items:
      - id: < ID khóa học>,
      - cate_id: < ID category >,
      - title: < tiêu đề khóa học >,
      - short_title: < tiêu đề rút gọn >,
      - description: < mô tả >,
      - image: <>,
      - registed: < đã đăng ký: 1, chưa: 0 >,
      - num_register: < số người đăng ký >,
      - editor: < quyền chỉnh sửa: 1. không: 0 >,
      - teachers: < danh sách giáo viên >,
      - intro: < mở đầu >,
        - content: < nội dung >,
        - video: < > // chưa hỗ trợ
      - chapters: < danh sách chapter >,
        -title: < tiêu đề >,
        - content: < nội dung >,
        - videoL <>, // chưa hỗ trợ
      - comments: < danh sách bình luận >,
        - id: < >,
        - user_id: < >,
        - name: < >,
        - date: < dd/mm/YY >,
        - time: < hh:mm >,
        - content: < html >,

- Edit Course Detail: chỉnh sửa khóa học

  - url: /course/edit
  - method: POST
  - headers:

    - x_authorization: <token>,

  - params:

    - id: < ID khóa học >,
    - cate_id: < ID category >,
    - title: < tiêu đề khóa học >,
    - short_title: < tiêu đề rút gọn >,
    - description: < mô tả >,
    - image: <>, // chưa hỗ trợ
    - intro: < mở đầu >,
      - content: < nội dung >,
      - video: < > // chưa hỗ trợ
    - chapters: < danh sách chapter >,
      - title: < tiêu đề >,
      - content: < nội dung >,
      - videoL <>, // chưa hỗ trợ

  - result:
    - msg: <Thông báo>,
    - items:

- Create Course Detail: tạo khóa học

  - url: /course/create
  - method: POST
  - headers:

    - x_authorization: <token>,

  - params:

    - id: < ID khóa học>,
    - cate_id: < ID category >,
    - title: < tiêu đề khóa học >,
    - short_title: < tiêu đề rút gọn >,
    - description: < mô tả >,
    - image: <>, // chưa hỗ trợ
    - intro: < mở đầu >,
      - content: < nội dung >,
      - video: < > // chưa hỗ trợ
    - chapters: < danh sách chapter >,
      - title: < tiêu đề >,
      - content: < nội dung >,
      - videoL <>, // chưa hỗ trợ

  - result:
    - msg: <Thông báo>,
    - items:

- Comment Course Detail:comment khóa học

  - url: /course/detail/comment
  - method: POST
  - headers:

    - x_authorization: <token>,

  - params:

    - course_id: < ID khóa học >,
    - content: < Nội dung >

  - result:
    - msg: <Thông báo>

- Edit Comment Course Detail: chỉnh sửa comment khóa học

  - url: /course/detail/edit-comment
  - method: POST
  - headers:

    - x_authorization: <token>,

  - params:

    - course_id: < ID khóa học >,
    - id: < ID comment >,
    - content: < Nội dung >

  - result:
    - msg: <Thông báo>

- Delete Comment Course Detail: xóa comment khóa học

  - url: /course/detail/delete-comment
  - method: POST
  - headers:

    - x_authorization: <token>,

  - params:

    - course_id: < ID khóa học >,
    - id: < ID comment >,

  - result:
    - msg: <Thông báo>
