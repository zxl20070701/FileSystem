import { Controller, Get, Post, Query, UploadedFile, UseInterceptors, Body } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { DistService } from './dist.service'

const devby = require('devby')
const { join } = require('path')

declare type resultType = {
    code: string
    msg: string
}

@Controller('/handler')
export class HandlerController {
    constructor(private readonly distService: DistService) { }

    // 查询列表
    @Get('/queryAll')
    queryAll(@Query() query: {
        path: string
    }): any {
        return {
            code: '000000',
            filelist: this.distService.getFileList(query.path)
        }
    }

    // 上传文件
    @Post('/upload')
    @UseInterceptors(FileInterceptor('file'))
    upload(@UploadedFile() file, @Body() body: any) {

        let targetPath = join(__dirname, '../../client/userspace', body.path, decodeURIComponent(body.filepath))
        this.distService.writeFileSync(targetPath, file.buffer)

        devby.warn(new Date().toLocaleString() + " 文件上传: ./" + join(body.path, decodeURIComponent(body.filepath)))
        return {
            code: '000000',
            msg: "上传成功"
        }
    }

    // 粘贴文件
    @Get('/paste')
    paste(@Query() query: {
        sourcePath: string
        targetPath: string
        sourceName: string
        type: string
    }): any {

        if (query.type == 'copy') {
            devby.copySync(
                join(__dirname, '../../client/userspace', query.sourcePath, query.sourceName),
                join(__dirname, '../../client/userspace', query.targetPath, query.sourceName)
            )
        } else {
            devby.moveSync(
                join(__dirname, '../../client/userspace', query.sourcePath, query.sourceName),
                join(__dirname, '../../client/userspace', query.targetPath, query.sourceName)
            )
        }

        return {
            code: '000000',
            msg: "粘贴成功"
        }
    }

    // 压缩文件夹
    @Get('/zip')
    async zip(@Query() query: {
        sourcePath: string
        sourceName: string
    }): Promise<resultType> {

        await this.distService.zipFolderSync(join(__dirname, '../../client/userspace', query.sourcePath, query.sourceName))

        return {
            code: '000000',
            msg: `已将${query.sourceName}压缩为${query.sourceName}.zip`
        }
    }

    // 解压文件
    @Get('/unzip')
    async unzip(@Query() query: {
        sourcePath: string
        sourceName: string
    }): Promise<resultType> {

        await this.distService.unzipSync(join(__dirname, '../../client/userspace', query.sourcePath, query.sourceName))

        return {
            code: '000000',
            msg: `${query.sourceName}已解压成功`
        }
    }

    // 删除文件
    @Get('/deleteFile')
    deleteFile(@Query() query: {
        fullPath: string
    }): any {

        devby.deleteSync(join(__dirname, '../../client/userspace', query.fullPath))

        return {
            code: '000000',
            msg: `${query.fullPath}已删除成功`
        }
    }
}
