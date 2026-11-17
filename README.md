# 提瓦特手札 / Teyvat Notes

《计算机基础》课程设计——以“原神”为主题元素的个人网站。

## 页面

- `index.html` 首页 / 三扇门 / 数据 / 每日手记
- `regions.html` 七国风物
- `characters.html` 同行者档案（元素筛选 + 角色弹窗）
- `elements.html` 元素反应实验室（选择两种元素查看反应）
- `journal.html` 旅行日志（时间线）
- `about.html` 关于我 / 制作说明 / 素材版权

## 特点

- 原生 HTML、CSS、JavaScript，无框架、无外部依赖
- 全部页面与图片使用相对路径，适合 GitHub Pages
- 响应式布局，支持手机端
- 星空 canvas、滚动入场、元素筛选、角色弹窗、元素反应交互
- 非官方粉丝作品，仅用于课程学习，非商业用途

## 本地预览

在站点根目录启动一个静态服务器：

```bash
python -m http.server 8000
```

浏览器打开 `http://localhost:8000/`。

## 发布到 GitHub Pages

1. 新建 GitHub 仓库，把本文件夹内的所有文件上传到仓库根目录；
2. 进入仓库 `Settings → Pages`；
3. Source 选择 `Deploy from a branch`，Branch 选择 `main`，目录选择 `/ (root)`；
4. 保存后等待 1–2 分钟，访问 `https://你的用户名.github.io/仓库名/`。

## 素材说明

角色卡面与角色立绘来自 Genshin Impact 官方素材（经 skowt.cc 整理），版权归 COGNOSPHERE / HoYoverse 所有。页面布局、配色、文案与交互代码为课程作业原创。若需长期公开，请自行确认素材使用范围或替换为自有图片。
