import React from "react";

const Sidebar = () => {
  const menus = [
    { name: "상품 등록", path: "/admin/products" },
    { name: "상품 변경", path: "/admin/productsChange" },
    { name: "회원 관리", path: "/admin/users" },
    { name: "카테고리 등록", path: "/admin/categories" },
    { name: "카테고리 변경", path: "/admin/categoriesChange" },
    { name: "주문 관리", path: "/admin/order" },
  ];

  return (
      <div className="container">
        <article style={{width:300}}>
          <h4 style={{marginLeft:20}}>관리자 옵션 메뉴</h4>
          <ul>
            {menus.map((menu) => {
              return (
                <SidebarItem menu={menu} />
              );
            })}
          </ul>
        </article>
        <hr style={{
          background: "black", height: 1,
          border: 0,
        }} />
      </div>
  );
};

function SidebarItem({ menu }) {
  return (
    <li><a className="item" href={menu.path} style={{color:"black", textDecoration:"none"}}>{menu.name}</a></li>
  );
}

export default Sidebar;
