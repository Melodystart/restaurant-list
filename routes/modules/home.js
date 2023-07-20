// 引用 Express 與 Express 路由器
const express = require('express')
const router = express.Router()
// 引用 Restaurant model
const Restaurant = require('../../models/restaurant')
// 函數：排序方式
function sortMethod(sort) {
  if (sort === "類別") {
    return { category: 'asc' }
  } else if (sort === "評分") {
    return { rating: 'desc' }
  } else if (sort === 'A->Z') {
    return { name: 'asc' }
  } else {
    return { name: 'desc' }
  }
}

// 設定路由：首頁
router.get('/', (req, res) => {
  const userId = req.user._id   // 變數設定
  Restaurant.find({ userId })
    .lean() // 把 Mongoose 的 Model 物件轉換成乾淨的 JavaScript 資料陣列
    .then(restaurants => res.render('index', { restaurants }))
    .catch(error => console.log(error))
})

// 設定路由：搜尋餐廳關鍵字 or 餐廳類別 or 排序方式
router.get('/search', (req, res) => {
  let keyword = req.query.keyword
  let sort = req.query.sort //使用者選擇的排序方式

  //若沒輸入內容時，將頁面導回根目錄，顯示出所有餐廳
  if (!keyword && !sort) {
    return res.redirect("/")
  }
  const userId = req.user._id
  Restaurant.find({ userId })
    .lean()
    .sort(sortMethod(sort)) //依使用者選擇的方式做排序
    .then(restaurants => {
      const filterData =
        restaurants.filter(restaurant =>
          restaurant.name.toLowerCase().includes(keyword.toLowerCase().trim()) || restaurant.category.includes(keyword.trim()))

      res.render('index', { restaurants: filterData, keyword: keyword, sort: sort })

    })

})

// 匯出路由模組
module.exports = router