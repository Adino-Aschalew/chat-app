// import React from "react";
// import "./ChatList.css";
// import { Link } from "react-router-dom";
// export default function ChatList() {
//   return (
//     <div className="chat-page">
//       {/* Header */}
//       <header className="chat-header">
//         <Link to='/userProfile'>
//         <div
//           className="avatar"
//           style={{
//             backgroundImage:
//               'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCifdLU0IQAYoaN5KhiGgosjFjlBLrKjGmAeYXnlo8v2zCcB93kTPwFTBW_IWta34CohOCuhWBzZxx3giWwnudiy0vTQ8R5OkdMnhpeiLcM7zz-O4JABXffUiWbYEa2N4w8h1eSudTDRCKHXjeSSm7ZYdVpO_mv2GnnI2vyKu9bqRwq54XvCLlHsDj6FJeAEOq9GNufv8XRxlRwZZlN10UBZOf-iD_sxmH0D5Vd6jmzqeTuW8t4DfVacWT8QyhTJT2plPf9fJymUZ34")',
//           }}
//         />
//         </Link>
//         <h2>Chats</h2>
//         <div className="header-actions">
//           <IconBtn icon="edit_square" />
//           <IconBtn icon="more_horiz" />
//         </div>
//       </header>

//       {/* Search */}
//       <div className="search-bar">
//         <span className="material-symbols-outlined">search</span>
//         <input placeholder="Search messages or people" />
//       </div>

//       {/* Chat List */}
//       <main className="chat-list">
//         <ChatItem
//           name="Sarah Miller"
//           message="I've attached the final design system mocks!"
//           time="12:45 PM"
//           unread={3}
//           online
//           avatar="https://lh3.googleusercontent.com/aida-public/AB6AXuB9OY9FgyaZ_bK5qy4oMDvh6FXk3o0v3-Pa5fZcdBtw4JZNhyFsYjIw-ybB_6ESu_UMosvzXJfuaxk4r6DTDR0RvE9KjIA0hD18RHqq-DFTgHIN0trUtyJNREWi352HsfmTF0jDWbcXHDpxzQckscExZ25DYDwWU4XEeRKi_2MWtRZuTMLUnw5dpFwKAQX-lRR7n51ebmC7_h8QI2DL7BzCrSY5LVCfKaAtHNPQWjlXOAAY6IoKZ8p35VxmNNobcAmKJK7900qbFAXK"
//         />

//         <ChatItem
//           name="Design Team"
//           message="Alex: The new mocks look great!"
//           time="09:12 AM"
//           group
//         />
//         <Link to='/singleChat'>
//         <ChatItem
//           name="Alex Johnson"
//           message="Hey, are we still on for the meeting?"
//           time="Yesterday"
//           seen
//           avatar="https://lh3.googleusercontent.com/aida-public/AB6AXuABju-oQXpX_UibbUl55b5cKgMMFxKLce-btWtsOUvE5VlV4k6xtfTgRJ9JcgxZxQf7Dtv1m1kv8DqnKe_ZTQ5q0C7Gs1ZSxDpQhkVpi8zqT2HG6B_MupSimWMLvWppoMPMrSTiwhvhmOT6CFqncf_L2-oJWLrw6cUmtGes9XKfpN796t_qeWKHWvGcgnXAitW868COXN0dRiiNWqRV4kZBwRdzarE6jwaWSCu6AU8osCe6i5HEc8hRvRhbDu_cjIlWhJqsR0lm0fDP"
//         />
//         </Link>
//       </main>

//       {/* Floating Button */}
//       <button className="fab">
//         <span className="material-symbols-outlined">chat</span>
//       </button>

//       {/* Bottom Nav */}
//       <nav className="bottom-nav">
//         <NavItem icon="chat_bubble" label="Chats" active />
//         <NavItem icon="call" label="Calls" />
//         <NavItem icon="camera_alt" label="Status" />
//         <NavItem icon="settings" label="Settings" />
//       </nav>
//     </div>
//   );
// }

// function IconBtn({ icon }) {
//   return (
//     <button className="icon-btn">
//       <span className="material-symbols-outlined">{icon}</span>
//     </button>
//   );
// }

// function ChatItem({
//   name,
//   message,
//   time,
//   unread,
//   online,
//   seen,
//   group,
//   avatar,
// }) {
//   return (
//     <div className="chat-item">
//       <div className="chat-avatar">
//         {group ? (
//           <span className="material-symbols-outlined">groups</span>
//         ) : (
//           <div
//             className="avatar-img"
//             style={{ backgroundImage: `url(${avatar})` }}
//           />
//         )}
//         {online && <span className="online-dot" />}
//       </div>

//       <div className="chat-content">
//         <div className="chat-top">
//           <p className="name">{name}</p>
//           <span className="time">{time}</span>
//         </div>
//         <div className="chat-bottom">
//           {seen && (
//             <span className="material-symbols-outlined seen">
//               done_all
//             </span>
//           )}
//           <p className="message">{message}</p>
//           {unread && <span className="badge">{unread}</span>}
//         </div>
//       </div>
//     </div>
//   );
// }

// function NavItem({ icon, label, active }) {
//   return (
//     <div className={`nav-item ${active ? "active" : ""}`}>
//       <span className="material-symbols-outlined">{icon}</span>
//       <span>{label}</span>
//     </div>
//   );
// }
