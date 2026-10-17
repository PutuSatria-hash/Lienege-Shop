Set fso = CreateObject("Scripting.FileSystemObject")
scriptDir = fso.GetParentFolderName(WScript.ScriptFullName)
projectDir = fso.GetParentFolderName(scriptDir)

Set WshShell = CreateObject("WScript.Shell")
WshShell.CurrentDirectory = projectDir
WshShell.Run "node server/local_db.js", 0, False
