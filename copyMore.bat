set MORE=../mootools-more/
set MPR=./

REM Class
cp %MORE%Source/Class/* %MPR%More/Class/ -f

cp %MORE%Docs/Class/* %MPR%More/Class/Docu/ -f

REM Core
cp %MORE%Source/Core/* %MPR%More/Core/ -f

cp %MORE%Docs/Core/* %MPR%More/Core/Docu/ -f

REM Drag
cp %MORE%Source/Drag/* %MPR%More/Drag/ -f

cp %MORE%Docs/Drag/* %MPR%More/Drag/Docu/ -f

REM Element
cp %MORE%Source/Element/* %MPR%More/Element/ -f

cp %MORE%Docs/Element/* %MPR%More/Element/Docu/ -f

REM Forms
cp %MORE%Source/Forms/* %MPR%More/Forms/ -f

cp %MORE%Docs/Forms/* %MPR%More/Forms/Docu/ -f

REM Fx
cp %MORE%Source/Fx/* %MPR%More/Fx/ -f

cp %MORE%Docs/Fx/* %MPR%More/Fx/Docu/ -f

REM Interface
cp %MORE%Source/Interface/* %MPR%More/Interface/ -f

cp %MORE%Docs/Interface/* %MPR%More/Interface/Docu/ -f

REM Native
cp %MORE%Source/Native/* %MPR%More/Native/ -f

cp %MORE%Docs/Native/* %MPR%More/Native/Docu/ -f

REM Request
cp %MORE%Source/Request/Request.JSONP.js %MPR%More/Request/Request.Jsonp.js -f
cp %MORE%Source/Request/Request.Periodical.js %MPR%More/Request/Request.Periodical.js -f
cp %MORE%Source/Request/Request.Queue.js %MPR%More/Request/Request.Queue.js -f

cp %MORE%Docs/Request/Request.JSONP.md %MPR%More/Request/Docu/Request.Jsonp.md -f
cp %MORE%Docs/Request/Request.Periodical.md %MPR%More/Request/Docu/Request.Periodical.md -f
cp %MORE%Docs/Request/Request.Queue.md %MPR%More/Request/Docu/Request.Queue.md -f

REM Utilities
cp %MORE%Source/Utilities/* %MPR%More/Utilities/ -f

cp %MORE%Docs/Utilities/* %MPR%More/Utilities/Docu/ -f