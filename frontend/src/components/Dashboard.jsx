import React, { useState } from "react";
import {
  PieChartOutlined,
  ProjectOutlined,
  MessageOutlined,
  CreditCardOutlined,
  UserOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Breadcrumb, Button, theme } from "antd";
import Profile from "../pages/Profile";
import Device from "../pages/dashboard/device";
import WeatherDashboard from "../pages/dashboard/weatherDashboard";
import Usermanagement from "../pages/dashboard/usermanagement";


const { Header, Sider, Content, Footer } = Layout;

const getItem = (label, key, icon) => ({ key, icon, label });

const items = [
  getItem("Weather Dashboard", "weather", <PieChartOutlined />),
  getItem("Device Managment", "devices", <ProjectOutlined />),
  getItem("User Management", "user", <UserOutlined />),
  // getItem("Payment", "payment", <CreditCardOutlined />),
  getItem("My Profile", "profile", <UserOutlined />),
];

const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState("overview");
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <div style={{ height: 64, margin: 16, background: "rgba(255, 255, 255, 0.2)" }} />
        <Menu
          theme="dark"
          defaultSelectedKeys={["overview"]}
          mode="inline"
          items={items}
          onClick={({ key }) => setSelectedKey(key)}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: "0 16px", background: colorBgContainer, display: "flex", alignItems: "center" }}>
          <Button type="text" icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />} onClick={() => setCollapsed(!collapsed)} style={{ marginRight: 16 }} />
          <Breadcrumb>
            <Breadcrumb.Item>{selectedKey}</Breadcrumb.Item>
          </Breadcrumb>
        </Header>
        <Content style={{ margin: "16px" }}>
          <div style={{ padding: 24, minHeight: 360, background: colorBgContainer, borderRadius: borderRadiusLG }}>
            {selectedKey === "weather" && <WeatherDashboard/>}
            {selectedKey === "devices" && <Device/>}
            {selectedKey === "user" && <Usermanagement/>}
            {/* {selectedKey === "payment" && <div>Payment Content</div>} */}
            {selectedKey === "profile" && <Profile/>}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
