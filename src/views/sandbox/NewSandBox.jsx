import { Layout } from "antd";
import React, { Component } from "react";
import TopHeader from "../../components/TopHeader/TopHeader";
import SideNav from "../../components/SideNav/SideNav";
import SwitchRoute from "../../components/SwitchRoute";
import "nprogress/nprogress.css";
import "../sandbox/NewSandBox.css";

const { Content } = Layout;

export default class Sandbox extends Component {
 

  render() {
    return (
      <Layout>
        <SideNav />
        <Layout className="site-layout">
          <TopHeader />
          <Content
            className="site-layout-background"
            style={{
              margin: "24px 16px",
              padding: 24,
              minHeight: 280,
              overflow:'auto'
            }}
          >
            <SwitchRoute />
          </Content>
        </Layout>
      </Layout>
    );
  }
}
