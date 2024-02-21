// import { Outlet, useNavigate } from 'look-router'
// import type { FC, ReactNode } from 'react'

// const TabsPage: FC = () => {
//   const navigate = useNavigate()

//   return (
//     <>
//       <h1>Tabs</h1>
//       <a
//         href="/#/tab/1"
//         onClick={(e) => {
//           e.preventDefault()
//           e.stopPropagation()
//           navigate('/tab/1')
//         }}
//       >
//         tab1
//       </a>
//       <span style={{ display: 'inline-block', margin: '0 10px' }}>|</span>
//       <a
//         href="/#/tab/2"
//         onClick={(e) => {
//           e.preventDefault()
//           e.stopPropagation()
//           navigate('/tab/2')
//         }}
//       >
//         tab2
//       </a>
//       <div style={{ border: '2px solid #f00' }}>
//         <Outlet />
//       </div>
//     </>
//   )
// }

// export default TabsPage
