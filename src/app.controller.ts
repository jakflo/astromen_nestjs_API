import { Controller, Get } from '@nestjs/common';

@Controller()
export default class AppController {

    @Get('/')
    home() {
        return {todo: 'jednoho dne dokumentace'};
    }
}
