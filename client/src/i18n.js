import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation resources
const resources = {
  'zh-TW': {
    translation: {
      // Header
      appTitle: "💰 記帳本",
      subtitle: "追蹤您的每月開支",
      welcome: "👋 {{username}}",
      
      // Navigation
      dashboard: "主頁",
      expenses: "支出", 
      addExpense: "新增",
      friends: "朋友",
      
      // Settings
      settings: "⚙️ 設定",
      appearance: "🎨 外觀",
      theme: "主題",
      lightMode: "☀️ 淺色",
      darkMode: "🌙 深色",
      language: "🌐 語言",
      displayLanguage: "顯示語言",
      preferences: "📱 偏好設定",
      enableNotifications: "啟用通知",
      enableAnimations: "啟用動畫",
      done: "完成",
      
      // Expense Modal
      addExpenseTitle: "➕ 新增支出",
      editExpenseTitle: "✏️ 編輯支出",
      amount: "金額",
      category: "類別",
      date: "日期",
      title: "標題（選填）",
      titlePlaceholder: "例如：午餐、油費、購物（可留空快速輸入）",
      description: "描述（選填）",
      descriptionPlaceholder: "關於此筆支出的額外備註...",
      cancel: "取消",
      adding: "新增中...",
      saving: "保存中...",
      add: "➕ 新增",
      save: "💾 保存",
      
      // Dashboard
      thisMonth: "本月",
      totalSpent: "總支出",
      avgPerDay: "日均",
      remaining: "剩餘",
      budget: "預算",
      setBudget: "設置預算",
      
      // Friends
      friendsTitle: "👥 朋友",
      findFriends: "🔍 尋找朋友",
      requests: "請求",
      searchPlaceholder: "以用戶名搜尋...",
      sendRequest: "發送請求",
      accept: "接受",
      reject: "拒絕",
      
      // Auth
      logout: "登出",
      confirmLogout: "確認登出",
      logoutMessage: "您確定要登出嗎？",
      
      // Categories
      general: "一般",
      food: "飲食",
      transport: "交通",
      entertainment: "娛樂",
      shopping: "購物",
      healthcare: "醫療",
      education: "教育",
      utilities: "公用事業",
      
      // Dashboard additional
      monthlyBudget: "月度預算",
      budgetExceeded: "⚠️ 您已超出預算",
      budgetOnTrack: "✅ 做得好！您控制在預算內",
      transactions: "交易筆數",
      topCategories: "📊 本月主要類別",
      recentExpenses: "🕒 最近支出",
      quickStats: "📈 快速統計",
      averagePerTransaction: "每筆交易平均",
      dailyAverage: "日均消費",
      noExpenses: "尚無支出記錄。開始記錄您的支出吧！",
      setBudgetPrompt: "設置您的月度預算：",
      left: "剩餘",
      of: "共",
      
      // Validation
      validAmountRequired: "請輸入有效金額",
      dateRequired: "日期為必填",
      
      // Friends additional
      noSearchResults: "找不到用戶",
      requestSent: "請求已發送",
      alreadyFriends: "已是朋友",
      search: "搜尋",
      totalSpentLabel: "總支出：",
      monthlySpentLabel: "月支出：",
      
      // Common
      loading: "載入中...",
      error: "錯誤",
      success: "成功",
      close: "關閉"
    }
  },
  en: {
    translation: {
      // Header
      appTitle: "💰 Expense Tracker",
      subtitle: "Track your monthly expenses",
      welcome: "👋 {{username}}",
      
      // Navigation
      dashboard: "Dashboard",
      expenses: "Expenses", 
      addExpense: "Add",
      friends: "Friends",
      
      // Settings
      settings: "⚙️ Settings",
      appearance: "🎨 Appearance",
      theme: "Theme",
      lightMode: "☀️ Light",
      darkMode: "🌙 Dark",
      language: "🌐 Language",
      displayLanguage: "Display Language",
      preferences: "📱 Preferences",
      enableNotifications: "Enable notifications",
      enableAnimations: "Enable animations",
      done: "Done",
      
      // Expense Modal
      addExpenseTitle: "➕ Add Expense",
      editExpenseTitle: "✏️ Edit Expense",
      amount: "Amount",
      category: "Category",
      date: "Date",
      title: "Title (Optional)",
      titlePlaceholder: "e.g., Lunch, Gas, Shopping (leave empty for quick entry)",
      description: "Description (Optional)",
      descriptionPlaceholder: "Additional notes about this expense...",
      cancel: "Cancel",
      adding: "Adding...",
      saving: "Saving...",
      add: "➕ Add",
      save: "💾 Save",
      
      // Dashboard
      thisMonth: "This Month",
      totalSpent: "Total Spent",
      avgPerDay: "Avg/Day",
      remaining: "Remaining",
      budget: "Budget",
      setBudget: "Set Budget",
      
      // Friends
      friendsTitle: "👥 Friends",
      findFriends: "🔍 Find Friends",
      requests: "Requests",
      searchPlaceholder: "Search by username...",
      sendRequest: "Send Request",
      accept: "Accept",
      reject: "Reject",
      
      // Auth
      logout: "Logout",
      confirmLogout: "Confirm Logout",
      logoutMessage: "Are you sure you want to logout?",
      
      // Categories
      general: "General",
      food: "Food",
      transport: "Transport",
      entertainment: "Entertainment",
      shopping: "Shopping",
      healthcare: "Healthcare",
      education: "Education",
      utilities: "Utilities",
      
      // Dashboard additional
      monthlyBudget: "Monthly Budget",
      budgetExceeded: "⚠️ You've exceeded your budget by",
      budgetOnTrack: "✅ Great job! You're staying within budget",
      transactions: "Transactions",
      topCategories: "📊 Top Categories This Month",
      recentExpenses: "🕒 Recent Expenses",
      quickStats: "📈 Quick Stats",
      averagePerTransaction: "Average per transaction",
      dailyAverage: "Daily average",
      noExpenses: "No expenses yet. Start tracking your expenses!",
      setBudgetPrompt: "Set your monthly budget:",
      left: "left",
      of: "of",
      
      // Validation
      validAmountRequired: "Please enter a valid amount",
      dateRequired: "Date is required",
      
      // Friends additional
      noSearchResults: "No users found",
      requestSent: "Request sent",
      alreadyFriends: "Already friends",
      search: "Search",
      totalSpentLabel: "Total spent:",
      monthlySpentLabel: "Monthly spent:",
      
      // Common
      loading: "Loading...",
      error: "Error",
      success: "Success",
      close: "Close"
    }
  },
  ja: {
    translation: {
      // Header
      appTitle: "💰 支出トラッカー",
      subtitle: "月々の支出を記録",
      welcome: "👋 {{username}}",
      
      // Navigation
      dashboard: "ダッシュボード",
      expenses: "支出", 
      addExpense: "追加",
      friends: "友達",
      
      // Settings
      settings: "⚙️ 設定",
      appearance: "🎨 外観",
      theme: "テーマ",
      lightMode: "☀️ ライト",
      darkMode: "🌙 ダーク",
      language: "🌐 言語",
      displayLanguage: "表示言語",
      preferences: "📱 設定",
      enableNotifications: "通知を有効にする",
      enableAnimations: "アニメーションを有効にする",
      done: "完了",
      
      // Expense Modal
      addExpenseTitle: "➕ 支出を追加",
      editExpenseTitle: "✏️ 支出を編集",
      amount: "金額",
      category: "カテゴリ",
      date: "日付",
      title: "タイトル（任意）",
      titlePlaceholder: "例：昼食、ガソリン、買い物（空白でも可）",
      description: "説明（任意）",
      descriptionPlaceholder: "この支出に関する追加メモ...",
      cancel: "キャンセル",
      adding: "追加中...",
      saving: "保存中...",
      add: "➕ 追加",
      save: "💾 保存",
      
      // Dashboard
      thisMonth: "今月",
      totalSpent: "総支出",
      avgPerDay: "1日平均",
      remaining: "残高",
      budget: "予算",
      setBudget: "予算設定",
      
      // Friends
      friendsTitle: "👥 友達",
      findFriends: "🔍 友達を探す",
      requests: "リクエスト",
      searchPlaceholder: "ユーザー名で検索...",
      sendRequest: "リクエスト送信",
      accept: "承認",
      reject: "拒否",
      
      // Auth
      logout: "ログアウト",
      confirmLogout: "ログアウト確認",
      logoutMessage: "本当にログアウトしますか？",
      
      // Categories
      general: "一般",
      food: "食費",
      transport: "交通費",
      entertainment: "娯楽",
      shopping: "買い物",
      healthcare: "医療",
      education: "教育",
      utilities: "光熱費",
      
      // Dashboard additional
      monthlyBudget: "月間予算",
      budgetExceeded: "⚠️ 予算を超過しています",
      budgetOnTrack: "✅ 順調です！予算内に収まっています",
      transactions: "取引数",
      topCategories: "📊 今月の主要カテゴリ",
      recentExpenses: "🕒 最近の支出",
      quickStats: "📈 クイック統計",
      averagePerTransaction: "1取引あたりの平均",
      dailyAverage: "1日平均",
      noExpenses: "まだ支出がありません。支出の記録を始めましょう！",
      setBudgetPrompt: "月間予算を設定してください：",
      left: "残り",
      of: "の",
      
      // Validation
      validAmountRequired: "有効な金額を入力してください",
      dateRequired: "日付が必要です",
      
      // Friends additional
      noSearchResults: "ユーザーが見つかりません",
      requestSent: "リクエストを送信しました",
      alreadyFriends: "すでに友達です",
      search: "検索",
      totalSpentLabel: "総支出：",
      monthlySpentLabel: "月支出：",
      
      // Common
      loading: "読み込み中...",
      error: "エラー",
      success: "成功",
      close: "閉じる"
    }
  },
  'zh-CN': {
    translation: {
      // Header
      appTitle: "💰 记账本",
      subtitle: "追踪您的每月开支",
      welcome: "👋 {{username}}",
      
      // Navigation
      dashboard: "首页",
      expenses: "支出", 
      addExpense: "添加",
      friends: "朋友",
      
      // Settings
      settings: "⚙️ 设置",
      appearance: "🎨 外观",
      theme: "主题",
      lightMode: "☀️ 浅色",
      darkMode: "🌙 深色",
      language: "🌐 语言",
      displayLanguage: "显示语言",
      preferences: "📱 偏好设置",
      enableNotifications: "启用通知",
      enableAnimations: "启用动画",
      done: "完成",
      
      // Expense Modal
      addExpenseTitle: "➕ 添加支出",
      editExpenseTitle: "✏️ 编辑支出",
      amount: "金额",
      category: "类别",
      date: "日期",
      title: "标题（可选）",
      titlePlaceholder: "例如：午餐、油费、购物（可留空快速输入）",
      description: "描述（可选）",
      descriptionPlaceholder: "关于此笔支出的额外备注...",
      cancel: "取消",
      adding: "添加中...",
      saving: "保存中...",
      add: "➕ 添加",
      save: "💾 保存",
      
      // Dashboard
      thisMonth: "本月",
      totalSpent: "总支出",
      avgPerDay: "日均",
      remaining: "剩余",
      budget: "预算",
      setBudget: "设置预算",
      
      // Friends
      friendsTitle: "👥 朋友",
      findFriends: "🔍 寻找朋友",
      requests: "请求",
      searchPlaceholder: "以用户名搜索...",
      sendRequest: "发送请求",
      accept: "接受",
      reject: "拒绝",
      
      // Auth
      logout: "登出",
      confirmLogout: "确认登出",
      logoutMessage: "您确定要登出吗？",
      
      // Categories
      general: "一般",
      food: "饮食",
      transport: "交通",
      entertainment: "娱乐",
      shopping: "购物",
      healthcare: "医疗",
      education: "教育",
      utilities: "公用事业",
      
      // Dashboard additional
      monthlyBudget: "月度预算",
      budgetExceeded: "⚠️ 您已超出预算",
      budgetOnTrack: "✅ 做得好！您控制在预算内",
      transactions: "交易笔数",
      topCategories: "📊 本月主要类别",
      recentExpenses: "🕒 最近支出",
      quickStats: "📈 快速统计",
      averagePerTransaction: "每笔交易平均",
      dailyAverage: "日均消费",
      noExpenses: "尚无支出记录。开始记录您的支出吧！",
      setBudgetPrompt: "设置您的月度预算：",
      left: "剩余",
      of: "共",
      
      // Validation
      validAmountRequired: "请输入有效金额",
      dateRequired: "日期为必填",
      
      // Friends additional  
      noSearchResults: "找不到用户",
      requestSent: "请求已发送",
      alreadyFriends: "已是朋友",
      search: "搜索",
      totalSpentLabel: "总支出：",
      monthlySpentLabel: "月支出：",
      
      // Common
      loading: "加载中...",
      error: "错误",
      success: "成功",
      close: "关闭"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'zh-TW', // Traditional Chinese as default
    debug: process.env.NODE_ENV === 'development',
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'expense-tracker-language'
    },

    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
  });

export default i18n;