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
mv %MPR%Core/Fx/Fx.CSS.js %MPR%Core/Fx/Fx.Css.js

cp %CORE%Docs/Fx/* %MPR%Core/Fx/Docu/ -f
mv %MPR%Core/Fx/Docu/Fx.CSS.md %MPR%Core/Fx/Docu/Fx.Css.md

REM Native
cp %CORE%Source/Native/* %MPR%Core/Native/ -f

cp %CORE%Docs/Native/* %MPR%Core/Native/Docu/ -f

REM Request
cp %CORE%Source/Request/* %MPR%Core/Request/ -f
mv %MPR%Core/Request/Request.HTML.js %MPR%Core/Request/Request.Html.js
mv %MPR%Core/Request/Request.JSON.js %MPR%Core/Request/Request.Json.js

cp %CORE%Docs/Request/* %MPR%Core/Request/Docu/ -f
mv %MPR%Core/Request/Docu/Request.HTML.md %MPR%Core/Request/Docu/Request.Html.md
mv %MPR%Core/Request/Docu/Request.JSON.md %MPR%Core/Request/Docu/Request.Json.md

REM Utilities
cp %CORE%Source/Utilities/* %MPR%Core/Utilities/ -f

cp %CORE%Docs/Utilities/* %MPR%Core/Utilities/Docu/ -f