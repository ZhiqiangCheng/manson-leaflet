title 添加到git仓库
@echo off
echo "欢迎！你正在添加项目仓库"
set /p name=请输入项目git地址:
pause
git remote add origin %name%
echo "已添加git remote，请将源码发布至仓库！"
pause