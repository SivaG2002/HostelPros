Set WshShell = CreateObject("WScript.Shell")
WshShell.Run chr(34) & "engine.bat" & Chr(34), 0
Set WshShell = Nothing
