import { Controller, Post, Body } from '@nestjs/common'

@Controller('/verification')
export class VerificationController {

    @Post('/login')
    doLogin(@Body() body: any): any {
        if (body.username == 'admin' && body.password == '111111') {
            return {
                code: '000000',
                msg: '登录成功'
            }
        } else {
            return {
                code: '999999',
                msg: '用户名或密码错误'
            }
        }

    }

}
