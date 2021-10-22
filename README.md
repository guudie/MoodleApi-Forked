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

```
- Login: Api đăng nhập
    + url: /auth/login
    + method: POST
    + params: {
                email: <Địa chỉ enail>,
                password: <Mật khẩu>
            }

    + result: {
                msg: <Thông báo>,
                items: {
                    token: <Chỉ trả về token khi đăng nhập thành công>
                }
            }

- Register: Api đăng ký tài khoản
    + url: /auth/register
    + method: POST
    + params: {
                name: <Tên người dùng>,
                email: <Địa chỉ enail>,
                level: <Mặc định = 0 | (0: Student, 1: Teacher)>,
                user_id: <Mã số sinh viên (Đối với giáo viên là mã giáo viên)>,
                password: <Mật khẩu>,
            }

    + result: {
                msg: <Thông báo>,
                items: {
                    name: < >,
                    email: < >,
                    level: <>,
                    user_id: < >,
                    phone: "",
                    date_birth: "",
                    address: "",
                }
            }


```
