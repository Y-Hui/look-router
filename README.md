# 🚧 look-router

look-router 的目标是：在移动端单页应用（SPA）中打造良好的用户体验。

## 动机

在移动端 Web 中，以 react-router 为例默认情况下切换路由后，先前访问的页面就被销毁了。例如从列表页进入详情页时，列表页的 DOM、状态均被销毁，从详情页中重新返回到列表页时，数据需要重新加载，滚动条位置也丢失了。

这样的用户体验确实不够好，在 App 中，则不会有这种体验。而使用 [MoreJS](https://mor.ele.me/) 的[饿了么](https://h5.ele.me/)移动端 Web 路由切换则达成了这样的要求。

但是 MoreJS 却采用小程序 DSL 进行开发，对于偏爱 JSX 的开发者来说则显得不那么有趣了。所以才尝试写一个 look-router，

> 当然，你也可以不考虑 look-router，尝试对 [MoreJS](https://mor.ele.me/) 的路由模块进行移植可能也会是一个可行的方案。

## 使用

```tsx
import { createRouter, RouterView } from 'link-router'

const router = createRouter({
  routes: [
    {
      path: '/nest',
      component: lazy(() => import('./pages/nest')),
      children: [
        {
          path: '/nest/1',
          component: lazy(() => import('./pages/nest1')),
        },
        {
          path: '/nest/2',
          component: lazy(() => import('./pages/nest2')),
        },
      ],
    },
  ]
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterView router={router} />
  </React.StrictMode>,
)
```



## TODO

- [x] createRouter
- [x] 嵌套路由
- [x] useNavigate
- [ ] useParams
- [x] useWatchVisible
- [ ] 路由参数匹配
- [x] `<Link />`
- [ ] `<RouterView />`

  - [x] 基础功能
  - [ ] onChange
- [x] 自定义路由页面渲染容器（pageComponent）
- [ ] switch 页面（切换页面而不销毁，并且不添加历史记录，适用于使用嵌套路由实现的 TabBar）
- [ ] redirectTo
- [ ] 路由 meta

