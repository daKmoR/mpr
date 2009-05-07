set CORE=../mootools-core/
set MPR=./

REM Class
cp %CORE%Source/Class/* %MPR%Core/Class/ -f

cp %CORE%Docs/Class/* %MPR%Core/Class/Docu/ -f

REM Core
cp %CORE%Source/Core/* %MPR%Core/Core/ -f

cp %CORE%Docs/Core/* %MPR%Core/Core/Docu/ -f

REM Element
cp %CORE%Source/Element/* %MPR%Core/Element/ -f

cp %CORE%Docs/Element/* %MPR%Core/Element/Docu/ -f

REM Fx
cp %CORE%Source/Fx/* %MPR%Core/Fx/ -f

cp %CORE%Docs/Fx/* %MPR%Core/Fx/Docu/ -f

REM Native
cp %CORE%Source/Native/* %MPR%Core/Native/ -f

cp %CORE%Docs/Native/* %MPR%Core/Native/Docu/ -f

REM Request
cp %CORE%Source/Request/Request.HTML.js %MPR%Core/Request/Request.Html.js -f
cp %CORE%Source/Request/Request.js %MPR%Core/Request/Request.js -f
cp %CORE%Source/Request/Request.JSON.js %MPR%Core/Request/Request.Json.js -f

cp %CORE%Docs/Request/Request.HTML.md %MPR%Core/Request/Docu/Request.Html.md -f
cp %CORE%Docs/Request/Request.md %MPR%Core/Request/Docu/Request.md -f
cp %CORE%Docs/Request/Request.JSON.md %MPR%Core/Request/Docu/Request.Json.md -f

REM Utilities
cp %CORE%Source/Utilities/* %MPR%Core/Utilities/ -f

cp %CORE%Docs/Utilities/* %MPR%Core/Utilities/Docu/ -f