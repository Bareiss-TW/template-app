from __future__ import print_function


class Logic(object):
    def __init__(self, sendMsgFunc, loop):
        self.sendMsg = sendMsgFunc
        self.loop = loop

    async def cmd_wrap(self, websocket, cmd, data):
        print(f"cmd: {cmd}")
        print(f"data: {data}")
        if cmd == 'pong':
            pass
        elif cmd == 'isInited':
            await self.sendMsg(websocket, 'reply_init_ok')
        elif cmd == 'load_sys_config':
            await self.sendMsg(websocket, 'reply_load_sys_config')
        elif cmd == 'Hello':
            await self.sendMsg(websocket, 'reply_Hello', 'From Server OK')
        else:
            pass
    
