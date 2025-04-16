import React, { useState, useEffect } from "react";
import {
  PieChartOutlined,
  ProjectOutlined,
  UserOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Breadcrumb, Button, theme } from "antd";
import Profile from "../pages/Profile";
import Device from "../pages/dashboard/device";
import WeatherDashboard from "../pages/dashboard/weatherDashboard";
import Usermanagement from "../pages/dashboard/usermanagement";

const { Header, Sider, Content } = Layout;

const getItem = (label, key, icon) => ({ key, icon, label });

const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState("weather");
  const [role, setRole] = useState(null);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);
  }, []);

  const menuItems =
    role === "user"
      ? [
          getItem("Weather Dashboard", "weather", <PieChartOutlined />),
          getItem("My Profile", "profile", <UserOutlined />),
        ]
      : [
          getItem("Weather Dashboard", "weather", <PieChartOutlined />),
          getItem("Device Management", "devices", <ProjectOutlined />),
          getItem("User Management", "user", <UserOutlined />),
        ];

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <div
          style={{
            height: 64,
            margin: 16,
            background: "rgba(255, 255, 255, 0.2)",
          }}
        />
        <Menu
          theme="dark"
          defaultSelectedKeys={["weather"]}
          mode="inline"
          items={menuItems}
          onClick={({ key }) => setSelectedKey(key)}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: "0 16px",
            background: colorBgContainer,
            display: "flex",
            alignItems: "center",
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ marginRight: 16 }}
          />
          <Breadcrumb>
            <Breadcrumb.Item>{selectedKey}</Breadcrumb.Item>
          </Breadcrumb>
        </Header>
        <Content style={{ margin: "16px" }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {selectedKey === "weather" && <WeatherDashboard />}
            {selectedKey === "devices" && role !== "user" && <Device />}
            {selectedKey === "user" && role !== "user" && <Usermanagement />}
            {selectedKey === "profile" && role !== "admin" && <Profile />}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
