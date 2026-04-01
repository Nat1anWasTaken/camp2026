# SITCON Camp 2026 官方網站

SITCON Camp 2026 官方網站，確定開催！7/8–7/12 於國立陽明交通大學。

## 開發

直接開啟 `index.html` 即可預覽，或使用 Live Server 等工具。

## 部署

推送至 `main` branch 後，GitHub Actions 會自動部署至 GitHub Pages。

### 設定 GitHub Pages

1. 前往 Repo Settings → Pages
2. Source 選擇 **GitHub Actions**
3. 推送 commit，等待 Actions 完成即可

## 專案結構

```
camp2026/
├── .github/workflows/deploy.yml  # GitHub Actions 自動部署
├── css/style.css                 # 樣式
├── js/main.js                    # 互動效果
└── index.html                    # 主頁面
```

## 工作人員招募

跳坑表單：https://i.sitcon.org/camp-recruit
招募說明：https://hackmd.io/@SITCON/2026-camp-recruit
