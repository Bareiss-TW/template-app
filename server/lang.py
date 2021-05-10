
from corelib.lang.lang_tool import load_json_lang_from_json

class Lang(object):
    def __init__(self) -> None:
        self.lang_data = None
        self.lang_flag = 'en'
        self.lang_folder = ''
    
    def setLangFolder(self, folder):
        self.lang_folder = folder

    def setLang(self, langFlag='en'):
        self.lang_flag = langFlag
        self.lang_data = load_json_lang_from_json(self.lang_folder, langFlag)
        return self.lang_data
    
    def getTranslatedText(self, textKey):
        try:
            return self.lang_data[textKey]
        except:
            return textKey

langObject = Lang()