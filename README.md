# 🚧 look-router

look-router 的目标是：在移动端单页应用（SPA）中切换路由时能够保留当前页面，提升用户体验。

## 动机

在移动端 Web 中，以 react-router 为例不做任何处理切换路由后，销毁当前页面并展示新的页面。例如从列表页进入详情页时，列表页的 DOM、状态均被销毁，从详情页中重新返回到列表页时，数据需要重新加载，滚动条位置也丢失了。

这样的用户体验确实不够好，而使用 [MoreJS](https://mor.ele.me/) 的[饿了么](https://h5.ele.me/)移动端 Web 路由切换则没有这个问题。

但是 MoreJS 却采用小程序 DSL 进行开发，对于偏爱 JSX 的开发者可能是个问题。

> 当然，你也可以考虑对 [MoreJS](https://mor.ele.me/) 的路由模块进行移植，这可能会是一个可行的方案。

## Demo

使用 react-router 的 [DEMO](https://y-hui.github.io/look-router/demo-dist/normal.html)

使用 look-router 的 [DEMO](https://y-hui.github.io/look-router/demo-dist)

## createRouter

### 配置路由

```tsx
import { createRouter, RouterView } from 'link-router'

const router = createRouter({
  routes: [
    {
      path: '/nest',
      component: lazy(() => import('./pages/nest')),
      children: [
        {
          index: true,
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
    <Suspense>
      <RouterView router={router} />
    </Suspense>
  </React.StrictMode>,
)
```

### 配置

```tsx
interface RouterObject {
  path?: string
  
  // 在使用嵌套路由时，若没有渲染子路由，则默认渲染 index 路由
  index?: true

  // 访问当前路由时，重定向至其他路由
  redirectTo?: To | ((location: Location) => To)
  
  component?: ComponentType

  // 子路由
  children?: RouteObject[]
  
  // 指定路由的外层组件。设置为 null 时，则不对此路由包裹任何组件，需要自行使用 useWatchVisible 控制页面是否可视
  wrapper?: ComponentType<WrapperProps> | null
  
  // 自定义路由元信息
  meta?: Record<string | number | symbol, unknown>
}
```

### meta 类型定义

使用一个 `.ts` 或 `.d.ts` 文件为 meta 字段添加类型，或者直接写在 `createRouter` 上方。

```tsx
declare module 'look-router' {
  interface Meta {
    title: string
    requiresAuth?: boolean
  }
}

const router = createRouter(...)
```



### 路由模式

```ts
import { createRouter } from 'link-router'

createRouter({
  mode: 'hash' | 'history'
})
```

### globalWrapper

look-router 保留当前页面的原理便是 `display: none`，在每一个新的页面外层都会使用 globalWrapper 传递的组件所包裹，在这里，你可以定义全局的包裹组件，或者使用 wrapper 为指定的路由单独配置。

```tsx
import { createRouter, type WrapperProps, useWatchVisible } from 'link-router'

const Wrapper: FC<WrapperProps> = (props) => {
  const { pathname, children } = props
	const visible = useWatchVisible()
  
  return (
    <div style={!visible ? { display: 'none' } : { border: '1px solid #f00' }}>
      {children}
    </div>
  )
}

createRouter({
  // 全局 wrapper
  globalWrapper: Wrapper,
  routes: [
    {
      path: '/',
      // 单独设置 wrapper
      wrapper: Wrapper,
    }
  ],
})
```

### onBeforeEntering

导航到新的页面前执行，支持异步函数。

返回值类型为：`Path | Promise<Path>` 

```ts
import { createRouter } from 'link-router'

createRouter({
  onBeforeEntering(to, from) {
    // 检查是否已登录
    if(!isAuthenticated) {
      return { path: '/login' }
    }
    
    // 继续执行导航
    return to.location
  }
})
```

### onAfterEntering

导航到新的页面后执行，与 onBeforeEntering 不同，它无法修改路由。

```ts
import { createRouter } from 'link-router'

createRouter({
  onAfterEntering(to, from) {
    
  }
})
```

## RouterView

路由入口组件。

```tsx
import { createRouter, RouterView } from 'link-router'

const router = createRouter({...})

const App = () => {
  return <RouterView router={router} />
}
```

## Link

使用 Link 组件代替 `<a href="..." />`

```tsx
import { Link } from 'link-router'

const App = () => {
  return (
    <>
      <Link to="/home">Home</Link>
    	<Link to={{ path: '/home', search: 'tab=1' }}>Home</Link>
    
      {/* 相对路径 */}
    	<Link to="details">To Details</Link>
			<Link to="?id=12">To Details</Link>
    </>
  )
}
```

## NavLink

NavLink 是特殊的 Link 组件，它知道当前页面与传入的 to 是否一致。

```tsx
import { NavLink } from 'link-router'

const App = () => {
  return (
    <>
      <NavLink
        className={({ isActive }) => clsx({'text-red': isActive})}
        to="/home"
      >
      	Home
    	</NavLink>
    
    	<NavLink to="/home">
        {({ isActive }) => {
          return <span>Home</span>
        }}
      </NavLink>
    </>
  )
}
```

## WillPop

WillPop 允许您阻止用户离开当前页面，并向他们提供自定义提示。

若不需要拦截，依然需要调用 `proceed` 函数。

> 注意：无法拦截手动输入路由的情况

```tsx
import { WillPop } from 'link-router'

const App = () => {
  return (
    <WillPop
      onWillPop={({ proceed, to, from }) => {
        if(!isChange) {
          proceed()
          return
        }
        if(window.confirm('数据未保存，确定离开？')) {
          proceed()
        }
      }}
    >
      {...}
    </WillPop>
  )
}
```



## Outlet

当配置嵌套路由时，Outlet 可用于渲染子路由或 index 路由。

```tsx
const router = createRouter({
  routes: [
    {
      path: '/nest',
      component: Nest,
      children: [
        {
          index: true,
          component: NestIndex,
        },
        {
          path: '/nest/1',
          component: Child1,
        },
      ],
    },
  ]
})

const Nest = () => {
  return (
    <div>
      <Outlet />
      <nav>{...}</nav>
    </div>
  )
}

const NestIndex = () => {
  return <div>NestIndex</div>
}

const Child1 = () => {
  return <div>Child1</div>
}
```

如上所示，渲染分以下情况：

- /nest

  无子路由，若存在 index 路由，Outlet 将会渲染 index，否则不渲染。

- /nest/1

  存在子路由，Outlet 将会渲染子路由内容。

## useLocation

此 hook 返回当前的 location 对象。

```tsx
import { useLocation } from 'link-router'

const App = () => {
  const location = useLocation()  
  return (...)
}
```

- location.pathname
  当前 URL 的路径。
- location.search
  当前 URL 的 search 字符串（问号后面的部分）。
- location.hash
  当前 URL 的哈希。

## useNavigate

此 hook 返回一个函数，允许你以编程方式切换页面。

```tsx
import { useNavigate } from 'link-router'

const App = () => {
  const navigate = useNavigate()
  
  const handleClick = () => {
    navigate(-1) // 返回
    navigate(1) // 前进
    navigate("/home")
    navigate({ pathname: "/home", search: "tab=1" })
    navigate("tab1") // 相对路径
    
    navigate("/home", { replace: true }) // 不保留当前页面，重定向到新页面
    navigate("/home", { switch: true }) // 缓存当前页面，并重定向到新页面
    navigate("/home", { clean: true }) // 清空已缓存的页面，并跳转新页面
  }
  
  return (...)
}
```

## useParams

此 hook 用于获取路由配置的参数。

```tsx
import { useParams } from 'link-router'

// 路由配置

// path: /details/:id
// url:  /details/12
const App = () => {
  // 普通用法
  const params = useParams()
  console.log(params.id)
  
  // TypeScript 类型注释
  const params = useParams<{id: string}>()
  
  // format
  const params = useParams((args) => ({id: Number(args.id)}))
  
  return (...)
}
```

## useQuery

此 hook 用于获取 search 参数。

```tsx
import { useQuery } from 'link-router'

// url:  /list?orderBy=desc&keyword=foo
const App = () => {
  // 普通用法
  const params = useQuery()
  console.log(params.orderBy)
  
  // TypeScript 类型注释
  const params = useQuery<{orderBy: string; keyword: string}>()
  
  // format
  const params = useQuery((args) => {...})
  
  return (...)
}
```



## useSetQuery

此 hook 返回一个函数用于更新 search 参数。

```tsx
import { useQuery } from 'link-router'

const App = () => {
  const updateSearch = useSetQuery()
  
  const handle = () => {
    updateSearch({ name: 'foo' })
    
    updateSearch((prevSearch) => {
      return { name: 'foo' }
    })
  }
  
  return (...)
}
```



## useSearchParams

此 hook 为 useQuery 与 useSetQuery 的结合，返回一个 Tuple。

```tsx
import { useSearchParams } from 'link-router'

const App = () => {
  // 普通用法
	const [search, updateSearch] = useSearchParams()
  
  // TypeScript 类型注释
  const [search, updateSearch] = useSearchParams<{orderBy: string; keyword: string}>()
  
  // format
  const [search, updateSearch] = useSearchParams((args) => {...})
  
  return (...)
}
```

## useMeta

此 hook 允许你在组件中获取当前渲染路由的 meta 信息。

```tsx
import { useMeta } from 'link-router'

const Home = () => {
  const meta = useMeta()
  
  console.log(meta?.title)
  
  return (...)
}
```

## useWatchVisible

此 hook 用于判断当前路由是否可见。

```tsx
import { useWatchVisible } from 'link-router'

const Home = () => {
  const visible = useWatchVisible()
  
  console.log('/home 是否可见', visible)
  
  return (...)
}
```

## useWatchVisibleEffect

此 hook 用于路由切换可视状态时执行副作用。

```tsx
import { useWatchVisibleEffect } from 'link-router'

const Home = () => {
  useWatchVisibleEffect((visible) => {
    // ...
  })
  
  return (...)
}
```

