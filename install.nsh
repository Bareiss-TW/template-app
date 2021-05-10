!macro customInit
  CreateDirectory $EXEDIR\Prerequisites
  SetOutPath $EXEDIR\Prerequisites

  File "${PROJECT_DIR}\Prerequisites\postgresql-12.5-1-windows-x64.exe"
  File "${PROJECT_DIR}\Prerequisites\insertDefault.exe"

  MessageBox MB_YESNO "Install Postgres Database?" IDYES true IDNO false
  true:
    ExpandEnvStrings $0 %COMSPEC%
    ExecWait '"$0" /C "$EXEDIR\Prerequisites\postgresql-12.5-1-windows-x64.exe" --mode unattended --unattendedmodeui minimal --disable-components stackbuilder --superaccount BareissAdmin  --superpassword BaAdmin --servicename bareiss --servicepassword BaAdmin --serverport 5432'
    Goto next
  false:
    DetailPrint "Skip Postgres Installation!"
  next:
    
  
  MessageBox MB_YESNO|MB_ICONQUESTION "Do you want to execute clean installation for databse?" IDYES label_yes IDNO label_no 
  label_yes:
    MessageBox MB_YESNO|MB_ICONEXCLAMATION "Are you sure to DROP all tables? (NOTE! ALL DATA will be erased!)" IDYES label_clean IDNO label_basic 
    label_clean:
      ExpandEnvStrings $0 %COMSPEC%
      ExecWait '"$0" /C "$EXEDIR\Prerequisites\insertDefault.exe" --clean'
      DetailPrint "Dropped all tables!"
      Goto next1
    label_basic:
      ExpandEnvStrings $0 %COMSPEC%
      ExecWait '"$0" /C "$EXEDIR\Prerequisites\insertDefault.exe"'
      Goto next1
  label_no:
      ExpandEnvStrings $0 %COMSPEC%
      ExecWait '"$0" /C "$EXEDIR\Prerequisites\insertDefault.exe"'
  next1:
  ExpandEnvStrings $0 %COMSPEC%
  ExecWait '"$0" /C "setx GH_TOKEN 9de363c6c23bd12a9ce5efbc9c76489b2187243c'
  
  RMDir /r "$EXEDIR\Prerequisites"

!macroend