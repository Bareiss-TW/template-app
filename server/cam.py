'''
A simple Program for grabing video from basler camera and converting it to opencv img.
Tested on Basler acA1300-200uc (USB3, linux 64bit , python 3.5)

'''
import cv2, time

class Camera():
    def __init__(self):
        self.camera = None
        self.img =None
        self.openCamera = False
        self.FPS = 1/30
        self.FPS_MS = int(self.FPS * 1000)
        
    def config(self):
        pass

    def start(self):
        self.camera = cv2.VideoCapture(0)
    
    def snap(self):
        self.start()
        ret, self.img = self.camera.read()
        self.close()
        return self.img

    def get_current_image(self, callback=None, stopCallback=None):
        counts = 0
        while(True):
            # 從攝影機擷取一張影像
            # startT = time.time()
            ret, self.img = self.camera.read()
            cv2.putText(self.img, str(counts), (10, 40), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 255), 1, cv2.LINE_AA)
            counts += 1
            # print(f"acquire time: {time.time() - startT}")
            if callback:
                callback(self.img)

            # 顯示圖片
            cv2.imshow('frame', self.img)

            # 若按下 q 鍵則離開迴圈
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break
            if stopCallback:
                if stopCallback():
                    break

        return self.img

    def close(self):
        # 釋放攝影機
        self.camera.release()
        # 關閉所有 OpenCV 視窗
        cv2.destroyAllWindows()


if __name__=='__main__':
    cam = Camera()
    cam.start()
    cam.get_current_image()
    cam.close()