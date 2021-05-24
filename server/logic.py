from __future__ import print_function

from threading import Thread
import asyncio, traceback
import cv2
import base64, time
from cam import Camera


class Logic(object):
    def __init__(self, sendMsgFunc, loop):
        self.sendMsg = sendMsgFunc
        self.cam = Camera()
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
        elif cmd == 'grab':
            t = Thread(target=self.grab, args=[websocket, ])
            t.start()
        elif cmd == 'snap':
            t = Thread(target=self.snap, args=[websocket,])
            t.start()
        elif cmd == 'grabStop':
            self.stop_grab()
        else:
            pass
    
    def encode_image(self, image):
        encode_param=[int(cv2.IMWRITE_JPEG_QUALITY),90]
        result, imgencode = cv2.imencode('.jpg', image, encode_param)
        encoded_string = base64.b64encode(imgencode).decode()
        return encoded_string

    def snap(self, websocket):
        try:
            self.stop = False
            image = self.cam.snap()
            encoded_string = self.encode_image(image)
            future = asyncio.run_coroutine_threadsafe(self.sendMsg(websocket,'reply_image',{'image':encoded_string}), self.loop)
            future.result()
        except:
            err_msg = traceback.format_exc()
            future = asyncio.run_coroutine_threadsafe(self.sendMsg(websocket,'reply_get_image_error',{'error':err_msg}), self.loop)
            future.result()
        finally:
            self.stop = True

    def grab(self, websocket):
        try:
            self.stop = False
            self.cam.start()
            image = None
            self.count = 0
            def callback(image):
                # startT = time.time()
                base64_image = self.encode_image(image)
                # print(f"encode time: {time.time() - startT}")
                future = asyncio.run_coroutine_threadsafe(self.sendMsg(websocket,'reply_image',{'image':base64_image, 'count': self.count}), self.loop)
                self.count += 1
                future.result()
            def isStop():
                return self.stop
            self.cam.get_current_image(callback, isStop)
            self.cam.close()
        except:
            err_msg = traceback.format_exc()
            asyncio.run_coroutine_threadsafe(self.sendMsg(websocket,'reply_get_image_error',{'error':err_msg}), self.loop)
        finally:
            self.stop = True

    def stop_grab(self):
        self.stop = True
    
